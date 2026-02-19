import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { getComplaintById } from '../../services/complaintService';
import { COLORS } from '../../utils/constants';
import { getCategoryById } from '../../utils/categories';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../../components/StatusBadge';
import StatusTimeline from '../../components/StatusTimeline';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = SCREEN_WIDTH * 0.6;

export default function ComplaintDetailScreen({ route }) {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const data = await getComplaintById(complaintId);
        setComplaint(data);
      } catch (error) {
        console.error('Error fetching complaint:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={56} color={COLORS.grey} />
          <Text style={styles.errorText}>Complaint not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(complaint.category);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Status */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{complaint.title}</Text>
          <View style={styles.statusRow}>
            <StatusBadge status={complaint.status} />
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <View style={styles.categoryRow}>
            <View
              style={[
                styles.categoryIcon,
                { backgroundColor: category.color + '20' },
              ]}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={category.color}
              />
            </View>
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{complaint.description}</Text>
        </View>

        {/* Images */}
        {complaint.images && complaint.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos ({complaint.images.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScroll}
            >
              {complaint.images.map((imageUri, index) => {
                if (!imageUri || imageUri.trim() === '') return null;
                return (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{
                        uri: imageUri,
                        cache: 'reload',
                      }}
                      style={styles.image}
                      resizeMode="cover"
                      defaultSource={require('../../../assets/icon.png')}
                      onError={(e) => {
                        console.log('Image load error:', e.nativeEvent.error);
                        console.log('Failed URL:', imageUri);
                      }}
                    />
                    <View style={styles.imageCountBadge}>
                      <Text style={styles.imageCountText}>{index + 1}/{complaint.images.length}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Location */}
        {complaint.location && complaint.location.latitude && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
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
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: complaint.location.latitude,
                    longitude: complaint.location.longitude,
                  }}
                  pinColor={COLORS.primary}
                />
              </MapView>
            </View>
            {complaint.location.address && (
              <View style={styles.addressRow}>
                <Ionicons
                  name="location"
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.addressText}>
                  {complaint.location.address}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Status Timeline */}
        {complaint.statusHistory && complaint.statusHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            <StatusTimeline statusHistory={complaint.statusHistory} />
          </View>
        )}

        {/* Created Date */}
        <View style={styles.footerSection}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={styles.dateText}>
            Filed on {formatDate(complaint.createdAt)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  headerSection: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 30,
  },
  statusRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  imageScroll: {
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 0.75,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    marginRight: 12,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  imageCountText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  map: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
