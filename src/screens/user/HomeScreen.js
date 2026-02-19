import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { getMyComplaints } from '../../services/complaintService';
import { COLORS, STATUSES } from '../../utils/constants';
import ComplaintCard from '../../components/ComplaintCard';

export default function HomeScreen({ navigation }) {
  const { user, userProfile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getMyComplaints(user.uid);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchComplaints();
    }, [fetchComplaints])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints();
  }, [fetchComplaints]);

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === STATUSES.PENDING
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === STATUSES.RESOLVED
  ).length;

  const recentComplaints = complaints.slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Hello, {userProfile?.name || 'User'}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            Track and manage your complaints
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.primary + '15' }]}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.summaryCount}>{totalComplaints}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.warning + '15' }]}>
            <Ionicons name="time" size={24} color={COLORS.warning} />
            <Text style={styles.summaryCount}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: COLORS.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
            <Text style={styles.summaryCount}>{resolvedCount}</Text>
            <Text style={styles.summaryLabel}>Resolved</Text>
          </View>
        </View>

        {/* File New Complaint Button */}
        <TouchableOpacity
          style={styles.newComplaintButton}
          onPress={() => navigation.navigate('NewComplaint')}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.white} />
          <Text style={styles.newComplaintButtonText}>File New Complaint</Text>
        </TouchableOpacity>

        {/* Recent Complaints */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Complaints</Text>
            {complaints.length > 5 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('MyComplaints')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentComplaints.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color={COLORS.grey}
              />
              <Text style={styles.emptyText}>No complaints yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the button above to file your first complaint
              </Text>
            </View>
          ) : (
            recentComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onPress={() =>
                  navigation.navigate('ComplaintDetail', {
                    complaintId: complaint.id,
                  })
                }
              />
            ))
          )}
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
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  newComplaintButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  newComplaintButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  recentSection: {
    marginTop: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 4,
    textAlign: 'center',
  },
});
