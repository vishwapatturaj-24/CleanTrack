import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';
import { CATEGORIES } from '../utils/categories';

const CategoryPicker = ({ selectedCategory, onSelectCategory }) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected,
          isSelected && { borderColor: COLORS.primary },
        ]}
        onPress={() => onSelectCategory(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.color + '1A' },
            isSelected && { backgroundColor: COLORS.primary + '1A' },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={isSelected ? COLORS.primary : item.color}
          />
        </View>
        <Text
          style={[
            styles.categoryLabel,
            isSelected && styles.categoryLabelSelected,
          ]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        {isSelected && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  listContent: {
    gap: 10,
  },
  row: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  categoryItem: {
    flex: 1,
    maxWidth: '31%',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary + '0D',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryLabelSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
});

export default CategoryPicker;
