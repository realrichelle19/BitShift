import React, { useState, useRef } from 'react';
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

const TRACE_ROWS = [
  {
    stage: 'Initial',
    c: '0',
    a: '0000',
    q: '0101',
    q0: '—',
    op: 'Initialise registers (M=0011, Q=0101)',
    isHighlight: false,
  },
  {
    stage: 'Cycle 1: Check Q₀',
    c: '0',
    a: '0000',
    q: '0101',
    q0: '1',
    op: 'Q₀ = 1, so add M',
    isHighlight: true,
  },
  {
    stage: 'After addition',
    c: '0',
    a: '0011',
    q: '0101',
    q0: '1',
    op: 'A = 0000 + 0011',
    isHighlight: true,
  },
  {
    stage: 'After right shift',
    c: '0',
    a: '0001',
    q: '1010',
    q0: '0',
    op: 'Shift combined C-A-Q right',
    isHighlight: false,
  },
  {
    stage: 'Cycle 2: Check Q₀',
    c: '0',
    a: '0001',
    q: '1010',
    q0: '0',
    op: 'Q₀ = 0, so skip addition',
    isHighlight: false,
  },
  {
    stage: 'After right shift',
    c: '0',
    a: '0000',
    q: '1101',
    q0: '1',
    op: 'Shift combined C-A-Q right',
    isHighlight: false,
  },
  {
    stage: 'Cycle 3: Check Q₀',
    c: '0',
    a: '0000',
    q: '1101',
    q0: '1',
    op: 'Q₀ = 1, so add M',
    isHighlight: true,
  },
  {
    stage: 'After addition',
    c: '0',
    a: '0011',
    q: '1101',
    q0: '1',
    op: 'A = 0000 + 0011',
    isHighlight: true,
  },
  {
    stage: 'After right shift',
    c: '0',
    a: '0001',
    q: '1110',
    q0: '0',
    op: 'Shift combined C-A-Q right',
    isHighlight: false,
  },
  {
    stage: 'Cycle 4: Check Q₀',
    c: '0',
    a: '0001',
    q: '1110',
    q0: '0',
    op: 'Q₀ = 0, so skip addition',
    isHighlight: false,
  },
  {
    stage: 'After right shift',
    c: '0',
    a: '0000',
    q: '1111',
    q0: '1',
    op: 'Shift combined C-A-Q right',
    isHighlight: false,
  },
  {
    stage: 'Final result',
    c: '0',
    a: '0000',
    q: '1111',
    q0: '—',
    op: 'A-Q = 00001111 (Dec: 15)',
    isHighlight: true,
  },
];

const FLOWCHART_NODES = {
  start: {
    title: 'START EXECUTION',
    desc: 'Multiplication command invoked. Control unit resets internal state and loads Multiplicand M and Multiplier Q.',
  },
  init: {
    title: 'Initialization: C ← 0, A ← 0, Load M, Load Q',
    desc: 'Accumulator A is cleared to zero (0000). Carry register C is set to 0. Multiplicand register is loaded with M (0011 = 3) and remains unchanged. Multiplier register is loaded with Q (0101 = 5). Step counter is initialized to n = 4.',
  },
  decision: {
    title: 'Decision Check: Counter == 0 ?',
    desc: 'Control logic tests whether all n = 4 cycles have completed. If yes, the 8-bit product is ready in registers A-Q (A contains high nibble, Q contains low nibble) and execution halts. If no, proceed to examine Q₀.',
  },
  q0check: {
    title: 'Condition Check: Is Q₀ == 1 ?',
    desc: 'Hardware multiplexer inspects the least-significant bit (Q₀) of multiplier Q before any shift occurs. If Q₀ = 1, ALU triggers addition A ← A + M. If Q₀ = 0, addition is bypassed.',
  },
  add: {
    title: 'Micro-op: A ← A + M, C ← Carry Out',
    desc: 'Hardware 4-bit adder sums Accumulator A and Multiplicand M. Lower 4 bits of sum are stored in A, and the carry-out is stored in 1-bit register C.',
  },
  bypass: {
    title: 'Micro-op: Bypass Add (Q₀ = 0)',
    desc: 'Because Q₀ = 0, 0 × M = 0. Registers C, A, and Q remain unchanged during this phase, proceeding directly to the right shift.',
  },
  shift: {
    title: 'Transition: Shift C-A-Q RIGHT » 1 | Counter − 1',
    desc: 'Combined register group C-A-Q shifts right by 1 bit: C moves into A[3], bits of A shift right, A[0] moves into Q[3], bits of Q shift right, old Q[0] is discarded, and C resets to 0. Counter decrements by 1.',
  },
};

