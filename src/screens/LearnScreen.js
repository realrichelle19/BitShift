import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';

const SIMULATION_STATES = [
  {
    cycle: 'Cycle: 1 of 4',
    action: 'Q₀ is 1 → ADD M to A',
    desc: 'Initial: Q=0011 (3), M=00000101 (5). Q₀=1, so A becomes 5 (0+5).',
    mVal: 'Value: 5',
    mBits: ['0', '0', '0', '0', '0', '1', '0', '1'],
    qVal: 'Value: 3',
    qBits: ['0', '0', '1', '1'],
    accumulator: '0000 0101 (5)',
  },
  {
    cycle: 'Cycle: 2 of 4',
    action: 'Shifted & Q₀ is 1 → ADD M',
    desc: 'M shifted LEFT to 10 (00001010). Q shifted RIGHT to 1 (0001). Q₀=1! A = 5 + 10 = 15.',
    mVal: 'Value: 10 (Left Shifted)',
    mBits: ['0', '0', '0', '0', '1', '0', '1', '0'],
    qVal: 'Value: 1 (Right Shifted)',
    qBits: ['0', '0', '0', '1'],
    accumulator: '0000 1111 (15)',
  },
  {
    cycle: 'Cycle: 3 of 4',
    action: 'Shifted & Q₀ is 0 → SKIP ADD',
    desc: 'M shifted to 20 (00010100). Q shifted to 0 (0000). Q₀=0! Skip add, sum holds at 15.',
    mVal: 'Value: 20 (Left Shifted)',
    mBits: ['0', '0', '0', '1', '0', '1', '0', '0'],
    qVal: 'Value: 0 (Right Shifted)',
    qBits: ['0', '0', '0', '0'],
    accumulator: '0000 1111 (15)',
  },
  {
    cycle: 'Cycle: Completed!',
    action: 'Final Product Verified: 15',
    desc: 'Multiplier Q is exhausted (0000). Final Accumulator = 15 (00001111₂). 5 × 3 = 15!',
    mVal: 'Value: 40 (Final)',
    mBits: ['0', '0', '1', '0', '1', '0', '0', '0'],
    qVal: 'Value: 0 (Done)',
    qBits: ['0', '0', '0', '0'],
    accumulator: '0000 1111 (15)',
  },
];

