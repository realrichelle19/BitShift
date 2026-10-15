import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function BottomNav({ activeTab, onTabSelect }) {
  const tabs = [
    { key: 'learn', label: 'Learn', icon: 'menu-book' },
    { key: 'simulator', label: 'Simulator', icon: 'memory' },
    { key: 'quest', label: 'Quest', icon: 'emoji-events' },
    { key: 'table', label: 'Table', icon: 'grid-view' },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.navRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => onTabSelect(tab.key)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={isActive ? COLORS.terracotta : COLORS.obsidian}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: COLORS.cardCream,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.cardBorder,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#1E223D',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  navRow: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
  activeLabel: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  inactiveLabel: {
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
