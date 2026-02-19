import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import {
  COLORS,
  STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
} from '../../utils/constants';
import { getCategoryById } from '../../utils/categories';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import {
  getComplaintById,
  updateComplaintStatus,
  updateComplaintPriority,
} from '../../services/complaintService';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_OPTIONS = [
  { key: STATUSES.PENDING, label: STATUS_LABELS[STATUSES.PENDING] },
  { key: STATUSES.IN_PROGRESS, label: STATUS_LABELS[STATUSES.IN_PROGRESS] },
  { key: STATUSES.RESOLVED, label: STATUS_LABELS[STATUSES.RESOLVED] },
  { key: STATUSES.REJECTED, label: STATUS_LABELS[STATUSES.REJECTED] },
];

const PRIORITY_OPTIONS = [
  { key: PRIORITIES.LOW, label: 'Low' },
  { key: PRIORITIES.MEDIUM, label: 'Medium' },
  { key: PRIORITIES.HIGH, label: 'High' },
];

const ComplaintManageScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const { user, userProfile } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const fetchComplaint = async () => {
    try {
      const data = await getComplaintById(complaintId);
      if (data) {
        setComplaint(data);
        setSelectedStatus(data.status);
        setSelectedPriority(data.priority || PRIORITIES.MEDIUM);
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      Alert.alert('Error', 'Failed to load complaint details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [complaintId]);

  const handleUpdate = async () => {
    if (!selectedStatus) {
      Alert.alert('Error', 'Please select a status.');
      return;
    }

    setUpdating(true);
    try {
      const updatedByName =
        userProfile?.name || user?.email || 'Admin';

      // Update status if changed
      if (selectedStatus !== complaint.status || adminNote.trim()) {
        await updateComplaintStatus(
          complaintId,
          selectedStatus,
          adminNote.trim() || undefined,
          updatedByName
        );
      }

      // Update priority if changed
      if (selectedPriority !== complaint.priority) {
        await updateComplaintPriority(complaintId, selectedPriority);
      }

      Alert.alert('Success', 'Complaint updated successfully.', [
        {
          text: 'OK',
          onPress: async () => {
            setAdminNote('');
            setLoading(true);
            await fetchComplaint();
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating complaint:', error);
      Alert.alert('Error', 'Failed to update complaint. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const category = complaint ? getCategoryById(complaint.category) : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDark} />
        <Text style={styles.loadingText}>Loading complaint...</Text>
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={56} color={COLORS.danger} />
        <Text style={styles.errorText}>Complaint not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title & Status */}
      <View style={styles.titleSection}>
        <Text style={styles.complaintTitle}>{complaint.title}</Text>
        <View style={styles.badgeRow}>
          <StatusBadge status={complaint.status} />
          {complaint.priority && (
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    (PRIORITY_COLORS[complaint.priority] || COLORS.grey) + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityBadgeText,
                  {
                    color:
                      PRIORITY_COLORS[complaint.priority] || COLORS.grey,
                  },
                ]}
              >
                {complaint.priority?.charAt(0).toUpperCase() +
                  complaint.priority?.slice(1)}{' '}
                Priority
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Category */}
      {category && (
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: category.color + '20' },
              ]}
            >
              <Ionicons name={category.icon} size={20} color={category.color} />
            </View>
            <Text style={styles.categoryText}>{category.label}</Text>
          </View>
        </View>
      )}

      {/* Description */}
      <View style={styles.infoCard}>
        <Text style={styles.cardLabel}>Description</Text>
        <Text style={styles.descriptionText}>{complaint.description}</Text>
      </View>

      {/* Images */}
      {complaint.images && complaint.images.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={styles.cardLabel}>Attached Images</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContent}
          >
            {complaint.images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Location */}
      {complaint.location && (
        <View style={styles.infoCard}>
          <Text style={styles.cardLabel}>Location</Text>
          {complaint.location.address ? (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.primaryDark}
              />
              <Text style={styles.locationText}>
                {complaint.location.address}
              </Text>
            </View>
          ) : null}
          {complaint.location.latitude && complaint.location.longitude && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: complaint.location.latitude,
                  longitude: complaint.location.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: complaint.location.latitude,
                    longitude: complaint.location.longitude,
                  }}
                  title={complaint.title}
                />
              </MapView>
            </View>
          )}
        </View>
      )}

      {/* Submitted By */}
      <View style={styles.infoCard}>
        <View style={styles.submittedByRow}>
          <View style={styles.submittedByLeft}>
            <Ionicons
              name="person-circle-outline"
              size={24}
              color={COLORS.primaryDark}
            />
            <View>
              <Text style={styles.submittedByName}>
                {complaint.userName || 'Unknown User'}
              </Text>
              <Text style={styles.submittedByDate}>
                Submitted {formatDate(complaint.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Admin Actions Section */}
      <View style={styles.adminSection}>
        <View style={styles.adminSectionHeader}>
          <Ionicons name="shield-checkmark" size={22} color={COLORS.primaryDark} />
          <Text style={styles.adminSectionTitle}>ADMIN ACTIONS</Text>
        </View>

        {/* Status Selection */}
        <Text style={styles.actionLabel}>Update Status</Text>
        <View style={styles.optionsRow}>
          {STATUS_OPTIONS.map((option) => {
            const isSelected = selectedStatus === option.key;
            const color = STATUS_COLORS[option.key];
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  isSelected && {
                    backgroundColor: color,
                    borderColor: color,
                  },
                ]}
                onPress={() => setSelectedStatus(option.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isSelected && { color: COLORS.white },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Priority Selection */}
        <Text style={styles.actionLabel}>Update Priority</Text>
        <View style={styles.optionsRow}>
          {PRIORITY_OPTIONS.map((option) => {
            const isSelected = selectedPriority === option.key;
            const color = PRIORITY_COLORS[option.key];
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  styles.priorityButton,
                  isSelected && {
                    backgroundColor: color,
                    borderColor: color,
                  },
                ]}
                onPress={() => setSelectedPriority(option.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isSelected && { color: COLORS.white },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Admin Note */}
        <Text style={styles.actionLabel}>Admin Note</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note about this update..."
          placeholderTextColor={COLORS.grey}
          value={adminNote}
          onChangeText={setAdminNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.updateButton, updating && styles.updateButtonDisabled]}
          onPress={handleUpdate}
          disabled={updating}
          activeOpacity={0.8}
        >
          {updating ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.updateButtonText}>Update Status</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Status Timeline */}
      <View style={styles.timelineSection}>
        <View style={styles.timelineSectionHeader}>
          <Ionicons name="git-branch-outline" size={20} color={COLORS.primaryDark} />
          <Text style={styles.timelineSectionTitle}>Status History</Text>
        </View>
        <StatusTimeline statusHistory={complaint.statusHistory || []} />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
  backButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  complaintTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  imageScrollContent: {
    gap: 10,
    paddingVertical: 4,
  },
  image: {
    width: SCREEN_WIDTH * 0.55,
    height: 180,
    borderRadius: 10,
    backgroundColor: COLORS.lightGrey,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    flex: 1,
  },
  mapContainer: {
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  submittedByRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submittedByLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submittedByName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  submittedByDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  adminSection: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.primaryDark + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  adminSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  adminSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.lightGrey,
  },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  noteInput: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 80,
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  timelineSection: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  timelineSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ComplaintManageScreen;
