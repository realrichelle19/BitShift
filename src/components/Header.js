import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

export default function Header({ subtitle = 'Learn', playerName = 'Student', onEditName }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* Brand Logo & Name */}
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>BitShift</Text>
            <Text style={styles.brandSubtitle}>{subtitle.toUpperCase()}</Text>
          </View>
        </View>

        {/* Right: Personalized Player Profile (No streaks, No XP, No ranks) */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onEditName}
          activeOpacity={0.7}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../assets/profile.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.playerInfoCol}>
            <Text style={styles.playerNameText} numberOfLines={1}>
              {playerName}
            </Text>
            <View style={styles.playerRoleRow}>
              <Text style={styles.playerRoleText}>Architect</Text>
              {onEditName && (
                <MaterialIcons name="edit" size={11} color={COLORS.terracotta} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.cardCream,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.cardBorder,
    ...SHADOWS.subtleCard,
    paddingTop: Platform.OS === 'ios' ? 44 : 10,
    zIndex: 100,
  },
  headerContent: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  brandTextCol: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.obsidian,
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.terracotta,
    letterSpacing: 1.2,
    lineHeight: 12,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 8,
  },
  avatarWrapper: {
    width: 30,
    height: 30,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
  },
  playerInfoCol: {
    flexDirection: 'column',
    maxWidth: 90,
  },
  playerNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 14,
  },
  playerRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  playerRoleText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.terracotta,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 11,
  },
});
