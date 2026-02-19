import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return 'time';
    case 'in_progress':
      return 'construct';
    case 'resolved':
      return 'checkmark-circle';
    case 'rejected':
      return 'close-circle';
    default:
      return 'ellipse';
  }
};

const StatusBadge = ({ status, size = 'small' }) => {
  const color = STATUS_COLORS[status] || '#9E9E9E';
  const label = STATUS_LABELS[status] || status || 'Unknown';
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: color },
      isLarge && styles.badgeLarge,
    ]}>
      <Ionicons
        name={getStatusIcon(status)}
        size={isLarge ? 16 : 12}
        color="#FFFFFF"
      />
      <Text style={[
        styles.label,
        isLarge && styles.labelLarge,
      ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  labelLarge: {
    fontSize: 14,
  },
});

export default StatusBadge;