export default function LearnScreen({ playerName = 'Student', onNavigateToSimulator, onNavigateToQuest }) {
  const [simStep, setSimStep] = useState(0);
  const currentSim = SIMULATION_STATES[simStep];
  const isFinished = simStep === SIMULATION_STATES.length - 1;

  const handleNextStep = () => {
    setSimStep((prev) => (prev + 1) % SIMULATION_STATES.length);
  };

  const handleReset = () => {
    setSimStep(0);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Personalized Greeting Card */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingTopRow}>
          <View style={styles.greetingBadge}>
            <MaterialIcons name="waving-hand" size={14} color={COLORS.terracotta} />
            <Text style={styles.greetingBadgeText}>WELCOME BACK</Text>
          </View>
          <Text style={styles.curriculumTag}>ALU MODULE 04</Text>
        </View>
        <Text style={styles.greetingHeading}>
          Ready for your next challenge, <Text style={styles.greetingName}>{playerName}</Text>?
        </Text>
        <Text style={styles.greetingSub}>
          Explore the architecture of the Shift-and-Add Multiplier below or jump straight into the timed interactive quest.
        </Text>

        {/* Quick Launch Buttons */}
        <View style={styles.quickLaunchRow}>
          <TouchableOpacity
            style={styles.quickQuestBtn}
            onPress={onNavigateToQuest}
            activeOpacity={0.85}
          >
            <MaterialIcons name="emoji-events" size={16} color={COLORS.white} />
            <Text style={styles.quickQuestBtnText}>Start 5-Level Quest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickSimBtn}
            onPress={onNavigateToSimulator}
            activeOpacity={0.85}
          >
            <MaterialIcons name="memory" size={16} color={COLORS.obsidian} />
            <Text style={styles.quickSimBtnText}>Open Simulator</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. Core Module Specification Card */}
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <View style={styles.missionBadge}>
            <MaterialIcons name="terminal" size={15} color={COLORS.white} />
            <Text style={styles.missionText}>MISSION 04</Text>
          </View>
          <View style={styles.architecturePill}>
            <Text style={styles.architecturePillText}>Computer Architecture</Text>
          </View>
        </View>

        <Text style={styles.title}>The Shift-and-Add Multiplier</Text>
        <Text style={styles.subtitle}>
          Arithmetic Logic Unit (ALU) • Sequential Hardware Logic
        </Text>
      </View>

      {/* 2. Mission Briefing: How Computers Multiply */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconSquare}>
            <MaterialIcons name="lightbulb" size={18} color={COLORS.white} />
          </View>
          <Text style={styles.cardTitle}>Mission Briefing: How Computers Multiply</Text>
        </View>
        <Text style={styles.bodyText}>
          CPUs cannot natively perform grade-school long multiplication in one step.
          Instead, they harness the elegance of binary base-2: every left shift is a
          multiplication by <Text style={styles.boldTerracotta}>2</Text>, and checking
          digits is just reading the lowest bit!
        </Text>

        {/* Base 10 vs Base 2 Side-by-side Logic Matrix */}
        <View style={styles.matrixContainer}>
          <View style={styles.matrixBoxLight}>
            <View style={styles.matrixBoxHeader}>
              <Text style={styles.matrixBoxTitle}>HUMAN DECIMAL MENTAL MODEL</Text>
              <Text style={styles.basePillLight}>Base 10</Text>
            </View>
            <Text style={styles.matrixCode}>
              23 × 12 = 23 × (10 + 2) ={' '}
              <Text style={styles.boldTerracotta}>230</Text> +{' '}
              <Text style={styles.boldTerracotta}>46</Text> ={' '}
              <Text style={styles.boldObsidian}>276</Text>
            </Text>
          </View>

          <View style={styles.matrixBoxDark}>
            <View style={styles.matrixBoxHeader}>
              <Text style={styles.matrixBoxTitleDark}>ALU BINARY POWERS-OF-2</Text>
              <Text style={styles.basePillDark}>Base 2</Text>
            </View>
            <Text style={styles.matrixCodeDark}>
              0101₂ × 0011₂ = (5 × 2¹) + (5 × 2⁰) ={' '}
              <Text style={styles.boldTerracottaLight}>10</Text> +{' '}
              <Text style={styles.boldTerracottaLight}>5</Text> ={' '}
              <Text style={styles.highlightProduct}>15</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 3. The Three Legendary Registers */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>The Three Legendary Registers</Text>
        <View style={styles.specsPill}>
          <Text style={styles.specsText}>Interactive Specs</Text>
        </View>
      </View>

      {/* Register A: Accumulator */}
      <View style={styles.card}>
        <View style={styles.regHeaderRow}>
          <View style={styles.regLeft}>
            <View style={styles.regBadgeNavy}>
              <Text style={styles.regLetter}>A</Text>
            </View>
            <View>
              <Text style={styles.regTitle}>Accumulator</Text>
              <Text style={styles.regSub}>8-bit Register • Running Sum</Text>
            </View>
          </View>
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default: 0x00</Text>
          </View>
        </View>
        <Text style={styles.bodySm}>
          Accumulates partial products. Starts cleared. When Q₀ = 1, the Multiplicand
          (M) is summed into this bank.
        </Text>
        <View style={styles.bitRow}>
          {['0', '0', '0', '0', '0', '0', '0', '0'].map((bit, idx) => (
            <View key={idx} style={styles.bitCellMuted}>
              <Text style={styles.bitTextMuted}>{bit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Register M: Multiplicand */}
      <View style={styles.card}>
        <View style={styles.regHeaderRow}>
          <View style={styles.regLeft}>
            <View style={styles.regBadgeFlame}>
              <Text style={styles.regLetter}>M</Text>
            </View>
            <View>
              <Text style={styles.regTitle}>Multiplicand</Text>
              <Text style={styles.regSubFlame}>8-bit Register • Value: 5 (0101₂)</Text>
            </View>
          </View>
          <View style={styles.shlBadge}>
            <MaterialIcons name="arrow-back" size={13} color={COLORS.terracotta} />
            <Text style={styles.shlText}>SHL « 1</Text>
          </View>
        </View>
        <Text style={styles.bodySm}>
          Shifts <Text style={styles.boldObsidian}>LEFT</Text> by 1 bit each
          iteration. Each left shift doubles the value (5 → 10 → 20 → 40), scaling it
          to the current binary power!
        </Text>
        <View style={styles.bitRow}>
          {['0', '0', '0', '0', '0', '1', '0', '1'].map((bit, idx) => {
            const isHigh = bit === '1';
            return (
              <View
                key={idx}
                style={isHigh ? styles.bitCellFlame : styles.bitCellMuted}
              >
                <Text style={isHigh ? styles.bitTextFlame : styles.bitTextMuted}>
                  {bit}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Register Q: Multiplier */}
      <View style={styles.card}>
        <View style={styles.regHeaderRow}>
          <View style={styles.regLeft}>
            <View style={styles.regBadgeNavy}>
              <Text style={styles.regLetter}>Q</Text>
            </View>
            <View>
              <Text style={styles.regTitle}>Multiplier</Text>
              <Text style={styles.regSub}>4-bit Register • Value: 3 (0011₂)</Text>
            </View>
          </View>
          <View style={styles.shrBadge}>
            <Text style={styles.shrText}>SHR » 1</Text>
            <MaterialIcons name="arrow-forward" size={13} color={COLORS.obsidian} />
          </View>
        </View>
        <Text style={styles.bodySm}>
          The hardware scanner! We only ever examine bit{' '}
          <Text style={styles.boldTerracotta}>Q₀</Text> (Least Significant Bit). Shifts{' '}
          <Text style={styles.boldObsidian}>RIGHT</Text> after each test.
        </Text>
        <View style={styles.qBitRow}>
          {['0', '0', '1', '1'].map((bit, idx) => {
            const isLsb = idx === 3;
            return (
              <View key={idx} style={styles.qBitWrapper}>
                <View
                  style={isLsb ? styles.bitCellFlameLsb : styles.bitCellMutedWide}
                >
                  <Text style={isLsb ? styles.bitTextFlame : styles.bitTextMuted}>
                    {bit}
                  </Text>
                </View>
                {isLsb && <Text style={styles.lsbLabel}>Q₀ (LSB)</Text>}
              </View>
            );
          })}
        </View>
      </View>

      {/* 4. The Golden Rule of Multiplication */}
      <View style={styles.ruleCard}>
        <View style={styles.ruleCardHeader}>
          <MaterialIcons name="verified" size={24} color={COLORS.terracotta} />
          <Text style={styles.ruleCardTitle}>The Golden Rule of Multiplication</Text>
        </View>

        <View style={styles.ruleItemsContainer}>
          <View style={styles.ruleItem}>
            <MaterialIcons name="check-circle" size={18} color={COLORS.terracotta} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleTerracotta}>If Q₀ == 1: </Text>
              Add M into Accumulator A (A = A + M).
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <MaterialIcons name="cancel" size={18} color={COLORS.terracottaSoft} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleLight}>If Q₀ == 0: </Text>
              Skip the addition! Accumulator stays unchanged.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <MaterialIcons name="sync-alt" size={18} color={COLORS.terracotta} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleTerracotta}>Always: </Text>
              Shift M LEFT « 1 and shift Q RIGHT » 1. Repeat for each bit!
            </Text>
          </View>
        </View>
      </View>

      {/* 5. Interactive Shift Explorer */}
      <View style={styles.card}>
        <View style={styles.cardHeaderBetween}>
          <View style={styles.iconTitleRow}>
            <MaterialIcons name="play-circle" size={22} color={COLORS.terracotta} />
            <Text style={styles.cardTitle}>Interactive Shift Explorer</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.actionPillBtn,
              isFinished && { backgroundColor: COLORS.terracotta },
            ]}
            onPress={handleNextStep}
            activeOpacity={0.8}
          >
            <Text style={styles.actionPillBtnText}>
              {isFinished ? 'Finished!' : 'Simulate Shift'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Live Step Explanation Box */}
        <View style={styles.explanationBox}>
          <View style={styles.explanationHeader}>
            <Text style={styles.cycleLabel}>{currentSim.cycle}</Text>
            <View style={styles.actionBadgePill}>
              <Text style={styles.actionBadgeText}>{currentSim.action}</Text>
            </View>
          </View>
          <Text style={styles.stepDesc}>{currentSim.desc}</Text>
          <View style={styles.accumRow}>
            <Text style={styles.accumLabel}>Accumulator (A): </Text>
            <Text style={styles.accumValue}>{currentSim.accumulator}</Text>
          </View>
        </View>

        {/* M Shift View */}
        <View style={styles.shiftTrackSection}>
          <View style={styles.shiftTrackHeader}>
            <Text style={styles.trackName}>Multiplicand (M) « Left Shift</Text>
            <Text style={styles.trackValue}>{currentSim.mVal}</Text>
          </View>
          <View style={styles.bitRow}>
            {currentSim.mBits.map((b, i) => {
              const isHigh = b === '1';
              return (
                <View
                  key={i}
                  style={isHigh ? styles.bitCellFlame : styles.bitCellMuted}
                >
                  <Text style={isHigh ? styles.bitTextFlame : styles.bitTextMuted}>
                    {b}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Q Shift View */}
        <View style={styles.shiftTrackSection}>
          <View style={styles.shiftTrackHeader}>
            <Text style={styles.trackName}>Multiplier (Q) » Right Shift</Text>
            <Text style={styles.trackValue}>{currentSim.qVal}</Text>
          </View>
          <View style={styles.qBitRowInteractive}>
            {currentSim.qBits.map((b, i) => {
              const isLsb = i === 3;
              const isHigh = b === '1';
              return (
                <View
                  key={i}
                  style={[
                    styles.bitCellMutedWide,
                    isLsb && isHigh && styles.bitCellFlameLsb,
                    !isLsb && isHigh && styles.bitCellActiveWide,
                  ]}
                >
                  <Text
                    style={[
                      styles.bitTextMuted,
                      isLsb && isHigh && styles.bitTextFlame,
                      !isLsb && isHigh && styles.bitTextObsidian,
                    ]}
                  >
                    {b}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Reset Demo */}
        <TouchableOpacity
          style={styles.resetRow}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <MaterialIcons name="restart-alt" size={16} color={COLORS.textMuted} />
          <Text style={styles.resetText}>Reset Demo</Text>
        </TouchableOpacity>
      </View>

      {/* 6. Exam Pro-Tip Callout Banner */}
      <View style={styles.proTipCard}>
        <View style={styles.proTipIcon}>
          <MaterialIcons name="bolt" size={20} color={COLORS.white} />
        </View>
        <View style={styles.proTipTextCol}>
          <Text style={styles.proTipLabel}>EXAM PRO-TIP</Text>
          <Text style={styles.proTipText}>
            Remember the sacred 4-beat cycle:{' '}
            <Text style={styles.boldObsidian}>CHECK</Text> →{' '}
            <Text style={styles.boldTerracotta}>ADD</Text> (if Q₀=1) →{' '}
            <Text style={styles.boldObsidian}>SHIFT</Text> →{' '}
            <Text style={styles.boldTerracotta}>REPEAT</Text>.
          </Text>
        </View>
      </View>

      {/* 7. Bottom Action CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onNavigateToSimulator}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Enter Step-by-Step Simulator</Text>
          <MaterialIcons name="arrow-forward" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.ctaNote}>Interactive register tracing and custom factor sandbox</Text>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  greetingCard: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.subtleCard,
    gap: 10,
  },
  greetingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  greetingBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.8,
  },
  curriculumTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  greetingHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 22,
  },
  greetingName: {
    color: COLORS.terracotta,
  },
  greetingSub: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  quickLaunchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  quickQuestBtn: {
    flex: 1,
    backgroundColor: COLORS.terracotta,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.hardInk,
  },
  quickQuestBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  quickSimBtn: {
    flex: 1,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickSimBtnText: {
    color: COLORS.obsidian,
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.subtleCard,
    gap: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  missionText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  architecturePill: {
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  architecturePillText: {
    color: COLORS.obsidian,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.obsidian,
    flex: 1,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  boldTerracotta: {
    color: COLORS.terracotta,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixContainer: {
    gap: 8,
    marginTop: 4,
  },
  matrixBoxLight: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  matrixBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  basePillLight: {
    backgroundColor: COLORS.surfaceHigh,
    color: COLORS.obsidian,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixCode: {
    fontSize: 13,
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixBoxDark: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 12,
    padding: 10,
    gap: 4,
    ...SHADOWS.subtleCard,
  },
  matrixBoxTitleDark: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracottaSoft,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  basePillDark: {
    backgroundColor: COLORS.terracotta,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixCodeDark: {
    fontSize: 13,
    color: COLORS.cardCream,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  boldTerracottaLight: {
    color: COLORS.terracottaSoft,
    fontWeight: '800',
  },
  highlightProduct: {
    color: COLORS.white,
    backgroundColor: COLORS.terracotta,
    fontWeight: '900',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  specsPill: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  specsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  regHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  regBadgeNavy: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regBadgeFlame: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regLetter: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  regTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 18,
  },
  regSub: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
  regSubFlame: {
    fontSize: 11,
    color: COLORS.terracotta,
    fontWeight: '700',
  },
  defaultBadge: {
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  shlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.terracottaSoft,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  shlText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  shrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 34, 61, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.obsidian,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  shrText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bodySm: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  bitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    paddingVertical: 2,
  },
  bitCellMuted: {
    flex: 1,
    height: 32,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitCellFlame: {
    flex: 1,
    height: 32,
    backgroundColor: COLORS.terracotta,
    borderWidth: 1,
    borderColor: COLORS.terracottaDark,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.hardFlame,
  },
  bitTextMuted: {
    color: COLORS.obsidian,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitTextFlame: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qBitRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingVertical: 4,
  },
  qBitWrapper: {
    alignItems: 'center',
  },
  bitCellMutedWide: {
    width: 48,
    height: 36,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitCellFlameLsb: {
    width: 48,
    height: 36,
    backgroundColor: COLORS.terracotta,
    borderWidth: 1,
    borderColor: COLORS.terracottaDark,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.hardFlame,
  },
  lsbLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  ruleCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 16,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  ruleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  ruleItemsContainer: {
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    color: COLORS.cardCream,
    lineHeight: 18,
    flex: 1,
  },
  boldRuleTerracotta: {
    color: COLORS.terracotta,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  boldRuleLight: {
    color: COLORS.terracottaSoft,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionPillBtn: {
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...SHADOWS.hardInk,
  },
  actionPillBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  explanationBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cycleLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actionBadgePill: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  actionBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  accumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  accumLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  accumValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  shiftTrackSection: {
    gap: 4,
  },
  shiftTrackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  trackValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qBitRowInteractive: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  bitCellActiveWide: {
    width: 48,
    height: 36,
    backgroundColor: COLORS.surfaceHighest,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitTextObsidian: {
    color: COLORS.obsidian,
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 4,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  proTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 79, 27, 0.4)',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  proTipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTipTextCol: {
    flex: 1,
    gap: 2,
  },
  proTipLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.terracotta,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  proTipText: {
    fontSize: 12,
    color: COLORS.obsidian,
    lineHeight: 17,
  },
  ctaContainer: {
    marginTop: 6,
    gap: 6,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    ...SHADOWS.hardInk,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  ctaNote: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    fontWeight: '500',
  },
});
