import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, STATUSES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { getAllComplaints } from '../../services/complaintService';

const AdminProfileScreen = () => {
  const { user, userProfile, logout } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const totalManaged = complaints.length;
  const resolvedCount = complaints.filter(
    (c) => c.status === STATUSES.RESOLVED
  ).length;
  const pendingCount = complaints.filter(
    (c) => c.status === STATUSES.PENDING
  ).length;

  const getInitials = () => {
    const name = userProfile?.name || user?.email || 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <View style={styles.shieldOverlay}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.profileName}>
          {userProfile?.name || 'Admin User'}
        </Text>
        <Text style={styles.profileEmail}>
          {user?.email || 'admin@cleantrack.com'}
        </Text>

        <View style={styles.roleBadge}>
          <Ionicons name="shield" size={14} color={COLORS.white} />
          <Text style={styles.roleBadgeText}>Admin</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBox, { backgroundColor: COLORS.info + '20' }]}>
            <Ionicons name="documents-outline" size={22} color={COLORS.info} />
          </View>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primaryDark}
              style={styles.statLoader}
            />
          ) : (
            <Text style={styles.statNumber}>{totalManaged}</Text>
          )}
          <Text style={styles.statLabel}>Total Managed</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconBox, { backgroundColor: COLORS.success + '20' }]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={COLORS.success}
            />
          </View>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primaryDark}
              style={styles.statLoader}
            />
          ) : (
            <Text style={styles.statNumber}>{resolvedCount}</Text>
          )}
          <Text style={styles.statLabel}>Resolved</Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[styles.statIconBox, { backgroundColor: COLORS.warning + '20' }]}
          >
            <Ionicons name="time-outline" size={22} color={COLORS.warning} />
          </View>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primaryDark}
              style={styles.statLoader}
            />
          ) : (
            <Text style={styles.statNumber}>{pendingCount}</Text>
          )}
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: COLORS.primaryDark + '15' },
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primaryDark}
                />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Account Details</Text>
                <Text style={styles.menuItemSubtitle}>
                  View your admin profile
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.grey}
            />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: COLORS.info + '15' },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={COLORS.info}
                />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Notifications</Text>
                <Text style={styles.menuItemSubtitle}>
                  Manage alert preferences
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.grey}
            />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  { backgroundColor: COLORS.secondary + '15' },
                ]}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={COLORS.secondary}
                />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Settings</Text>
                <Text style={styles.menuItemSubtitle}>App preferences</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.grey}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

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
  profileHeader: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 24,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 3,
    borderColor: COLORS.white + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.white,
  },
  shieldOverlay: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -1,
    paddingTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statLoader: {
    marginVertical: 6,
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AdminProfileScreen;
