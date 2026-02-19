import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, STATUSES } from '../../utils/constants';
import { CATEGORIES, getCategoryById } from '../../utils/categories';
import { getAllComplaints } from '../../services/complaintService';
import ComplaintCard from '../../components/ComplaintCard';

const AdminDashboard = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === STATUSES.PENDING).length;
  const inProgressCount = complaints.filter((c) => c.status === STATUSES.IN_PROGRESS).length;
  const resolvedCount = complaints.filter((c) => c.status === STATUSES.RESOLVED).length;

  const categoryBreakdown = CATEGORIES.map((cat) => {
    const count = complaints.filter((c) => c.category === cat.id).length;
    return { ...cat, count };
  }).filter((cat) => cat.count > 0);

  const recentComplaints = complaints.slice(0, 5);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDark} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primaryDark]}
          tintColor={COLORS.primaryDark}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={28} color={COLORS.primaryDark} />
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: COLORS.info }]}>
          <Ionicons name="documents-outline" size={28} color={COLORS.white} />
          <Text style={styles.summaryCount}>{totalCount}</Text>
          <Text style={styles.summaryLabel}>Total Complaints</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#FFA000' }]}>
          <Ionicons name="time-outline" size={28} color={COLORS.white} />
          <Text style={styles.summaryCount}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#1976D2' }]}>
          <Ionicons name="construct-outline" size={28} color={COLORS.white} />
          <Text style={styles.summaryCount}>{inProgressCount}</Text>
          <Text style={styles.summaryLabel}>In Progress</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: COLORS.success }]}>
          <Ionicons name="checkmark-circle-outline" size={28} color={COLORS.white} />
          <Text style={styles.summaryCount}>{resolvedCount}</Text>
          <Text style={styles.summaryLabel}>Resolved</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="grid-outline" size={20} color={COLORS.primaryDark} />
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
        </View>

        <View style={styles.categoryList}>
          {categoryBreakdown.length === 0 ? (
            <Text style={styles.emptyText}>No complaints yet</Text>
          ) : (
            categoryBreakdown.map((cat) => (
              <View key={cat.id} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryIconBox, { backgroundColor: cat.color + '20' }]}>
                    <Ionicons name={cat.icon} size={18} color={cat.color} />
                  </View>
                  <Text style={styles.categoryLabel} numberOfLines={1}>
                    {cat.label}
                  </Text>
                </View>
                <View style={styles.categoryCountBadge}>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Recent Complaints */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color={COLORS.primaryDark} />
          <Text style={styles.sectionTitle}>Recent Complaints</Text>
        </View>

        {recentComplaints.length === 0 ? (
          <Text style={styles.emptyText}>No complaints found</Text>
        ) : (
          recentComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onPress={() =>
                navigation.navigate('ComplaintManage', { complaintId: complaint.id })
              }
            />
          ))
        )}
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
    paddingBottom: 20,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 0,
  },
  summaryCard: {
    width: '46%',
    margin: '2%',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  summaryCount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  categoryList: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  categoryCountBadge: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AdminDashboard;
