import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { getMyComplaints } from '../../services/complaintService';
import { COLORS, STATUSES, STATUS_LABELS } from '../../utils/constants';
import ComplaintCard from '../../components/ComplaintCard';

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: STATUSES.PENDING, label: STATUS_LABELS[STATUSES.PENDING] },
  { key: STATUSES.IN_PROGRESS, label: STATUS_LABELS[STATUSES.IN_PROGRESS] },
  { key: STATUSES.RESOLVED, label: STATUS_LABELS[STATUSES.RESOLVED] },
  { key: STATUSES.REJECTED, label: STATUS_LABELS[STATUSES.REJECTED] },
];

export default function MyComplaintsScreen({ navigation }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

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

  const filteredComplaints =
    selectedFilter === 'all'
      ? complaints
      : complaints.filter((c) => c.status === selectedFilter);

  const renderFilterChip = ({ key, label }) => {
    const isSelected = selectedFilter === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => setSelectedFilter(key)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderComplaintItem = ({ item }) => (
    <ComplaintCard
      complaint={item}
      onPress={() =>
        navigation.navigate('ComplaintDetail', { complaintId: item.id })
      }
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={56} color={COLORS.grey} />
      <Text style={styles.emptyTitle}>No complaints found</Text>
      <Text style={styles.emptySubtext}>
        {selectedFilter === 'all'
          ? "You haven't filed any complaints yet."
          : `No ${STATUS_LABELS[selectedFilter]?.toLowerCase() || ''} complaints found.`}
      </Text>
    </View>
  );

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
      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          data={FILTER_OPTIONS}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Complaints List */}
      <FlatList
        data={filteredComplaints}
        renderItem={renderComplaintItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredComplaints.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrey,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextSelected: {
    color: COLORS.white,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
