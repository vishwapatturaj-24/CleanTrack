import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { createComplaint } from '../../services/complaintService';
import { uploadMultipleImages } from '../../services/storageService';
import { COLORS } from '../../utils/constants';
import CategoryPicker from '../../components/CategoryPicker';
import ImagePickerComponent from '../../components/ImagePickerComponent';
import LocationPicker from '../../components/LocationPicker';

export default function NewComplaintScreen({ navigation }) {
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your complaint.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert(
        'Missing Description',
        'Please describe the issue in detail.'
      );
      return false;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleImages(images);
      }

      const complaintData = {
        title: title.trim(),
        description: description.trim(),
        category,
        images: imageUrls,
        location: location || null,
        userId: user.uid,
        userName: userProfile?.name || 'Unknown User',
      };

      await createComplaint(complaintData);

      Alert.alert(
        'Complaint Submitted',
        'Your complaint has been submitted successfully. You can track its status in My Complaints.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert(
        'Submission Failed',
        'An error occurred while submitting your complaint. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief title of your complaint"
              placeholderTextColor={COLORS.grey}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              editable={!submitting}
            />
          </View>

          {/* Description Input */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the issue in detail..."
              placeholderTextColor={COLORS.grey}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={1000}
              editable={!submitting}
            />
          </View>

          {/* Category Picker */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <CategoryPicker
              selectedCategory={category}
              onSelectCategory={setCategory}
              disabled={submitting}
            />
          </View>

          {/* Image Picker */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Photos</Text>
            <ImagePickerComponent
              images={images}
              onImagesChange={setImages}
              disabled={submitting}
            />
          </View>

          {/* Location Picker */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location</Text>
            <LocationPicker
              location={location}
              onLocationChange={setLocation}
              disabled={submitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Submit Complaint</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Loading Overlay */}
        {submitting && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Submitting complaint...</Text>
              <Text style={styles.loadingSubtext}>
                Please wait while we upload your data
              </Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});
