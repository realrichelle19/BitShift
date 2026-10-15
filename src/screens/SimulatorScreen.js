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

// Generates steps for any Multiplicand × Multiplier (up to 4-bit multiplicand and multiplier)
function generateMultiplicationSteps(mInit = 5, qInit = 3) {
  const steps = [];
  let a = 0;
  let m = mInit;
  let q = qInit;
  const bitCount = 4;

  for (let i = 0; i < bitCount; i++) {
    const q0 = q & 1;
    const aBefore = a;
    const mBefore = m;
    const qBefore = q;
    let operation = '';
    let appliedDelta = 0;

    if (q0 === 1) {
      a += m;
      appliedDelta = m;
      operation = `Add M (${m}) → A`;
    } else {
      appliedDelta = 0;
      operation = `Skip Add (Q₀ = 0)`;
    }

    const aAfter = a;
    const mShifted = m << 1;
    const qShifted = q >> 1;

    steps.push({
      stepIndex: i + 1,
      bitIndex: i,
      q0,
      aBefore,
      aAfter,
      appliedDelta,
      mCurrent: mBefore,
      qCurrent: qBefore,
      mNext: mShifted,
      qNext: qShifted,
      operation,
      desc:
        q0 === 1
          ? `Because least-significant bit Q₀ = 1, the ALU accumulated M (${mBefore}) directly into A (${aBefore} + ${mBefore} = ${aAfter}). Next shift will shift Q right and scale M left.`
          : `Because least-significant bit Q₀ = 0, no addition is needed! Accumulator A holds at ${aAfter}. Next shift will shift Q right and scale M left.`,
    });

    // Advance for next cycle
    m = mShifted;
    q = qShifted;
  }

  return { steps, finalProduct: a };
}

function to8BitArray(num) {
  const binary = (num & 0xff).toString(2).padStart(8, '0');
  return binary.split('');
}

function to4BitArray(num) {
  const binary = (num & 0xf).toString(2).padStart(4, '0');
  return binary.split('');
}

