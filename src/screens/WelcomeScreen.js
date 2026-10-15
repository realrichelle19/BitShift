import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import { storePlayerName } from '../utils/storage';

export default function WelcomeScreen({ onComplete }) {
  const [nameInput, setNameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your name to continue.');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    await storePlayerName(trimmed);
    setIsSubmitting(false);
    onComplete(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Logo & Header */}
          <View style={styles.headerBlock}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.titleCol}>
              <Text style={styles.title}>BitShift</Text>
              <Text style={styles.subtitle}>ARCHITECTURAL LEARNING SYSTEM</Text>
            </View>
          </View>

          {/* Mission Tag */}
          <View style={styles.tagRow}>
            <View style={styles.chipNavy}>
              <MaterialIcons name="memory" size={14} color={COLORS.cardCream} />
              <Text style={styles.chipText}>ALU Hardware Laboratory</Text>
            </View>
          </View>

          {/* Welcome Message */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Welcome, Future Architect</Text>
            <Text style={styles.infoBody}>
              Master the Shift-and-Add Multiplication Algorithm through interactive
              hardware registers, live ALU addition trace matrices, and timed binary
              logic quests.
            </Text>
          </View>

          {/* Name Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ENTER YOUR NAME</Text>
            <TextInput
              style={[
                styles.textInput,
                errorMessage ? styles.textInputError : null,
              ]}
              placeholder="e.g. Richelle, Alex, Sam"
              placeholderTextColor={COLORS.textMuted}
              value={nameInput}
              onChangeText={(text) => {
                setNameInput(text);
                if (errorMessage) setErrorMessage('');
              }}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
            />
            {errorMessage ? (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color="#BA1A1A" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : (
              <Text style={styles.hintText}>
                Your name will personalize your learning dashboard and quest completion honors.
              </Text>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>
              {isSubmitting ? 'Entering Laboratory...' : 'Enter BitShift'}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>

          {/* Micro Footer Spec */}
          <View style={styles.footerRow}>
            <MaterialIcons name="verified" size={14} color={COLORS.terracotta} />
            <Text style={styles.footerText}>Computer Engineering Architecture • ALU Core</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    padding: 24,
    gap: 18,
    ...SHADOWS.subtleCard,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  titleCol: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.obsidian,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1.5,
    lineHeight: 14,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tagRow: {
    flexDirection: 'row',
  },
  chipNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  chipText: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  infoBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  infoBody: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    lineHeight: 19,
  },
  inputSection: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.obsidian,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  textInput: {
    backgroundColor: COLORS.pageBg,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  textInputError: {
    borderColor: '#BA1A1A',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    color: '#BA1A1A',
    fontSize: 12,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  continueBtn: {
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.hardInk,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 4,
  },
  footerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
