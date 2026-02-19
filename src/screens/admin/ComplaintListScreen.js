import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  COLORS,
  STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
} from '../../utils/constants';
import { CATEGORIES } from '../../utils/categories';
import { getAllComplaints } from '../../services/complaintService';
import ComplaintCard from '../../components/ComplaintCard';

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: STATUSES.PENDING, label: STATUS_LABELS[STATUSES.PENDING] },
  { key: STATUSES.IN_PROGRESS, label: STATUS_LABELS[STATUSES.IN_PROGRESS] },
  { key: STATUSES.RESOLVED, label: STATUS_LABELS[STATUSES.RESOLVED] },
  { key: STATUSES.REJECTED, label: STATUS_LABELS[STATUSES.REJECTED] },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All', icon: 'apps-outline', color: COLORS.primaryDark },
  ...CATEGORIES.map((cat) => ({
    key: cat.id,
    label: cat.label,
    icon: cat.icon,
    color: cat.color,
  })),
];

const ComplaintListScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || c.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const renderComplaint = ({ item }) => (
    <ComplaintCard
      complaint={item}
      onPress={() =>
        navigation.navigate('ComplaintManage', { complaintId: item.id })
      }
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={56} color={COLORS.grey} />
      <Text style={styles.emptyTitle}>No Complaints Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryDark} />
        <Text style={styles.loadingText}>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.grey} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          placeholderTextColor={COLORS.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter Chips */}
      <FlatList
        horizontal
        data={STATUS_FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const isSelected = selectedStatus === item.key;
          const chipColor =
            item.key === 'all'
              ? COLORS.primaryDark
              : STATUS_COLORS[item.key] || COLORS.primaryDark;
          return (
            <TouchableOpacity
              style={[
                styles.filterChip,
                isSelected && { backgroundColor: chipColor },
              ]}
              onPress={() => setSelectedStatus(item.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && { color: COLORS.white },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Category Filter Chips */}
      <FlatList
        horizontal
        data={CATEGORY_FILTERS}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => {
          const isSelected = selectedCategory === item.key;
          return (
            <TouchableOpacity
              style={[
                styles.filterChip,
                styles.categoryChip,
                isSelected && { backgroundColor: item.color },
              ]}
              onPress={() => setSelectedCategory(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={14}
                color={isSelected ? COLORS.white : item.color}
              />
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && { color: COLORS.white },
                ]}
                numberOfLines={1}
              >
                {item.key === 'all' ? 'All' : item.label.split(' /')[0].split(' (')[0]}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          {filteredComplaints.length}{' '}
          {filteredComplaints.length === 1 ? 'result' : 'results'}
        </Text>
      </View>

      {/* Complaint List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaint}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primaryDark]}
            tintColor={COLORS.primaryDark}
          />
        }
        contentContainerStyle={
          filteredComplaints.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 46,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 10,
    paddingVertical: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChip: {
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  resultsBar: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});

export default ComplaintListScreen;
