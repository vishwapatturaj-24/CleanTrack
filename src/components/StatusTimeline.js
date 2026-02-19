import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, STATUS_COLORS, STATUS_LABELS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const StatusTimeline = ({ statusHistory = [] }) => {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No status updates yet.</Text>
      </View>
    );
  }

  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'in_progress':
        return 'construct-outline';
      case 'resolved':
        return 'checkmark-circle-outline';
      case 'rejected':
        return 'close-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <View style={styles.container}>
      {sortedHistory.map((entry, index) => {
        const isLast = index === sortedHistory.length - 1;
        const dotColor = STATUS_COLORS[entry.status] || '#9E9E9E';
        const label = STATUS_LABELS[entry.status] || entry.status;

        return (
          <View key={index} style={styles.entryRow}>
            {/* Timeline column */}
            <View style={styles.timelineColumn}>
              <View style={[styles.dot, { backgroundColor: dotColor }]}>
                <Ionicons
                  name={getStatusIcon(entry.status)}
                  size={14}
                  color={COLORS.white}
                />
              </View>
              {!isLast && (
                <View style={[styles.line, { backgroundColor: COLORS.border }]} />
              )}
            </View>

            {/* Content column */}
            <View style={[styles.contentColumn, !isLast && styles.contentSpacing]}>
              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: dotColor }]}>
                  {label}
                </Text>
                <Text style={styles.dateText}>
                  {formatDate(entry.updatedAt)}
                </Text>
              </View>

              {entry.note ? (
                <Text style={styles.noteText}>{entry.note}</Text>
              ) : null}

              {entry.updatedBy ? (
                <Text style={styles.updatedByText}>
                  By {entry.updatedBy}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  entryRow: {
    flexDirection: 'row',
  },
  timelineColumn: {
    width: 32,
    alignItems: 'center',
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
    paddingLeft: 12,
  },
  contentSpacing: {
    paddingBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginTop: 2,
  },
  updatedByText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default StatusTimeline;
