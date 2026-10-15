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
    step: 'Init',
    aBefore: '00000000',
    qBefore: '0011',
    q0: '—',
    op: 'Initialize registers',
    aAfter: '00000000',
    decAfter: '(0)',
    isHighlight: false,
  },
  {
    step: '#1',
    aBefore: '00000000',
    qBefore: '0011',
    q0: '1',
    op: 'A ← A + M',
    aAfter: '00000101',
    decAfter: '(5)',
    isHighlight: true,
  },
  {
    step: '#2',
    aBefore: '00000101',
    qBefore: '0001',
    q0: '1',
    op: 'A ← A + M',
    aAfter: '00001111',
    decAfter: '(15)',
    isHighlight: true,
  },
  {
    step: '#3',
    aBefore: '00001111',
    qBefore: '0000',
    q0: '0',
    op: 'No Add (Shift only)',
    aAfter: '00001111',
    decAfter: '(15)',
    isHighlight: false,
  },
  {
    step: '#4',
    aBefore: '00001111',
    qBefore: '0000',
    q0: '0',
    op: 'No Add (Shift only)',
    aAfter: '00001111',
    decAfter: '(15)',
    isHighlight: false,
  },
];

const FLOWCHART_NODES = {
  start: {
    title: 'START EXECUTION',
    desc: 'Multiplication command invoked. Micro-code sequencer resets register state and loads multiplicand and multiplier values.',
  },
  init: {
    title: 'Initialization: A ← 0, Load M, Load Q',
    desc: 'Accumulator A is cleared to zero (0000 0000). Multiplicand register is loaded with M (5). Multiplier register is loaded with Q (3). Step counter is initialized to n = 4.',
  },
  decision: {
    title: 'Decision Check: Counter == 0 ?',
    desc: 'The control logic tests whether all n bits have been processed. If yes, the final product is ready in accumulator A and the engine halts. If no, the loop continues.',
  },
  q0check: {
    title: 'Condition Check: Is Q₀ == 1 ?',
    desc: 'ALU multiplexer inspects the least-significant bit (Q₀) of multiplier Q. If 1, ALU triggers an ADD micro-operation. If 0, the addition is bypassed.',
  },
  add: {
    title: 'Micro-op: A ← A + M',
    desc: 'Hardware 8-bit adder sums Accumulator A and Multiplicand M. Carry is absorbed into upper bits of A without overflow.',
  },
  bypass: {
    title: 'Micro-op: Bypass Add',
    desc: 'Q₀ is zero, meaning 0 × M = 0. Accumulator A retains its running total undisturbed, saving ALU switching power.',
  },
  shift: {
    title: 'Transition: Q >> 1 | M << 1 | Counter − 1',
    desc: 'Synchronized hardware shift on clock pulse: Multiplier Q shifts right by 1 bit discarding examined Q₀. Multiplicand M shifts left by 1 bit doubling its value for the next power of 2. Counter decrements by 1.',
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
          Complete Execution Matrix & Architecture Flowchart
        </Text>
        <Text style={styles.overviewSubtitle}>
          Step-by-step register states for sequential binary multiplication with
          real-time logical execution paths.
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
              5 × 3 Full Trace
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
            <Text style={styles.cardTitle}>5 × 3 Trace Matrix</Text>
          </View>
          <View style={styles.matrixBadge}>
            <Text style={styles.matrixBadgeText}>M=0101, Q=0011</Text>
          </View>
        </View>

        <Text style={styles.bodySm}>
          Horizontal scroll for full 8-bit register inspect. Highlights indicate bit
          test triggers.
        </Text>

        {/* Scrollable Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCell, { width: 50 }]}>Step</Text>
              <Text style={[styles.thCell, { width: 90 }]}>A (Before)</Text>
              <Text style={[styles.thCell, { width: 80 }]}>Q (Before)</Text>
              <Text style={[styles.thCellCenter, { width: 44 }]}>Q₀</Text>
              <Text style={[styles.thCell, { width: 140 }]}>Operation</Text>
              <Text style={[styles.thCell, { width: 120 }]}>A (After)</Text>
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
                    { width: 50 },
                    row.isHighlight && { color: COLORS.terracotta, fontWeight: '800' },
                  ]}
                >
                  {row.step}
                </Text>
                <Text style={[styles.tdCode, { width: 90 }]}>{row.aBefore}</Text>
                <Text style={[styles.tdCode, { width: 80 }]}>{row.qBefore}</Text>
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
                <View style={[styles.tdCellRow, { width: 140 }]}>
                  {row.isHighlight && (
                    <MaterialIcons
                      name="add-circle"
                      size={13}
                      color={COLORS.terracotta}
                      style={{ marginRight: 3 }}
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
                <Text style={[styles.tdCode, { width: 120 }]}>
                  {row.aAfter}{' '}
                  <Text
                    style={[
                      styles.decNote,
                      row.isHighlight && { color: COLORS.terracotta, fontWeight: '800' },
                    ]}
                  >
                    {row.decAfter}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Multiplier Exhausted Dignified Banner */}
        <View style={styles.bannerNavy}>
          <MaterialIcons name="verified" size={24} color={COLORS.terracotta} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.bannerTitle}>
              Multiplier Exhausted (All 4 bits evaluated)
            </Text>
            <Text style={styles.bannerSubtitle}>
              Final Accumulator:{' '}
              <Text style={{ color: COLORS.terracotta, fontWeight: '800' }}>
                00001111₂
              </Text>{' '}
              • Decimal Value:{' '}
              <Text style={{ color: COLORS.white, fontWeight: '800' }}>15₁₀</Text>{' '}
              (5 × 3 = 15)
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
            <Text style={styles.logicBadgeText}>Sequential Logic</Text>
          </View>
        </View>

        <Text style={styles.bodySm}>
          Interactive control paths. Tap any block to isolate its micro-operation in
          the pipeline.
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
            <Text style={styles.fcNodeMain}>A ← 0, Load M, Load Q</Text>
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
                <Text style={styles.fcHaltMain}>Product = A (15)</Text>
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
              <Text style={styles.fcAddMain}>A ← A + M</Text>
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

          {/* Process: Shift & Decrement */}
          <TouchableOpacity
            style={styles.fcNodeBox}
            onPress={() => setSelectedNode(FLOWCHART_NODES.shift)}
            activeOpacity={0.8}
          >
            <Text style={styles.fcNodeSub}>CLOCK CYCLE TRANSITION</Text>
            <Text style={styles.fcNodeMain}>Q &gt;&gt; 1  |  M &lt;&lt; 1</Text>
            <Text style={styles.fcNodeFoot}>Counter ← Counter − 1</Text>
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
                Why 8-bit registers for 4-bit numbers?
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
                When multiplying two <Text style={styles.boldObsidian}>n-bit</Text>{' '}
                binary integers, the maximum product magnitude is:
              </Text>
              <View style={styles.formulaBox}>
                <Text style={styles.formulaText}>
                  (2ⁿ − 1) × (2ⁿ − 1) = 2²ⁿ − 2ⁿ⁺¹ + 1
                </Text>
              </View>
              <Text style={styles.accordionText}>
                For 4-bit numbers (max 15): 15 × 15 = 225₁₀ (11100001₂), which
                requires exactly <Text style={styles.boldObsidian}>8 bits</Text>{' '}
                (maximum capacity 255). An 8-bit accumulator is mathematically
                guaranteed never to overflow!
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
                Time Complexity: O(n) Clock Cycles
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
                <Text style={styles.boldObsidian}>n clock cycles</Text> for an n-bit
                multiplier. Each cycle tests Q₀, optionally executes an addition in
                the ALU, and applies synchronized left/right shifts.
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
                • <Text style={styles.boldObsidian}>Standard Shift-and-Add</Text>:{' '}
                Operates on unsigned integers, adding M whenever Q₀ = 1.
              </Text>
              <Text style={styles.accordionText}>
                • <Text style={styles.boldObsidian}>Booth's Algorithm</Text>:{' '}
                Natively handles signed two's complement numbers by scanning pairs of
                adjacent bits (Qᵢ, Qᵢ₋₁) to skip contiguous blocks of 1s through
                subtraction and addition.
              </Text>
            </View>
          )}
        </View>
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
  overviewSection: {
    gap: 8,
  },
  studyModuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studyModuleText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  overviewSubtitle: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: COLORS.obsidian,
    ...SHADOWS.hardInk,
  },
  filterPillInactive: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterPillText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  filterPillTextActive: {
    color: COLORS.cardCream,
    fontWeight: '800',
  },
  filterPillTextInactive: {
    color: COLORS.obsidian,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.subtleCard,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.obsidian,
  },
  flameDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.terracotta,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  matrixBadge: {
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  matrixBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logicBadge: {
    backgroundColor: 'rgba(245, 79, 27, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 79, 27, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  logicBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bodySm: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
  },
  tableScroll: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    overflow: 'hidden',
  },
  table: {
    backgroundColor: COLORS.cardCream,
    minWidth: 520,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.obsidian,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  thCell: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  thCellCenter: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  tableRowNormal: {
    backgroundColor: COLORS.cardCream,
  },
  tableRowHighlight: {
    backgroundColor: 'rgba(242, 228, 204, 0.7)',
  },
  tdCell: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tdCode: {
    fontSize: 11,
    color: COLORS.obsidian,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tdCellCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tdCellRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tdOpText: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
  },
  tdCellMuted: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  decNote: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  q0FlamePill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  q0FlameText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  q0MutedPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  q0MutedText: {
    color: COLORS.obsidian,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bannerNavy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.obsidian,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryContainer,
    ...SHADOWS.hardInk,
  },
  bannerTitle: {
    color: COLORS.cardCream,
    fontSize: 12,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: COLORS.cardBorder,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  flowchartTree: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  fcStartNode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    ...SHADOWS.hardInk,
  },
  fcStartText: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  arrowCol: {
    alignItems: 'center',
  },
  arrowLine: {
    width: 2,
    height: 14,
    backgroundColor: COLORS.cardBorder,
  },
  fcNodeBox: {
    width: 240,
    backgroundColor: COLORS.cardCream,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 2,
    ...SHADOWS.subtleCard,
  },
  fcNodeSub: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcNodeMain: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcNodeFoot: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
  fcDecisionBox: {
    width: 240,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 2,
    borderColor: COLORS.obsidian,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 2,
    ...SHADOWS.subtleCard,
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
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcDecisionMain: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  fcDecisionFoot: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  branchRow: {
    width: 240,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  branchCol: {
    alignItems: 'center',
    width: 110,
  },
  branchYesText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  branchNoText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  branchLineFlame: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.terracotta,
  },
  branchLineNavy: {
    width: 2,
    height: 12,
    backgroundColor: COLORS.obsidian,
  },
  fcHaltBox: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    width: '100%',
    gap: 2,
  },
  fcHaltTag: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcHaltMain: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcContinueBox: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 2,
    borderColor: COLORS.obsidian,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    width: '100%',
    gap: 2,
  },
  fcContinueTag: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcContinueMain: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  splitRow: {
    width: 240,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  fcAddBox: {
    flex: 1,
    backgroundColor: COLORS.cardCream,
    borderWidth: 2,
    borderColor: COLORS.terracotta,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  fcAddTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcAddMain: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcBypassBox: {
    flex: 1,
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  fcBypassTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fcBypassMain: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  loopbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    marginTop: 6,
  },
  loopbackText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  nodeDetailDrawer: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    marginTop: 8,
  },
  nodeDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nodeDetailTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    flex: 1,
  },
  nodeDetailDesc: {
    fontSize: 11,
    color: COLORS.obsidian,
    lineHeight: 16,
  },
  accordionContainer: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
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
    flex: 1,
  },
  accordionBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  accordionText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  formulaBox: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  formulaText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
