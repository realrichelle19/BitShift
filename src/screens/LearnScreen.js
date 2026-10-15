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
    desc: 'Initial: M=0011 (3), Q=0101 (5), C=0, A=0000. Q₀=1, so A = 0 + 3 = 0011, C=0. Shift C-A-Q right: C(0)→A[3], A[0]→Q[3]. New A=0001, Q=1010.',
    cBit: '0',
    aBits: ['0', '0', '0', '1'],
    aVal: '0001 (1)',
    qBits: ['1', '0', '1', '0'],
    qVal: '1010 (10)',
    mBits: ['0', '0', '1', '1'],
    mVal: '0011 (3, Constant)',
    operation: 'Add M (3) + Right Shift C-A-Q',
  },
  {
    cycle: 'Cycle: 2 of 4',
    action: 'Q₀ is 0 → SKIP ADD',
    desc: 'Q=1010, so Q₀=0. Addition is bypassed! Shift C-A-Q right: C(0)→A[3], A[0]→Q[3]. New A=0000, Q=1101.',
    cBit: '0',
    aBits: ['0', '0', '0', '0'],
    aVal: '0000 (0)',
    qBits: ['1', '1', '0', '1'],
    qVal: '1101 (13)',
    mBits: ['0', '0', '1', '1'],
    mVal: '0011 (3, Constant)',
    operation: 'Bypass Add + Right Shift C-A-Q',
  },
  {
    cycle: 'Cycle: 3 of 4',
    action: 'Q₀ is 1 → ADD M to A',
    desc: 'Q=1101, so Q₀=1. Add M: A = 0 + 3 = 0011, C=0. Shift C-A-Q right: C(0)→A[3], A[0]→Q[3]. New A=0001, Q=1110.',
    cBit: '0',
    aBits: ['0', '0', '0', '1'],
    aVal: '0001 (1)',
    qBits: ['1', '1', '1', '0'],
    qVal: '1110 (14)',
    mBits: ['0', '0', '1', '1'],
    mVal: '0011 (3, Constant)',
    operation: 'Add M (3) + Right Shift C-A-Q',
  },
  {
    cycle: 'Cycle: 4 of 4',
    action: 'Q₀ is 0 → SKIP ADD',
    desc: 'Q=1110, so Q₀=0. Addition is bypassed. Shift C-A-Q right: C(0)→A[3], A[0]→Q[3]. New A=0000, Q=1111.',
    cBit: '0',
    aBits: ['0', '0', '0', '0'],
    aVal: '0000 (0)',
    qBits: ['1', '1', '1', '1'],
    qVal: '1111 (15)',
    mBits: ['0', '0', '1', '1'],
    mVal: '0011 (3, Constant)',
    operation: 'Bypass Add + Right Shift C-A-Q',
  },
  {
    cycle: 'Completed!',
    action: 'Final Product = A | Q = 15',
    desc: 'All 4 cycles complete! Multiplier Q exhausted. Accumulator A holds high nibble (0000), Multiplier Q holds low nibble (1111). Final Product A-Q = 00001111₂ = 15₁₀ (3 × 5 = 15).',
    cBit: '0',
    aBits: ['0', '0', '0', '0'],
    aVal: '0000 (Upper 4 bits)',
    qBits: ['1', '1', '1', '1'],
    qVal: '1111 (Lower 4 bits)',
    mBits: ['0', '0', '1', '1'],
    mVal: '0011 (3, Constant)',
    operation: 'Product = A-Q = 00001111₂ (15₁₀)',
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
          CPUs multiply binary numbers sequentially using an adder and shift registers.
          Instead of scaling the multiplicand, the hardware holds <Text style={styles.boldObsidian}>Multiplicand M constant</Text> and shifts the combined register group <Text style={styles.boldTerracotta}>C-A-Q RIGHT</Text> by 1 bit in every cycle!
        </Text>

        {/* Base 10 vs Base 2 Side-by-side Logic Matrix */}
        <View style={styles.matrixContainer}>
          <View style={styles.matrixBoxLight}>
            <View style={styles.matrixBoxHeader}>
              <Text style={styles.matrixBoxTitle}>HUMAN DECIMAL MODEL</Text>
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
              <Text style={styles.matrixBoxTitleDark}>ALU RIGHT-SHIFT HARDWARE</Text>
              <Text style={styles.basePillDark}>Base 2</Text>
            </View>
            <Text style={styles.matrixCodeDark}>
              3 × 5 = 0011₂ × 0101₂ ={' '}
              <Text style={styles.boldTerracottaLight}>A-Q = 0000 1111₂</Text> ={' '}
              <Text style={styles.highlightProduct}>15₁₀</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 3. The Core Hardware Registers */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>The Core Hardware Registers</Text>
        <View style={styles.specsPill}>
          <Text style={styles.specsText}>C • A • Q • M</Text>
        </View>
      </View>

      {/* Register C: Carry */}
      <View style={styles.card}>
        <View style={styles.regHeaderRow}>
          <View style={styles.regLeft}>
            <View style={styles.regBadgeFlame}>
              <Text style={styles.regLetter}>C</Text>
            </View>
            <View>
              <Text style={styles.regTitle}>Carry Register</Text>
              <Text style={styles.regSub}>1-bit Register • Stores Carry-Out</Text>
            </View>
          </View>
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Initial: 0</Text>
          </View>
        </View>
        <Text style={styles.bodySm}>
          Stores the carry-out generated by the n-bit addition A + M. During each right shift, C shifts into the MSB of Accumulator A, and C resets to 0.
        </Text>
        <View style={styles.bitRow}>
          <View style={styles.bitCellFlame}>
            <Text style={styles.bitTextFlame}>0</Text>
          </View>
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
              <Text style={styles.regSub}>4-bit Register • Running Partial Product</Text>
            </View>
          </View>
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Initial: 0000</Text>
          </View>
        </View>
        <Text style={styles.bodySm}>
          Accumulates partial sums. Initialized to 0. When Q₀ = 1, M is added to A. During the right shift, A shifts right, receiving C at its MSB and sending A₀ into Q.
        </Text>
        <View style={styles.bitRow}>
          {['0', '0', '0', '0'].map((bit, idx) => (
            <View key={idx} style={styles.bitCellMuted}>
              <Text style={styles.bitTextMuted}>{bit}</Text>
            </View>
          ))}
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
              <Text style={styles.regSub}>4-bit Register • Value: 5 (0101₂)</Text>
            </View>
          </View>
          <View style={styles.shrBadge}>
            <Text style={styles.shrText}>SHR » 1</Text>
            <MaterialIcons name="arrow-forward" size={13} color={COLORS.obsidian} />
          </View>
        </View>
        <Text style={styles.bodySm}>
          Initially holds the multiplier. At the start of each cycle, bit <Text style={styles.boldTerracotta}>Q₀</Text> (Least Significant Bit) is examined. Shifts RIGHT each cycle, receiving A₀ at its MSB.
        </Text>
        <View style={styles.qBitRow}>
          {['0', '1', '0', '1'].map((bit, idx) => {
            const isLsb = idx === 3;
            return (
              <View key={idx} style={styles.qBitWrapper}>
                <View style={isLsb ? styles.bitCellFlameLsb : styles.bitCellMutedWide}>
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

      {/* Register M: Multiplicand (CONSTANT) */}
      <View style={styles.card}>
        <View style={styles.regHeaderRow}>
          <View style={styles.regLeft}>
            <View style={styles.regBadgeFlame}>
              <Text style={styles.regLetter}>M</Text>
            </View>
            <View>
              <Text style={styles.regTitle}>Multiplicand (Constant)</Text>
              <Text style={styles.regSubFlame}>4-bit Register • Value: 3 (0011₂)</Text>
            </View>
          </View>
          <View style={styles.constantBadge}>
            <MaterialIcons name="lock" size={13} color={COLORS.terracotta} />
            <Text style={styles.constantBadgeText}>CONSTANT</Text>
          </View>
        </View>
        <Text style={styles.bodySm}>
          Holds the multiplicand throughout the entire multiplication. Multiplicand M <Text style={styles.boldObsidian}>does not shift</Text>; it remains constant in every cycle.
        </Text>
        <View style={styles.bitRow}>
          {['0', '0', '1', '1'].map((bit, idx) => {
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

      {/* 4. The Golden Rule of Right-Shift Multiplication */}
      <View style={styles.ruleCard}>
        <View style={styles.ruleCardHeader}>
          <MaterialIcons name="verified" size={24} color={COLORS.terracotta} />
          <Text style={styles.ruleCardTitle}>The Golden Rule of Right-Shift Multiplication</Text>
        </View>

        <View style={styles.ruleItemsContainer}>
          <View style={styles.ruleItem}>
            <MaterialIcons name="check-circle" size={18} color={COLORS.terracotta} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleTerracotta}>If Q₀ == 1: </Text>
              Add M to Accumulator A (A ← A + M), and store carry-out in C.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <MaterialIcons name="cancel" size={18} color={COLORS.terracottaSoft} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleLight}>If Q₀ == 0: </Text>
              Skip addition! C, A, and Q remain unchanged during this phase.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <MaterialIcons name="sync-alt" size={18} color={COLORS.terracotta} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleTerracotta}>Always: </Text>
              Shift combined C-A-Q registers RIGHT » 1: C enters A[3], A[0] enters Q[3], and Q₀ is discarded. Repeat for n cycles!
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <MaterialIcons name="stars" size={18} color={COLORS.terracotta} />
            <Text style={styles.ruleText}>
              <Text style={styles.boldRuleTerracotta}>Final Product: </Text>
              Combined 2n-bit result in A | Q (Accumulator A contains upper n bits, Multiplier Q contains lower n bits).
            </Text>
          </View>
        </View>
      </View>

      {/* 5. Interactive Shift Explorer */}
      <View style={styles.card}>
        <View style={styles.cardHeaderBetween}>
          <View style={styles.iconTitleRow}>
            <MaterialIcons name="play-circle" size={22} color={COLORS.terracotta} />
            <Text style={styles.cardTitle}>Interactive Shift Explorer (3 × 5)</Text>
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
              {isFinished ? 'Finished (Restart)' : 'Next Shift »'}
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
          <Text style={styles.explanationDesc}>{currentSim.desc}</Text>
        </View>

        {/* C-A-Q Visual Bit Grid */}
        <View style={styles.explorerGrid}>
          {/* C Register */}
          <View style={styles.explorerCol}>
            <Text style={styles.explorerColLabel}>C (Carry)</Text>
            <View style={[styles.explorerCellBox, currentSim.cBit === '1' && styles.bitCellFlame]}>
              <Text style={[styles.explorerCellText, currentSim.cBit === '1' && styles.bitTextFlame]}>
                {currentSim.cBit}
              </Text>
            </View>
          </View>

          <MaterialIcons name="arrow-forward" size={16} color={COLORS.terracotta} />

          {/* A Register */}
          <View style={styles.explorerCol}>
            <Text style={styles.explorerColLabel}>A ({currentSim.aVal})</Text>
            <View style={styles.explorerBitsRow}>
              {currentSim.aBits.map((b, idx) => (
                <View key={idx} style={[styles.explorerCellBoxSm, b === '1' && styles.bitCellFlame]}>
                  <Text style={[styles.explorerCellTextSm, b === '1' && styles.bitTextFlame]}>
                    {b}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <MaterialIcons name="arrow-forward" size={16} color={COLORS.terracotta} />

          {/* Q Register */}
          <View style={styles.explorerCol}>
            <Text style={styles.explorerColLabel}>Q ({currentSim.qVal})</Text>
            <View style={styles.explorerBitsRow}>
              {currentSim.qBits.map((b, idx) => (
                <View key={idx} style={[styles.explorerCellBoxSm, b === '1' && styles.bitCellNavy]}>
                  <Text style={[styles.explorerCellTextSm, b === '1' && styles.bitTextNavy]}>
                    {b}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Constant Multiplicand Note */}
        <View style={styles.explorerFootNote}>
          <Text style={styles.explorerFootNoteText}>
            Multiplicand M = 0011 (3) is held constant. After 4 cycles, Product = A | Q = 0000 1111₂ (15).
          </Text>
        </View>
      </View>
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
    paddingBottom: 40,
    gap: 16,
  },
  greetingCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryContainer,
    gap: 10,
    ...SHADOWS.subtleCard,
  },
  greetingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 79, 27, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  greetingBadgeText: {
    color: COLORS.terracotta,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  curriculumTag: {
    color: 'rgba(250, 243, 232, 0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  greetingHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 24,
  },
  greetingName: {
    color: COLORS.terracotta,
  },
  greetingSub: {
    fontSize: 12,
    color: 'rgba(250, 243, 232, 0.8)',
    lineHeight: 18,
  },
  quickLaunchRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  quickQuestBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.terracotta,
    paddingVertical: 10,
    borderRadius: 10,
    ...SHADOWS.hardFlame,
  },
  quickQuestBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  quickSimBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.cardCream,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickSimBtnText: {
    color: COLORS.obsidian,
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.cardCream,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  missionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  missionText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  architecturePill: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  architecturePillText: {
    color: COLORS.obsidian,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
  },
  boldTerracotta: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
  },
  matrixContainer: {
    gap: 10,
    marginTop: 4,
  },
  matrixBoxLight: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  matrixBoxDark: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  matrixBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matrixBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
    letterSpacing: 0.5,
  },
  matrixBoxTitleDark: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.5,
  },
  basePillLight: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  basePillDark: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(250, 243, 232, 0.6)',
  },
  matrixCode: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrixCodeDark: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cardCream,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  boldTerracottaLight: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  highlightProduct: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  specsPill: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specsText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.terracotta,
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
  regBadgeFlame: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regBadgeNavy: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regLetter: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  regTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  regSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  regSubFlame: {
    fontSize: 11,
    color: COLORS.terracotta,
    fontWeight: '700',
  },
  defaultBadge: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  constantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  constantBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  shrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shrText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  bodySm: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  bitRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  bitCellMuted: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitTextMuted: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitCellFlame: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.terracotta,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitTextFlame: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitCellNavy: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitTextNavy: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qBitRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  qBitWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  bitCellMutedWide: {
    width: 38,
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitCellFlameLsb: {
    width: 38,
    height: 34,
    borderRadius: 6,
    backgroundColor: COLORS.terracotta,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.hardFlame,
  },
  lsbLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  ruleCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  ruleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  ruleItemsContainer: {
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.cardCream,
    lineHeight: 18,
  },
  boldRuleTerracotta: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  boldRuleLight: {
    color: 'rgba(250, 243, 232, 0.7)',
    fontWeight: '800',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionPillBtn: {
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionPillBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  explanationBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
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
  },
  actionBadgePill: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  explanationDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  explorerGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardCreamAlt,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  explorerCol: {
    alignItems: 'center',
    gap: 4,
  },
  explorerColLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  explorerBitsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  explorerCellBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.pageBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorerCellBoxSm: {
    width: 22,
    height: 26,
    borderRadius: 4,
    backgroundColor: COLORS.pageBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explorerCellText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  explorerCellTextSm: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  explorerFootNote: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
  },
  explorerFootNoteText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
});