export default function TableScreen() {
  const [selectedFilter, setSelectedFilter] = useState('trace');
  const [selectedNode, setSelectedNode] = useState(null);
  const [openAccordions, setOpenAccordions] = useState({
    acc1: true,
    acc2: false,
    acc3: false,
  });

  const scrollRef = useRef(null);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'trace') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else if (filter === 'flowchart') {
      scrollRef.current?.scrollTo({ y: 440, animated: true });
    } else if (filter === 'cheatsheet') {
      scrollRef.current?.scrollTo({ y: 1100, animated: true });
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* 1. Overview & Quick Nav Chips */}
      <View style={styles.overviewSection}>
        <View style={styles.studyModuleRow}>
          <MaterialIcons name="account-tree" size={16} color={COLORS.terracotta} />
          <Text style={styles.studyModuleText}>STUDY MATRIX • MODULE 04</Text>
        </View>

        <Text style={styles.overviewTitle}>
          Execution Trace Matrix & Hardware Flowchart
        </Text>
        <Text style={styles.overviewSubtitle}>
          Step-by-step register states for sequential right-shift binary multiplication with real-time logical execution paths.
        </Text>

        {/* Quick Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedFilter === 'trace'
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
            onPress={() => handleFilterSelect('trace')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="table-rows"
              size={16}
              color={selectedFilter === 'trace' ? COLORS.terracotta : COLORS.obsidian}
            />
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'trace'
                  ? styles.filterPillTextActive
                  : styles.filterPillTextInactive,
              ]}
            >
              3 × 5 Full Trace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedFilter === 'flowchart'
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
            onPress={() => handleFilterSelect('flowchart')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="schema"
              size={16}
              color={
                selectedFilter === 'flowchart'
                  ? COLORS.terracotta
                  : COLORS.obsidian
              }
            />
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'flowchart'
                  ? styles.filterPillTextActive
                  : styles.filterPillTextInactive,
              ]}
            >
              Algorithm Flowchart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedFilter === 'cheatsheet'
                ? styles.filterPillActive
                : styles.filterPillInactive,
            ]}
            onPress={() => handleFilterSelect('cheatsheet')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="menu-book"
              size={16}
              color={
                selectedFilter === 'cheatsheet'
                  ? COLORS.terracotta
                  : COLORS.obsidian
              }
            />
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === 'cheatsheet'
                  ? styles.filterPillTextActive
                  : styles.filterPillTextInactive,
              ]}
            >
              Formulas & Cheat-Sheet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 2. Section 1: Execution Trace Table */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.dotTitleRow}>
            <View style={styles.navyDot} />
            <Text style={styles.cardTitle}>3 × 5 Right-Shift Trace Matrix</Text>
          </View>
          <View style={styles.matrixBadge}>
            <Text style={styles.matrixBadgeText}>M=0011 (3), Q=0101 (5)</Text>
          </View>
        </View>

        <Text style={styles.bodySm}>
          Combined register C-A-Q right-shift sequence. C contains carry, A contains partial product, and Q contains multiplier.
        </Text>

        {/* Scrollable Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCell, { width: 140 }]}>Stage</Text>
              <Text style={[styles.thCellCenter, { width: 36 }]}>C</Text>
              <Text style={[styles.thCellCenter, { width: 68 }]}>A</Text>
              <Text style={[styles.thCellCenter, { width: 68 }]}>Q</Text>
              <Text style={[styles.thCellCenter, { width: 44 }]}>Q₀</Text>
              <Text style={[styles.thCell, { width: 220 }]}>Operation</Text>
            </View>

            {/* Table Rows */}
            {TRACE_ROWS.map((row, idx) => (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  row.isHighlight ? styles.tableRowHighlight : styles.tableRowNormal,
                ]}
              >
                <Text
                  style={[
                    styles.tdCell,
                    { width: 140 },
                    row.isHighlight && { color: COLORS.terracotta, fontWeight: '800' },
                  ]}
                >
                  {row.stage}
                </Text>
                <Text style={[styles.tdCodeCenter, { width: 36 }]}>{row.c}</Text>
                <Text style={[styles.tdCodeCenter, { width: 68 }]}>{row.a}</Text>
                <Text style={[styles.tdCodeCenter, { width: 68 }]}>{row.q}</Text>
                <View style={[styles.tdCellCenter, { width: 44 }]}>
                  {row.q0 === '1' ? (
                    <View style={styles.q0FlamePill}>
                      <Text style={styles.q0FlameText}>1</Text>
                    </View>
                  ) : row.q0 === '0' ? (
                    <View style={styles.q0MutedPill}>
                      <Text style={styles.q0MutedText}>0</Text>
                    </View>
                  ) : (
                    <Text style={styles.tdCellMuted}>—</Text>
                  )}
                </View>
                <View style={[styles.tdCellRow, { width: 220 }]}>
                  {row.isHighlight && (
                    <MaterialIcons
                      name={row.stage.includes('Final') ? 'verified' : 'add-circle'}
                      size={13}
                      color={COLORS.terracotta}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.tdOpText,
                      row.isHighlight && { color: COLORS.obsidian, fontWeight: '700' },
                    ]}
                  >
                    {row.op}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Multiplier Exhausted Banner */}
        <View style={styles.bannerNavy}>
          <MaterialIcons name="verified" size={24} color={COLORS.terracotta} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.bannerTitle}>
              4 Cycles Completed • Multiplier Exhausted
            </Text>
            <Text style={styles.bannerSubtitle}>
              Final Product A | Q:{' '}
              <Text style={{ color: COLORS.terracotta, fontWeight: '800' }}>
                00001111₂
              </Text>{' '}
              • Decimal Value:{' '}
              <Text style={{ color: COLORS.white, fontWeight: '800' }}>15₁₀</Text>{' '}
              (3 × 5 = 15)
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Section 2: Architecture Flowchart */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.dotTitleRow}>
            <View style={styles.flameDot} />
            <Text style={styles.cardTitle}>Hardware Control Flowchart</Text>
          </View>
          <View style={styles.logicBadge}>
            <Text style={styles.logicBadgeText}>Right-Shift Logic</Text>
          </View>
        </View>

        <Text style={styles.bodySm}>
          Interactive control paths. Tap any block to isolate its micro-operation in the pipeline.
        </Text>

        {/* Interactive Visual Flowchart */}
        <View style={styles.flowchartTree}>
          {/* Node: Start */}
          <TouchableOpacity
            style={styles.fcStartNode}
            onPress={() => setSelectedNode(FLOWCHART_NODES.start)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="play-circle" size={16} color={COLORS.terracotta} />
            <Text style={styles.fcStartText}>START EXECUTION</Text>
          </TouchableOpacity>

          {/* Down Arrow */}
          <View style={styles.arrowCol}>
            <View style={styles.arrowLine} />
            <MaterialIcons
              name="expand-more"
              size={16}
              color={COLORS.obsidian}
              style={{ marginTop: -5 }}
            />
          </View>

          {/* Node: Init */}
          <TouchableOpacity
            style={styles.fcNodeBox}
            onPress={() => setSelectedNode(FLOWCHART_NODES.init)}
            activeOpacity={0.8}
          >
            <Text style={styles.fcNodeSub}>INITIALIZATION</Text>
            <Text style={styles.fcNodeMain}>C ← 0, A ← 0, Load M, Load Q</Text>
            <Text style={styles.fcNodeFoot}>Counter ← Bit Width (n = 4)</Text>
          </TouchableOpacity>

          {/* Down Arrow */}
          <View style={styles.arrowCol}>
            <View style={styles.arrowLine} />
            <MaterialIcons
              name="expand-more"
              size={16}
              color={COLORS.obsidian}
              style={{ marginTop: -5 }}
            />
          </View>

          {/* Node: Decision Counter == 0 */}
          <TouchableOpacity
            style={styles.fcDecisionBox}
            onPress={() => setSelectedNode(FLOWCHART_NODES.decision)}
            activeOpacity={0.8}
          >
            <View style={styles.fcDecisionTagRow}>
              <MaterialIcons name="help" size={14} color={COLORS.terracotta} />
              <Text style={styles.fcDecisionTag}>DECISION CHECK</Text>
            </View>
            <Text style={styles.fcDecisionMain}>Are all bits processed?</Text>
            <Text style={styles.fcDecisionFoot}>(Counter == 0)</Text>
          </TouchableOpacity>

          {/* Branch: YES (Halt) & NO (Continue) */}
          <View style={styles.branchRow}>
            {/* YES Branch */}
            <View style={styles.branchCol}>
              <Text style={styles.branchYesText}>YES</Text>
              <View style={styles.branchLineFlame} />
              <MaterialIcons
                name="expand-more"
                size={14}
                color={COLORS.terracotta}
                style={{ marginTop: -5 }}
              />
              <View style={styles.fcHaltBox}>
                <Text style={styles.fcHaltTag}>HALT & OUTPUT</Text>
                <Text style={styles.fcHaltMain}>Product = A | Q (15)</Text>
              </View>
            </View>

            {/* NO Branch */}
            <View style={styles.branchCol}>
              <Text style={styles.branchNoText}>NO</Text>
              <View style={styles.branchLineNavy} />
              <MaterialIcons
                name="expand-more"
                size={14}
                color={COLORS.obsidian}
                style={{ marginTop: -5 }}
              />
              <View style={styles.fcContinueBox}>
                <Text style={styles.fcContinueTag}>CONTINUE</Text>
                <Text style={styles.fcContinueMain}>Inspect Q₀</Text>
              </View>
            </View>
          </View>

          {/* Down Arrow */}
          <View style={styles.arrowCol}>
            <View style={styles.arrowLine} />
            <MaterialIcons
              name="expand-more"
              size={16}
              color={COLORS.obsidian}
              style={{ marginTop: -5 }}
            />
          </View>

          {/* Node: Condition Check Q0 == 1 */}
          <TouchableOpacity
            style={styles.fcDecisionBox}
            onPress={() => setSelectedNode(FLOWCHART_NODES.q0check)}
            activeOpacity={0.8}
          >
            <Text style={styles.fcDecisionTag}>CONDITION CHECK</Text>
            <Text style={styles.fcDecisionMain}>Is Q₀ == 1 ?</Text>
            <Text style={styles.fcDecisionFoot}>Inspect Multiplier LSB</Text>
          </TouchableOpacity>

          {/* Split Sub-Paths: Add vs Bypass */}
          <View style={styles.splitRow}>
            <TouchableOpacity
              style={styles.fcAddBox}
              onPress={() => setSelectedNode(FLOWCHART_NODES.add)}
              activeOpacity={0.8}
            >
              <Text style={styles.fcAddTag}>YES • ADD</Text>
              <Text style={styles.fcAddMain}>A ← A + M, C ← Carry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fcBypassBox}
              onPress={() => setSelectedNode(FLOWCHART_NODES.bypass)}
              activeOpacity={0.8}
            >
              <Text style={styles.fcBypassTag}>NO • BYPASS</Text>
              <Text style={styles.fcBypassMain}>Skip Add</Text>
            </TouchableOpacity>
          </View>

          {/* Down Arrow */}
          <View style={styles.arrowCol}>
            <View style={styles.arrowLine} />
            <MaterialIcons
              name="expand-more"
              size={16}
              color={COLORS.obsidian}
              style={{ marginTop: -5 }}
            />
          </View>

          {/* Process: Shift C-A-Q RIGHT & Decrement Counter */}
          <TouchableOpacity
            style={styles.fcNodeBox}
            onPress={() => setSelectedNode(FLOWCHART_NODES.shift)}
            activeOpacity={0.8}
          >
            <Text style={styles.fcNodeSub}>CLOCK CYCLE TRANSITION</Text>
            <Text style={styles.fcNodeMain}>Shift C-A-Q RIGHT » 1</Text>
            <Text style={styles.fcNodeFoot}>C → A[3], A[0] → Q[3], Counter − 1</Text>
          </TouchableOpacity>

          {/* Loopback Indicator */}
          <View style={styles.loopbackPill}>
            <MaterialIcons name="refresh" size={14} color={COLORS.terracotta} />
            <Text style={styles.loopbackText}>Loop back to Decision Check</Text>
          </View>
        </View>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <View style={styles.nodeDetailDrawer}>
            <View style={styles.nodeDetailHeader}>
              <Text style={styles.nodeDetailTitle}>{selectedNode.title}</Text>
              <TouchableOpacity onPress={() => setSelectedNode(null)}>
                <MaterialIcons name="close" size={18} color={COLORS.obsidian} />
              </TouchableOpacity>
            </View>
            <Text style={styles.nodeDetailDesc}>{selectedNode.desc}</Text>
          </View>
        )}
      </View>

      {/* 4. Section 3: Exam Cheat Sheet Accordions */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.dotTitleRow}>
            <View style={styles.flameDot} />
            <Text style={styles.cardTitle}>Key Takeaways & Exam Cheat Sheet</Text>
          </View>
        </View>

        {/* Accordion 1 */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => toggleAccordion('acc1')}
            activeOpacity={0.8}
          >
            <View style={styles.accordionTitleRow}>
              <MaterialIcons name="memory" size={18} color={COLORS.terracotta} />
              <Text style={styles.accordionTitle}>
                Why 2n bits for the final product (A-Q)?
              </Text>
            </View>
            <MaterialIcons
              name={openAccordions.acc1 ? 'expand-less' : 'expand-more'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
          {openAccordions.acc1 && (
            <View style={styles.accordionBody}>
              <Text style={styles.accordionText}>
                When multiplying two <Text style={styles.boldObsidian}>n-bit</Text> unsigned binary integers, the maximum product magnitude is:
              </Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>
                  (2ⁿ − 1) × (2ⁿ − 1) = 2²ⁿ − 2ⁿ⁺¹ + 1
                </Text>
              </View>
              <Text style={styles.accordionText}>
                For 4-bit numbers (max 15): 15 × 15 = 225₁₀ (11100001₂), which requires exactly <Text style={styles.boldObsidian}>8 bits (2n)</Text>. In the right-shift architecture, the combined registers A and Q together store the 2n-bit result: Accumulator A holds the upper n bits and Multiplier Q holds the lower n bits!
              </Text>
            </View>
          )}
        </View>

        {/* Accordion 2 */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => toggleAccordion('acc2')}
            activeOpacity={0.8}
          >
            <View style={styles.accordionTitleRow}>
              <MaterialIcons name="timer" size={18} color={COLORS.terracotta} />
              <Text style={styles.accordionTitle}>
                Time Complexity: Exactly n Clock Cycles
              </Text>
            </View>
            <MaterialIcons
              name={openAccordions.acc2 ? 'expand-less' : 'expand-more'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
          {openAccordions.acc2 && (
            <View style={styles.accordionBody}>
              <Text style={styles.accordionText}>
                The sequential shift-and-add architecture finishes in exactly{' '}
                <Text style={styles.boldObsidian}>n clock cycles</Text> for an n-bit multiplier. In each cycle: Q₀ is inspected before shifting, addition occurs only if Q₀ = 1 (with carry into C), and the combined C-A-Q registers shift right by 1 bit.
              </Text>
            </View>
          )}
        </View>

        {/* Accordion 3 */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => toggleAccordion('acc3')}
            activeOpacity={0.8}
          >
            <View style={styles.accordionTitleRow}>
              <MaterialIcons name="compare-arrows" size={18} color={COLORS.terracotta} />
              <Text style={styles.accordionTitle}>
                Shift-and-Add vs Booth's Algorithm
              </Text>
            </View>
            <MaterialIcons
              name={openAccordions.acc3 ? 'expand-less' : 'expand-more'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
          {openAccordions.acc3 && (
            <View style={styles.accordionBody}>
              <Text style={styles.accordionText}>
                Standard Shift-and-Add operates on unsigned binary operands by examining a single bit (Q₀) and shifting right. Booth's Algorithm handles signed 2's complement numbers directly by examining adjacent bit pairs (Q₀ and Q₋₁) to replace strings of 1s with a single addition and subtraction.
              </Text>
            </View>
          )}
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
  overviewSection: {
    gap: 8,
  },
  studyModuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studyModuleText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  overviewSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  filterPillActive: {
    backgroundColor: COLORS.cardCreamAlt,
    borderColor: COLORS.terracotta,
  },
  filterPillInactive: {
    backgroundColor: COLORS.cardCream,
    borderColor: COLORS.cardBorder,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: COLORS.terracotta,
  },
  filterPillTextInactive: {
    color: COLORS.obsidian,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.obsidian,
  },
  flameDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terracotta,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  matrixBadge: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matrixBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logicBadge: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  logicBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  bodySm: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  tableScroll: {
    marginTop: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.pageBg,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.obsidian,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  thCell: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  thCellCenter: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cardCream,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  tableRowHighlight: {
    backgroundColor: 'rgba(245, 79, 27, 0.08)',
  },
  tableRowNormal: {
    backgroundColor: COLORS.cardCream,
  },
  tdCell: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  tdCodeCenter: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.obsidian,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tdCellCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  q0FlamePill: {
    backgroundColor: COLORS.terracotta,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  q0FlameText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  q0MutedPill: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  q0MutedText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  tdCellMuted: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  tdCellRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tdOpText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bannerNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.obsidian,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(250, 243, 232, 0.8)',
  },
  flowchartTree: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 2,
  },
  fcStartNode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    ...SHADOWS.hardFlame,
  },
  fcStartText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    letterSpacing: 1,
  },
  arrowCol: {
    alignItems: 'center',
    height: 20,
  },
  arrowLine: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.obsidian,
  },
  fcNodeBox: {
    width: '90%',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  fcNodeSub: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
  },
  fcNodeMain: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
    textAlign: 'center',
  },
  fcNodeFoot: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  fcDecisionBox: {
    width: '90%',
    backgroundColor: COLORS.pageBg,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  fcDecisionTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fcDecisionTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
  },
  fcDecisionMain: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  fcDecisionFoot: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  branchRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  branchCol: {
    alignItems: 'center',
    width: '45%',
  },
  branchYesText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  branchNoText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  branchLineFlame: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.terracotta,
  },
  branchLineNavy: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.obsidian,
  },
  fcHaltBox: {
    backgroundColor: COLORS.obsidian,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  fcHaltTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  fcHaltMain: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  fcContinueBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  fcContinueTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  fcContinueMain: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  splitRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    gap: 8,
  },
  fcAddBox: {
    flex: 1,
    backgroundColor: COLORS.terracotta,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  fcAddTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.white,
  },
  fcAddMain: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  fcBypassBox: {
    flex: 1,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  fcBypassTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  fcBypassMain: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  loopbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  loopbackText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  nodeDetailDrawer: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginTop: 8,
  },
  nodeDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeDetailTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  nodeDetailDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  accordionContainer: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.cardCreamAlt,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  accordionBody: {
    padding: 12,
    backgroundColor: COLORS.cardCream,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  accordionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  formulaBox: {
    backgroundColor: COLORS.obsidian,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  formulaText: {
    color: COLORS.terracotta,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
  },
});
