import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme';
import {
  runShiftAndAddMultiplication,
  to4BitArray,
  to8BitArray,
  toBinaryString,
} from '../utils/multiplicationAlgorithm';

export default function SimulatorScreen() {
  const [multiplicandInput, setMultiplicandInput] = useState('3');
  const [multiplierInput, setMultiplierInput] = useState('5');
  const [customOpen, setCustomOpen] = useState(false);

  const [mVal, setMVal] = useState(3);
  const [qVal, setQVal] = useState(5);
  const [stepIndex, setStepIndex] = useState(0); // 0 = cycle 1, 1 = cycle 2, 2 = cycle 3, 3 = cycle 4
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);

  const { steps, finalA, finalQ, finalProduct } = runShiftAndAddMultiplication(mVal, qVal, 4);
  const totalSteps = steps.length;
  const currentStep = steps[stepIndex] || steps[0];
  const isCompleted = stepIndex >= totalSteps - 1;

  // Auto-play timer
  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, totalSteps]);

  const handleNextShift = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setStepIndex(0);
    }
  };

  const handleReset = () => {
    setAutoPlay(false);
    setStepIndex(0);
  };

  const handleApplyCustom = () => {
    const m = parseInt(multiplicandInput, 10);
    const q = parseInt(multiplierInput, 10);
    if (!isNaN(m) && !isNaN(q) && m >= 0 && q >= 0 && m <= 15 && q <= 15) {
      setMVal(m);
      setQVal(q);
      setStepIndex(0);
      setAutoPlay(false);
      setCustomOpen(false);
    }
  };

  // Bit representations for the active cycle
  // Multiplicand is constant 4 bits
  const mBits = to4BitArray(mVal);

  // Accumulator bits (4 bits)
  const aBeforeBits = to4BitArray(currentStep.aBefore);
  const aAfterAddBits = to4BitArray(currentStep.aAfterAdd);
  const aAfterShiftBits = to4BitArray(currentStep.aAfterShift);

  // Multiplier bits (4 bits)
  const qBeforeBits = to4BitArray(currentStep.qBefore);
  const qAfterShiftBits = to4BitArray(currentStep.qAfterShift);

  // Carry bit (1 bit)
  const cBit = currentStep.cAfterAdd;

  // Final 8-bit product (A | Q)
  const finalProductBits = to8BitArray(finalProduct);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Cycle Progress HUD */}
      <View style={styles.card}>
        <View style={styles.hudHeader}>
          <View style={styles.hudStepBadgeRow}>
            <View style={styles.stepNumPill}>
              <Text style={styles.stepNumText}>{currentStep.stepIndex}</Text>
            </View>
            <Text style={styles.hudStepTitle}>
              Cycle {currentStep.stepIndex} of {totalSteps}
            </Text>
          </View>
          <View style={styles.cycleBadge}>
            <Text style={styles.cycleBadgeText}>
              {currentStep.operation} → Shift C-A-Q Right
            </Text>
          </View>
        </View>

        {/* Micro Cycle Segment Track */}
        <View style={styles.segmentTrackRow}>
          {steps.map((st, i) => {
            const isPast = i < stepIndex;
            const isCur = i === stepIndex;
            return (
              <View key={i} style={styles.segmentCol}>
                <View
                  style={[
                    styles.segmentBar,
                    isPast && styles.segmentBarDone,
                    isCur && styles.segmentBarActive,
                    !isPast && !isCur && styles.segmentBarPending,
                  ]}
                />
                <Text
                  style={[
                    styles.segmentText,
                    isPast && styles.segmentTextDone,
                    isCur && styles.segmentTextActive,
                    !isPast && !isCur && styles.segmentTextPending,
                  ]}
                >
                  {isPast ? `Cycle ${i + 1} ✓` : isCur ? `Cycle ${i + 1} • Active` : `Cycle ${i + 1}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Combined C-A-Q Right-Shift Visual Pipeline */}
      <View style={styles.card}>
        <View style={styles.pipelineHeader}>
          <View style={styles.dotTitleRow}>
            <MaterialIcons name="trending-flat" size={18} color={COLORS.terracotta} />
            <Text style={styles.pipelineTitle}>Combined C-A-Q Right Shift Pipeline</Text>
          </View>
          <View style={styles.pipelineDirectionPill}>
            <MaterialIcons name="arrow-forward" size={14} color={COLORS.white} />
            <Text style={styles.pipelineDirectionText}>SHIFT RIGHT » 1</Text>
          </View>
        </View>
        <Text style={styles.pipelineSub}>
          C (1 bit), A (4 bits), and Q (4 bits) shift right together. Carry C enters A MSB, A's LSB enters Q MSB, and Q₀ is discarded.
        </Text>

        {/* Register Flow Blocks */}
        <View style={styles.pipelineBlocksRow}>
          {/* C Register Block */}
          <View style={styles.pipeRegBlock}>
            <Text style={styles.pipeRegLabel}>C (Carry)</Text>
            <View style={[styles.pipeCell, cBit === 1 && styles.pipeCellFlame]}>
              <Text style={[styles.pipeCellText, cBit === 1 && styles.pipeCellTextFlame]}>
                {cBit}
              </Text>
            </View>
            <Text style={styles.pipeArrow}>↓ enters A[3]</Text>
          </View>

          <MaterialIcons name="arrow-forward" size={18} color={COLORS.terracotta} />

          {/* A Register Block */}
          <View style={styles.pipeRegBlock}>
            <Text style={styles.pipeRegLabel}>A (Accumulator, 4-bit)</Text>
            <View style={styles.pipeBitsRow}>
              {aAfterShiftBits.map((b, idx) => (
                <View key={idx} style={[styles.pipeCellSm, b === '1' && styles.pipeCellFlame]}>
                  <Text style={[styles.pipeCellTextSm, b === '1' && styles.pipeCellTextFlame]}>
                    {b}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.pipeArrow}>A[0] → enters Q[3]</Text>
          </View>

          <MaterialIcons name="arrow-forward" size={18} color={COLORS.terracotta} />

          {/* Q Register Block */}
          <View style={styles.pipeRegBlock}>
            <Text style={styles.pipeRegLabel}>Q (Multiplier, 4-bit)</Text>
            <View style={styles.pipeBitsRow}>
              {qAfterShiftBits.map((b, idx) => (
                <View key={idx} style={[styles.pipeCellSm, b === '1' && styles.pipeCellNavy]}>
                  <Text style={[styles.pipeCellTextSm, b === '1' && styles.pipeCellTextNavy]}>
                    {b}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.pipeArrowDiscard}>Q₀ discarded</Text>
          </View>
        </View>
      </View>

      {/* 3. Live Hardware Register Dashboard */}
      <View style={styles.dashboardSection}>
        {/* Carry (C) Card */}
        <View style={styles.card}>
          <View style={styles.regCardHeader}>
            <View style={styles.dotTitleRow}>
              <View style={styles.flameDot} />
              <Text style={styles.regCardTitle}>Carry Register (C)</Text>
            </View>
            <View style={styles.shiftBadgeNavy}>
              <Text style={styles.shiftBadgeText}>
                {cBit === 1 ? 'CARRY GENERATED (1)' : 'NO CARRY (0)'}
              </Text>
            </View>
          </View>
          <View style={styles.cMatrixRow}>
            <View style={styles.bitCellCol}>
              <Text style={styles.bitSubLabel}>Carry Out</Text>
              <View style={[styles.bitCellBox, cBit === 1 ? styles.bitCellFlame : styles.bitCellDefault]}>
                <Text style={[styles.bitCellNum, cBit === 1 ? styles.bitCellNumFlame : styles.bitCellNumDefault]}>
                  {cBit}
                </Text>
              </View>
            </View>
            <Text style={styles.cDescText}>
              Stores carry-out from ALU addition A + M. Moves into A's MSB (b3) during right shift.
            </Text>
          </View>
        </View>

        {/* Accumulator (A) Card */}
        <View style={styles.card}>
          <View style={styles.regCardHeader}>
            <View style={styles.dotTitleRow}>
              <View style={styles.flameDot} />
              <Text style={styles.regCardTitle}>Accumulator (A)</Text>
            </View>
            <View style={styles.hexDecRow}>
              <View style={styles.hexPill}>
                <Text style={styles.hexText}>
                  Hex: 0x{currentStep.aAfterShift.toString(16).toUpperCase()}
                </Text>
              </View>
              <View style={styles.decPill}>
                <Text style={styles.decText}>Dec: {currentStep.aAfterShift}</Text>
              </View>
            </View>
          </View>

          {/* 4-Bit Matrix */}
          <View style={styles.qGrid4}>
            {aAfterShiftBits.map((b, idx) => {
              const bitNum = 3 - idx;
              const isHigh = b === '1';
              return (
                <View key={idx} style={styles.qCellCol}>
                  <Text style={[styles.bitSubLabel, isHigh && { color: COLORS.terracotta, fontWeight: '800' }]}>
                    b{bitNum}
                  </Text>
                  <View style={[styles.qCellBox, isHigh ? styles.qCellActive : styles.qCellDefault]}>
                    <Text style={[styles.qCellNum, isHigh ? styles.qCellNumActive : styles.qCellNumDefault]}>
                      {b}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.regCardFooter}>
            <Text style={styles.prevText}>
              State Before Shift:{' '}
              <Text style={styles.boldObsidian}>
                {toBinaryString(currentStep.aAfterAdd, 4)} ({currentStep.aAfterAdd})
              </Text>
            </Text>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>
                {currentStep.addOccurred ? `+${mVal} (Add M)` : 'No Add (Skip)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Multiplier (Q) Card with Target Bit Q0 */}
        <View style={styles.card}>
          <View style={styles.regCardHeader}>
            <View style={styles.dotTitleRow}>
              <View style={styles.flameDot} />
              <Text style={styles.regCardTitle}>Multiplier (Q)</Text>
            </View>
            <View style={styles.targetBadgeFlame}>
              <MaterialIcons name="bolt" size={14} color={COLORS.white} />
              <Text style={styles.targetBadgeText}>
                {currentStep.q0 === 1 ? 'Q₀ = 1 (ADD TRIGGERED)' : 'Q₀ = 0 (SKIP ADD)'}
              </Text>
            </View>
          </View>

          {/* 4-Bit Grid before shift */}
          <View style={styles.qGrid4}>
            {qBeforeBits.map((b, idx) => {
              const qBitNum = 3 - idx;
              const isQ0 = idx === 3;
              return (
                <View key={idx} style={styles.qCellCol}>
                  <Text style={[styles.bitSubLabel, isQ0 && { color: COLORS.terracotta, fontWeight: '800' }]}>
                    {isQ0 ? 'Q₀ (Active)' : `q${qBitNum}`}
                  </Text>
                  <View style={[styles.qCellBox, isQ0 ? styles.qCellActive : styles.qCellDefault]}>
                    <Text style={[styles.qCellNum, isQ0 ? styles.qCellNumActive : styles.qCellNumDefault]}>
                      {b}
                    </Text>
                  </View>
                  {isQ0 && (
                    <MaterialIcons
                      name="arrow-drop-up"
                      size={20}
                      color={COLORS.terracotta}
                      style={{ marginTop: -4 }}
                    />
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.regCardFooter}>
            <Text style={styles.prevText}>
              After Right Shift:{' '}
              <Text style={styles.boldObsidian}>
                {toBinaryString(currentStep.qAfterShift, 4)} ({currentStep.qAfterShift})
              </Text>
            </Text>
            <View style={styles.shiftBadgeNavySm}>
              <Text style={styles.shiftBadgeNavySmText}>Q » 1</Text>
            </View>
          </View>
        </View>

        {/* Multiplicand (M) Card (CONSTANT) */}
        <View style={styles.card}>
          <View style={styles.regCardHeader}>
            <View style={styles.dotTitleRow}>
              <View style={styles.navyDot} />
              <Text style={styles.regCardTitle}>Multiplicand (M)</Text>
            </View>
            <View style={styles.constantBadge}>
              <MaterialIcons name="lock" size={12} color={COLORS.obsidian} />
              <Text style={styles.constantBadgeText}>CONSTANT: {mVal}</Text>
            </View>
          </View>

          {/* 4-Bit Matrix */}
          <View style={styles.qGrid4}>
            {mBits.map((b, idx) => {
              const isHigh = b === '1';
              return (
                <View key={idx} style={styles.qCellCol}>
                  <Text style={styles.bitSubLabel}>m{3 - idx}</Text>
                  <View
                    style={[
                      styles.qCellBox,
                      isHigh && {
                        backgroundColor: COLORS.obsidian,
                        borderColor: COLORS.obsidian,
                      },
                    ]}
                  >
                    <Text style={[styles.qCellNumDefault, isHigh && { color: COLORS.white, fontWeight: '800' }]}>
                      {b}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.scaleRow}>
            <Text style={styles.scaleText}>
              Multiplicand M is held unchanged in its register throughout all cycles.
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Interactive ALU Addition Scratchpad */}
      <View style={styles.scratchpadCard}>
        <View style={styles.scratchpadHeader}>
          <View style={styles.scratchpadTitleRow}>
            <MaterialIcons name="calculate" size={18} color={COLORS.terracotta} />
            <Text style={styles.scratchpadTitle}>ALU Addition Scratchpad</Text>
          </View>
          <View style={styles.scratchpadPill}>
            <Text style={styles.scratchpadPillText}>Accumulator A + Multiplicand M</Text>
          </View>
        </View>

        <View style={styles.scratchpadBody}>
          {/* Row 1: A */}
          <View style={styles.scratchpadRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadLabel}>A:</Text>
              <Text style={styles.scratchpadBits}>{aBeforeBits.join(' ')}</Text>
            </View>
            <Text style={styles.scratchpadDec}>(Dec: {currentStep.aBefore})</Text>
          </View>

          {/* Row 2: + M */}
          <View style={styles.scratchpadRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadPlus}>+</Text>
              <Text style={styles.scratchpadBits}>
                {currentStep.q0 === 1 ? mBits.join(' ') : '0 0 0 0'}
              </Text>
            </View>
            <Text
              style={[
                styles.scratchpadDec,
                currentStep.q0 === 1 && { color: COLORS.terracotta, fontWeight: '700' },
              ]}
            >
              (Dec: {currentStep.q0 === 1 ? mVal : 0})
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.scratchpadDivider} />

          {/* Row 3: Result A and Carry C */}
          <View style={styles.scratchpadResultRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadEquals}>=</Text>
              <Text style={styles.scratchpadResultBits}>
                [C={cBit}] {aAfterAddBits.join(' ')}
              </Text>
            </View>
            <View style={styles.scratchpadResultBadge}>
              <Text style={styles.scratchpadResultDec}>
                (Sum: {currentStep.aAfterAdd}, Carry: {cBit})
              </Text>
            </View>
          </View>

          {/* Shift Note */}
          <View style={styles.scratchpadShiftNoteRow}>
            <MaterialIcons name="sync-alt" size={14} color={COLORS.terracotta} />
            <Text style={styles.scratchpadShiftNoteText}>
              Next: Combined Right Shift of C ({cBit}) | A ({aAfterAddBits.join('')}) | Q ({qBeforeBits.join('')}) » 1
            </Text>
          </View>
        </View>
      </View>

      {/* 5. Step Operation Controller & Dynamic Insight */}
      <View style={styles.card}>
        <View style={styles.controlBtnRow}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <MaterialIcons name="restart-alt" size={18} color={COLORS.obsidian} />
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.autoBtn,
              autoPlay && { backgroundColor: COLORS.terracotta },
            ]}
            onPress={() => setAutoPlay(!autoPlay)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={autoPlay ? 'pause' : 'fast-forward'}
              size={18}
              color={COLORS.white}
            />
            <Text style={styles.autoBtnText}>
              {autoPlay ? 'Pause' : 'Auto-Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNextShift}
            activeOpacity={0.7}
          >
            <Text style={styles.nextBtnText}>
              {isCompleted ? 'Restart' : 'Next Shift'}
            </Text>
            <MaterialIcons
              name={isCompleted ? 'replay' : 'arrow-forward'}
              size={18}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* Hardware Insight Drawer */}
        <View style={styles.insightBox}>
          <View style={styles.insightHeader}>
            <MaterialIcons name="tips-and-updates" size={18} color={COLORS.terracotta} />
            <Text style={styles.insightTitle}>What Just Happened?</Text>
          </View>
          <Text style={styles.insightText}>{currentStep.desc}</Text>
        </View>
      </View>

      {/* 6. Final Product Card (When all 4 cycles complete) */}
      {isCompleted && (
        <View style={styles.finalProductCard}>
          <View style={styles.finalProductHeader}>
            <MaterialIcons name="verified" size={24} color={COLORS.terracotta} />
            <View>
              <Text style={styles.finalProductTitle}>Multiplication Completed!</Text>
              <Text style={styles.finalProductSub}>
                Final Product = A | Q ({mVal} × {qVal} = {finalProduct})
              </Text>
            </View>
          </View>

          <View style={styles.finalProductBitsRow}>
            <View style={styles.finalNibble}>
              <Text style={styles.finalNibbleLabel}>Accumulator A</Text>
              <Text style={styles.finalNibbleBits}>
                {toBinaryString(finalA, 4)}
              </Text>
            </View>
            <Text style={styles.finalDivider}>|</Text>
            <View style={styles.finalNibble}>
              <Text style={styles.finalNibbleLabel}>Multiplier Q</Text>
              <Text style={styles.finalNibbleBits}>
                {toBinaryString(finalQ, 4)}
              </Text>
            </View>
          </View>

          <View style={styles.finalSummaryRow}>
            <Text style={styles.finalSummaryText}>
              8-Bit Binary:{' '}
              <Text style={{ color: COLORS.terracotta, fontWeight: '800' }}>
                {finalProductBits.join('')}₂
              </Text>{' '}
              • Decimal:{' '}
              <Text style={{ color: COLORS.white, fontWeight: '800' }}>
                {finalProduct}₁₀
              </Text>
            </Text>
          </View>
        </View>
      )}

      {/* 7. Custom Multiplier Sandbox Trigger */}
      <View style={styles.customCard}>
        <View style={styles.customHeader}>
          <View style={styles.customLeft}>
            <View style={styles.customIconSquare}>
              <MaterialIcons name="tune" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.customTitle}>Custom Multiplier Sandbox</Text>
              <Text style={styles.customSub}>Try other factors like 7 × 3 or 15 × 15</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.openMatrixBtn}
            onPress={() => setCustomOpen(!customOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.openMatrixBtnText}>
              {customOpen ? 'Close Matrix' : 'Open Matrix'}
            </Text>
          </TouchableOpacity>
        </View>

        {customOpen && (
          <View style={styles.customInputsArea}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Multiplicand (0-15):</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={multiplicandInput}
                  onChangeText={setMultiplicandInput}
                  maxLength={2}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Multiplier (0-15):</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={multiplierInput}
                  onChangeText={setMultiplierInput}
                  maxLength={2}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApplyCustom}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={16} color={COLORS.white} />
              <Text style={styles.applyBtnText}>Apply Custom Operands</Text>
            </TouchableOpacity>
          </View>
        )}
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
    gap: 14,
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
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  hudStepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumPill: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
  hudStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  cycleBadge: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cycleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  segmentTrackRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  segmentCol: {
    flex: 1,
    gap: 4,
  },
  segmentBar: {
    height: 6,
    borderRadius: 3,
  },
  segmentBarDone: {
    backgroundColor: COLORS.success,
  },
  segmentBarActive: {
    backgroundColor: COLORS.terracotta,
  },
  segmentBarPending: {
    backgroundColor: 'rgba(30, 34, 61, 0.1)',
  },
  segmentText: {
    fontSize: 10,
    fontWeight: '600',
  },
  segmentTextDone: {
    color: COLORS.success,
  },
  segmentTextActive: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  segmentTextPending: {
    color: COLORS.textMuted,
  },
  pipelineHeader: {
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
  flameDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.terracotta,
  },
  navyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.obsidian,
  },
  pipelineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  pipelineDirectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pipelineDirectionText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  pipelineSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  pipelineBlocksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardCreamAlt,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  pipeRegBlock: {
    alignItems: 'center',
    gap: 4,
  },
  pipeRegLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  pipeBitsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  pipeCell: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.pageBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipeCellSm: {
    width: 22,
    height: 26,
    borderRadius: 4,
    backgroundColor: COLORS.pageBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipeCellFlame: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  pipeCellNavy: {
    backgroundColor: COLORS.obsidian,
    borderColor: COLORS.obsidian,
  },
  pipeCellText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pipeCellTextSm: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pipeCellTextFlame: {
    color: COLORS.white,
  },
  pipeCellTextNavy: {
    color: COLORS.white,
  },
  pipeArrow: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.terracotta,
  },
  pipeArrowDiscard: {
    fontSize: 9,
    fontWeight: '600',
    color: '#BA1A1A',
  },
  dashboardSection: {
    gap: 14,
  },
  regCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  hexDecRow: {
    flexDirection: 'row',
    gap: 6,
  },
  hexPill: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hexText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  decPill: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  decText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  cMatrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cDescText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  bitCellCol: {
    alignItems: 'center',
    gap: 4,
  },
  bitSubLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  bitCellBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitCellDefault: {
    backgroundColor: COLORS.cardCreamAlt,
  },
  bitCellFlame: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  bitCellNum: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitCellNumDefault: {
    color: COLORS.obsidian,
  },
  bitCellNumFlame: {
    color: COLORS.white,
  },
  qGrid4: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  qCellCol: {
    alignItems: 'center',
    gap: 4,
  },
  qCellBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qCellDefault: {
    backgroundColor: COLORS.cardCreamAlt,
    borderColor: COLORS.cardBorder,
  },
  qCellActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
    ...SHADOWS.hardFlame,
  },
  qCellNum: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qCellNumDefault: {
    color: COLORS.obsidian,
  },
  qCellNumActive: {
    color: COLORS.white,
  },
  regCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
  },
  prevText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
  },
  deltaBadge: {
    backgroundColor: COLORS.cardCreamAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.terracotta,
  },
  shiftBadgeNavy: {
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  shiftBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  shiftBadgeNavySm: {
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  shiftBadgeNavySmText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  targetBadgeFlame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  targetBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  constantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  constantBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  scaleRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 8,
  },
  scaleText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  scratchpadCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryContainer,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  scratchpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  scratchpadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scratchpadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  scratchpadPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scratchpadPillText: {
    fontSize: 11,
    color: COLORS.cardCream,
    fontWeight: '600',
  },
  scratchpadBody: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  scratchpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scratchpadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scratchpadLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardCream,
    width: 22,
  },
  scratchpadPlus: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.terracotta,
    width: 22,
  },
  scratchpadBits: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cardCream,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },
  scratchpadDec: {
    fontSize: 11,
    color: 'rgba(250, 243, 232, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadDivider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
  },
  scratchpadResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scratchpadEquals: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.terracotta,
    width: 22,
  },
  scratchpadResultBits: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.cardCream,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },
  scratchpadResultBadge: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scratchpadResultDec: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  scratchpadShiftNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  scratchpadShiftNoteText: {
    fontSize: 11,
    color: COLORS.cardCream,
    lineHeight: 15,
  },
  controlBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  autoBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.obsidian,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  autoBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  nextBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.terracotta,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    ...SHADOWS.hardInk,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  insightBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  insightText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  finalProductCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.terracotta,
    gap: 12,
    ...SHADOWS.hardFlame,
  },
  finalProductHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  finalProductTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  finalProductSub: {
    fontSize: 12,
    color: 'rgba(250, 243, 232, 0.7)',
  },
  finalProductBitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 12,
  },
  finalNibble: {
    alignItems: 'center',
    gap: 4,
  },
  finalNibbleLabel: {
    fontSize: 11,
    color: 'rgba(250, 243, 232, 0.7)',
    fontWeight: '600',
  },
  finalNibbleBits: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 3,
  },
  finalDivider: {
    fontSize: 24,
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  finalSummaryRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 8,
  },
  finalSummaryText: {
    fontSize: 13,
    color: COLORS.cardCream,
  },
  customCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryContainer,
    gap: 12,
    ...SHADOWS.subtleCard,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customIconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  customSub: {
    fontSize: 11,
    color: 'rgba(250, 243, 232, 0.7)',
  },
  openMatrixBtn: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openMatrixBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  customInputsArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  applyBtn: {
    backgroundColor: COLORS.terracotta,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
  },
});
