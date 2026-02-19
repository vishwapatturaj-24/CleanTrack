import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS } from '../utils/constants';
import { getCategoryById } from '../utils/categories';
import { getTimeAgo, truncateText } from '../utils/helpers';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint, onPress }) => {
  const category = getCategoryById(complaint.category);
  const statusColor = STATUS_COLORS[complaint.status] || COLORS.grey;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftWidth: 4, borderLeftColor: statusColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {complaint.title}
        </Text>
        <StatusBadge status={complaint.status} />
      </View>

      <Text style={styles.description}>
        {truncateText(complaint.description, 100)}
      </Text>

      <View style={styles.footer}>
        {category && (
          <View style={styles.categoryContainer}>
            <Ionicons
              name={category.icon}
              size={14}
              color={category.color}
            />
            <Text style={styles.categoryLabel}>{category.label}</Text>
          </View>
        )}
        <Text style={styles.timeAgo}>{getTimeAgo(complaint.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default ComplaintCard;