export default function SimulatorScreen() {
  const [multiplicandInput, setMultiplicandInput] = useState('5');
  const [multiplierInput, setMultiplierInput] = useState('3');
  const [customOpen, setCustomOpen] = useState(false);

  const [mVal, setMVal] = useState(5);
  const [qVal, setQVal] = useState(3);
  const [stepIndex, setStepIndex] = useState(0); // 0 = initial / step 1, 1 = step 2, etc.
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);

  const { steps, finalProduct } = generateMultiplicationSteps(mVal, qVal);
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
      }, 1500);
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
    if (!isNaN(m) && !isNaN(q) && m > 0 && q > 0 && m <= 15 && q <= 15) {
      setMVal(m);
      setQVal(q);
      setStepIndex(0);
      setAutoPlay(false);
      setCustomOpen(false);
    }
  };

  // 8-bit representations
  const aBits = to8BitArray(currentStep.aAfter);
  const aHighNibble = aBits.slice(0, 4);
  const aLowNibble = aBits.slice(4, 8);

  const mBits = to8BitArray(currentStep.mCurrent);
  const mHighNibble = mBits.slice(0, 4);
  const mLowNibble = mBits.slice(4, 8);

  const qBits = to4BitArray(currentStep.qCurrent);

  const aBeforeBitsStr = to8BitArray(currentStep.aBefore).join(' ');
  const mBitsStr = to8BitArray(currentStep.mCurrent).join(' ');
  const aAfterBitsStr = to8BitArray(currentStep.aAfter).join(' ');

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
              Step {currentStep.stepIndex} of {totalSteps}
            </Text>
          </View>
          <View style={styles.cycleBadge}>
            <Text style={styles.cycleBadgeText}>
              Cycle {currentStep.stepIndex}: {currentStep.operation}
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
                  {isPast ? `Bit ${i} ✓` : isCur ? `Bit ${i} • Active` : `Bit ${i}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Live Hardware Register Dashboard */}
      <View style={styles.dashboardSection}>
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
                  Hex: 0x{currentStep.aAfter.toString(16).toUpperCase().padStart(2, '0')}
                </Text>
              </View>
              <View style={styles.decPill}>
                <Text style={styles.decText}>Dec: {currentStep.aAfter}</Text>
              </View>
            </View>
          </View>

          {/* 8-Bit Matrix with Nibble Divider */}
          <View style={styles.matrix8BitRow}>
            {/* High Nibble */}
            <View style={styles.nibbleGrid}>
              {aHighNibble.map((b, idx) => {
                const bitNum = 7 - idx;
                const isHigh = b === '1';
                return (
                  <View key={idx} style={styles.bitCellCol}>
                    <Text style={styles.bitSubLabel}>b{bitNum}</Text>
                    <View
                      style={[
                        styles.bitCellBox,
                        isHigh ? styles.bitCellFlame : styles.bitCellDefault,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bitCellNum,
                          isHigh ? styles.bitCellNumFlame : styles.bitCellNumDefault,
                        ]}
                      >
                        {b}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Nibble Divider Bar */}
            <View style={styles.nibbleDivider} />

            {/* Low Nibble */}
            <View style={styles.nibbleGrid}>
              {aLowNibble.map((b, idx) => {
                const bitNum = 3 - idx;
                const isHigh = b === '1';
                return (
                  <View key={idx} style={styles.bitCellCol}>
                    <Text
                      style={[
                        styles.bitSubLabel,
                        isHigh && { color: COLORS.terracotta, fontWeight: '800' },
                      ]}
                    >
                      b{bitNum}
                    </Text>
                    <View
                      style={[
                        styles.bitCellBox,
                        isHigh ? styles.bitCellFlame : styles.bitCellDefault,
                      ]}
                    >
                      <Text
                        style={[
                          styles.bitCellNum,
                          isHigh ? styles.bitCellNumFlame : styles.bitCellNumDefault,
                        ]}
                      >
                        {b}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.regCardFooter}>
            <Text style={styles.prevText}>
              Previous State:{' '}
              <Text style={styles.boldObsidian}>
                {to8BitArray(currentStep.aBefore).join('')} ({currentStep.aBefore})
              </Text>
            </Text>
            <View style={styles.deltaBadge}>
              <Text style={styles.deltaText}>
                {currentStep.appliedDelta > 0
                  ? `+${currentStep.appliedDelta} Applied`
                  : 'No Add (Shift Only)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Multiplicand (M) Card */}
        <View style={styles.card}>
          <View style={styles.regCardHeader}>
            <View style={styles.dotTitleRow}>
              <View style={styles.navyDot} />
              <Text style={styles.regCardTitle}>Multiplicand (M)</Text>
            </View>
            <View style={styles.shiftBadgeNavy}>
              <MaterialIcons name="arrow-back" size={13} color={COLORS.cardCream} />
              <Text style={styles.shiftBadgeText}>
                {stepIndex === 0 ? 'INITIAL: ' : `SHIFTED L${stepIndex}: `}
                {currentStep.mCurrent}
              </Text>
            </View>
          </View>

          {/* 8-Bit Matrix */}
          <View style={styles.matrix8BitRow}>
            <View style={styles.nibbleGrid}>
              {mHighNibble.map((b, idx) => (
                <View key={idx} style={styles.bitCellBox}>
                  <Text style={styles.bitCellNumDefault}>{b}</Text>
                </View>
              ))}
            </View>
            <View style={styles.nibbleDivider} />
            <View style={styles.nibbleGrid}>
              {mLowNibble.map((b, idx) => {
                const isHigh = b === '1';
                return (
                  <View
                    key={idx}
                    style={[
                      styles.bitCellBox,
                      isHigh && {
                        backgroundColor: COLORS.obsidian,
                        borderColor: COLORS.obsidian,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bitCellNumDefault,
                        isHigh && { color: COLORS.white, fontWeight: '800' },
                      ]}
                    >
                      {b}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.scaleRow}>
            <Text style={styles.scaleText}>
              Original: <Text style={styles.boldObsidian}>{mVal}</Text> • Scaled x
              {Math.pow(2, stepIndex)}
            </Text>
          </View>
        </View>

        {/* Multiplier (Q) Card with Target Bit */}
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

          {/* 4-Bit Grid */}
          <View style={styles.qGrid4}>
            {qBits.map((b, idx) => {
              const qBitNum = 3 - idx;
              const isQ0 = idx === 3;
              return (
                <View key={idx} style={styles.qCellCol}>
                  <Text
                    style={[
                      styles.bitSubLabel,
                      isQ0 && { color: COLORS.terracotta, fontWeight: '800' },
                    ]}
                  >
                    {isQ0 ? 'q0 (Active)' : `q${qBitNum}`}
                  </Text>
                  <View
                    style={[
                      styles.qCellBox,
                      isQ0 ? styles.qCellActive : styles.qCellDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.qCellNum,
                        isQ0 ? styles.qCellNumActive : styles.qCellNumDefault,
                      ]}
                    >
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
        </View>
      </View>

      {/* 3. Interactive Binary Arithmetic Canvas (Deep Obsidian Navy #1E223D) */}
      <View style={styles.scratchpadCard}>
        <View style={styles.scratchpadHeader}>
          <View style={styles.scratchpadTitleRow}>
            <MaterialIcons name="calculate" size={18} color={COLORS.terracotta} />
            <Text style={styles.scratchpadTitle}>ALU Addition Scratchpad</Text>
          </View>
          <View style={styles.scratchpadPill}>
            <Text style={styles.scratchpadPillText}>Accumulator + Multiplicand</Text>
          </View>
        </View>

        {/* Visual Arithmetic Matrix */}
        <View style={styles.scratchpadBody}>
          {/* Row 1: A */}
          <View style={styles.scratchpadRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadLabel}>A:</Text>
              <Text style={styles.scratchpadBits}>{aBeforeBitsStr}</Text>
            </View>
            <Text style={styles.scratchpadDec}>(Dec: {currentStep.aBefore})</Text>
          </View>

          {/* Row 2: + M */}
          <View style={styles.scratchpadRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadPlus}>+</Text>
              <Text style={styles.scratchpadBits}>
                {currentStep.q0 === 1 ? mBitsStr : '0 0 0 0 0 0 0 0'}
              </Text>
            </View>
            <Text
              style={[
                styles.scratchpadDec,
                currentStep.q0 === 1 && { color: COLORS.terracotta, fontWeight: '700' },
              ]}
            >
              (Dec: {currentStep.q0 === 1 ? currentStep.mCurrent : 0})
            </Text>
          </View>

          {/* Divider Bar */}
          <View style={styles.scratchpadDivider} />

          {/* Result Row */}
          <View style={styles.scratchpadResultRow}>
            <View style={styles.scratchpadLeft}>
              <Text style={styles.scratchpadEquals}>=</Text>
              <Text style={styles.scratchpadResultBits}>{aAfterBitsStr}</Text>
            </View>
            <View style={styles.scratchpadResultBadge}>
              <Text style={styles.scratchpadResultDec}>
                (Dec: {currentStep.aAfter})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Step Operation Controller & Dynamic Insight */}
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

      {/* 5. Custom Multiplier Sandbox Trigger */}
      <View style={styles.customCard}>
        <View style={styles.customHeader}>
          <View style={styles.customLeft}>
            <View style={styles.customIconSquare}>
              <MaterialIcons name="tune" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.customTitle}>Custom Multiplier</Text>
              <Text style={styles.customSub}>Try other factors like 6 × 7</Text>
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
                <Text style={styles.inputLabel}>Multiplicand (1-15):</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={multiplicandInput}
                  onChangeText={setMultiplicandInput}
                  maxLength={2}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Multiplier (1-15):</Text>
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
              <Text style={styles.applyBtnText}>Apply & Run Simulator</Text>
              <MaterialIcons name="play-arrow" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
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
  card: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.subtleCard,
    gap: 12,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudStepBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumPill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    color: COLORS.cardCream,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hudStepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  cycleBadge: {
    backgroundColor: 'rgba(245, 79, 27, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 79, 27, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
  },
  cycleBadgeText: {
    color: COLORS.terracotta,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  segmentTrackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  segmentCol: {
    flex: 1,
    gap: 4,
  },
  segmentBar: {
    height: 8,
    borderRadius: 4,
  },
  segmentBarDone: {
    backgroundColor: COLORS.obsidian,
  },
  segmentBarActive: {
    backgroundColor: COLORS.terracotta,
  },
  segmentBarPending: {
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 0.5,
    borderColor: COLORS.cardBorder,
  },
  segmentText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  segmentTextDone: {
    color: COLORS.obsidian,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  segmentTextPending: {
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  dashboardSection: {
    gap: 12,
  },
  regCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.terracotta,
  },
  navyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.obsidian,
  },
  regCardTitle: {
    fontSize: 15,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hexText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  decPill: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  decText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  matrix8BitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  nibbleGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  nibbleDivider: {
    width: 3,
    height: 24,
    backgroundColor: COLORS.cardBorder,
    borderRadius: 2,
  },
  bitCellCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  bitSubLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitCellBox: {
    width: '100%',
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bitCellDefault: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  bitCellFlame: {
    backgroundColor: COLORS.terracotta,
    borderWidth: 1,
    borderColor: COLORS.terracottaDark,
    ...SHADOWS.hardFlame,
  },
  bitCellNum: {
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  bitCellNumDefault: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  bitCellNumFlame: {
    color: COLORS.white,
    fontWeight: '900',
  },
  regCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  prevText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  deltaBadge: {
    backgroundColor: 'rgba(245, 79, 27, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 79, 27, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  deltaText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  shiftBadgeNavy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  shiftBadgeText: {
    color: COLORS.cardCream,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scaleRow: {
    alignItems: 'flex-end',
  },
  scaleText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  targetBadgeFlame: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
    gap: 4,
  },
  targetBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qGrid4: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  qCellCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  qCellBox: {
    width: '100%',
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qCellDefault: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  qCellActive: {
    backgroundColor: COLORS.terracotta,
    borderWidth: 2,
    borderColor: COLORS.terracottaDark,
    ...SHADOWS.hardFlame,
  },
  qCellNum: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  qCellNumDefault: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  qCellNumActive: {
    color: COLORS.white,
    fontWeight: '900',
  },
  scratchpadCard: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primaryContainer,
    ...SHADOWS.hardInk,
  },
  scratchpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  scratchpadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scratchpadTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.cardCream,
  },
  scratchpadPill: {
    backgroundColor: 'rgba(245, 79, 27, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 79, 27, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scratchpadPillText: {
    color: COLORS.terracotta,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadBody: {
    gap: 6,
    paddingTop: 2,
  },
  scratchpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scratchpadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scratchpadLabel: {
    color: 'rgba(250, 243, 232, 0.6)',
    fontWeight: '800',
    width: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadPlus: {
    color: COLORS.terracotta,
    fontWeight: '900',
    width: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadEquals: {
    color: COLORS.terracotta,
    fontWeight: '900',
    width: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadBits: {
    color: COLORS.cardCream,
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadDec: {
    color: 'rgba(250, 243, 232, 0.6)',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadDivider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1,
    marginVertical: 2,
  },
  scratchpadResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 79, 27, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 79, 27, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scratchpadResultBits: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  scratchpadResultBadge: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scratchpadResultDec: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.obsidian,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
    ...SHADOWS.subtleCard,
  },
  autoBtnText: {
    fontSize: 13,
    fontWeight: '700',
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
