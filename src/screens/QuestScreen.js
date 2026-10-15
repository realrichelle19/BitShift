import React, { useState, useEffect, useRef } from 'react';
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
import { getRandomQuestQuestions } from '../data/questionBank';

export default function QuestScreen({ playerName = 'Student', onNavigateToHome }) {
  // Quest state: 'intro' | 'active' | 'completed'
  const [questPhase, setQuestPhase] = useState('intro');

  // Question session data (5 randomized questions)
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Current question interaction state
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isResolved, setIsResolved] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState(null); // { isCorrect: boolean, text: string }
  const [hintVisible, setHintVisible] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);

  // Result tracking: Exactly 5 items, each recorded as 'correct' | 'incorrect' | 'skipped'
  const [questionOutcomes, setQuestionOutcomes] = useState([]); // Array of { id, outcome: 'correct'|'incorrect'|'skipped' }

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerIntervalRef = useRef(null);

  // Sound toggle (cosmetic state for arcade feel)
  const [soundOn, setSoundOn] = useState(true);

  // Initialize a fresh 5-question quest
  const startFreshQuest = () => {
    const fiveQuestions = getRandomQuestQuestions();
    setQuestions(fiveQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsResolved(false);
    setSubmissionFeedback(null);
    setHintVisible(false);
    setValidationAlert(null);
    setQuestionOutcomes([]);
    setElapsedSeconds(0);
    setQuestPhase('active');
  };

  // Timer control: starts on 'active', stops on 'completed' or unmount
  useEffect(() => {
    if (questPhase === 'active') {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [questPhase]);

  const formatTimer = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  // Handle option selection (can change before submit)
  const handleSelectOption = (optId) => {
    if (isResolved) return; // Locked once submitted
    setSelectedOptionId(optId);
    if (validationAlert) setValidationAlert(null);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (isResolved) return;

    if (!selectedOptionId) {
      setValidationAlert('Please select an answer choice before submitting!');
      return;
    }

    const chosenOption = currentQuestion.options.find(
      (opt) => opt.id === selectedOptionId
    );

    const isCorrect = chosenOption ? chosenOption.correct : false;

    setIsResolved(true);
    setSubmissionFeedback({
      isCorrect,
      explanation: isCorrect
        ? currentQuestion.explanation
        : `Not quite. ${currentQuestion.explanation}`,
    });

    setQuestionOutcomes((prev) => [
      ...prev,
      {
        id: currentQuestion.id,
        outcome: isCorrect ? 'correct' : 'incorrect',
      },
    ]);
  };

  // Advance to next question or complete quest
  const handleContinueNext = () => {
    setValidationAlert(null);
    setHintVisible(false);

    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsResolved(false);
      setSubmissionFeedback(null);
    } else {
      // Completed all 5 questions
      setQuestPhase('completed');
    }
  };

  // Skip question
  const handleSkipQuestion = () => {
    if (isResolved) {
      handleContinueNext();
      return;
    }

    setQuestionOutcomes((prev) => [
      ...prev,
      {
        id: currentQuestion.id,
        outcome: 'skipped',
      },
    ]);

    setValidationAlert(null);
    setHintVisible(false);

    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsResolved(false);
      setSubmissionFeedback(null);
    } else {
      setQuestPhase('completed');
    }
  };

  // Calculate results
  const correctCount = questionOutcomes.filter((o) => o.outcome === 'correct').length;
  const incorrectCount = questionOutcomes.filter((o) => o.outcome === 'incorrect').length;
  const skippedCount = questionOutcomes.filter((o) => o.outcome === 'skipped').length;

  // ==========================================
  // PHASE 1: QUEST INTRODUCTION SCREEN
  // ==========================================
  if (questPhase === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.introCard}>
          {/* Header */}
          <View style={styles.introTopRow}>
            <View style={styles.challengeBadge}>
              <MaterialIcons name="military-tech" size={15} color={COLORS.terracotta} />
              <Text style={styles.challengeBadgeText}>Architectural Challenge</Text>
            </View>
            <TouchableOpacity
              style={styles.soundBtn}
              onPress={() => setSoundOn(!soundOn)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={soundOn ? 'volume-up' : 'volume-off'}
                size={18}
                color={COLORS.obsidian}
              />
            </TouchableOpacity>
          </View>

          {/* Title & Personalized Greeting */}
          <View style={styles.introHeadingCol}>
            <Text style={styles.introMainTitle}>Shift-and-Add Multiplier Quest</Text>
            <Text style={styles.introGreetingText}>
              Ready to test your binary hardware logic,{' '}
              <Text style={styles.boldTerracottaText}>{playerName}</Text>?
            </Text>
          </View>

          {/* Quest Specifications Card */}
          <View style={styles.specsBox}>
            <Text style={styles.specsBoxTitle}>QUEST PARAMETERS</Text>
            <View style={styles.specItemRow}>
              <MaterialIcons name="format-list-numbered" size={18} color={COLORS.terracotta} />
              <Text style={styles.specItemText}>
                <Text style={styles.boldObsidian}>5 Sequential Question Levels:</Text> Step
                through core computer architecture and ALU multiplication logic.
              </Text>
            </View>
            <View style={styles.specItemRow}>
              <MaterialIcons name="timer" size={18} color={COLORS.terracotta} />
              <Text style={styles.specItemText}>
                <Text style={styles.boldObsidian}>Continuous Hardware Clock:</Text> The timer
                begins the moment you start and tracks your total solve time.
              </Text>
            </View>
            <View style={styles.specItemRow}>
              <MaterialIcons name="lightbulb" size={18} color={COLORS.terracotta} />
              <Text style={styles.specItemText}>
                <Text style={styles.boldObsidian}>Architecture Hints Available:</Text> On-demand
                hints for each question without penalties.
              </Text>
            </View>
            <View style={styles.specItemRow}>
              <MaterialIcons name="shuffle" size={18} color={COLORS.terracotta} />
              <Text style={styles.specItemText}>
                <Text style={styles.boldObsidian}>Randomized Questions:</Text> Every attempt
                draws a unique set of questions from the master bank.
              </Text>
            </View>
          </View>

          {/* Begin Button */}
          <TouchableOpacity
            style={styles.beginQuestBtn}
            onPress={startFreshQuest}
            activeOpacity={0.85}
          >
            <MaterialIcons name="play-arrow" size={22} color={COLORS.white} />
            <Text style={styles.beginQuestBtnText}>Begin Quest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ==========================================
  // PHASE 3: QUEST COMPLETION SCREEN
  // ==========================================
  if (questPhase === 'completed') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.completionCard}>
          {/* Trophy & Badge */}
          <View style={styles.trophyWrapper}>
            <MaterialIcons name="military-tech" size={44} color={COLORS.white} />
          </View>

          {/* EXACT REQUIRED TEXT */}
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedBadgeText}>QUEST UNLOCKED</Text>
          </View>

          {/* Personalized Congratulatory Message */}
          <Text style={styles.congratsHeading}>
            Congratulations, {playerName}!
          </Text>
          <Text style={styles.congratsSub}>
            You've completed the BitShift Quest! You demonstrated mastery of the
            Shift-and-Add Multiplication Algorithm and binary register dynamics.
          </Text>

          {/* Results Matrix */}
          <View style={styles.resultsBox}>
            <Text style={styles.resultsBoxTitle}>VERIFIED RESULTS BREAKDOWN</Text>

            <View style={styles.resultRow}>
              <View style={styles.resultLabelRow}>
                <MaterialIcons name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.resultLabel}>Correct Answers</Text>
              </View>
              <Text style={styles.resultValCorrect}>{correctCount}</Text>
            </View>

            <View style={styles.resultRow}>
              <View style={styles.resultLabelRow}>
                <MaterialIcons name="cancel" size={16} color="#BA1A1A" />
                <Text style={styles.resultLabel}>Incorrect Answers</Text>
              </View>
              <Text style={styles.resultValIncorrect}>{incorrectCount}</Text>
            </View>

            <View style={styles.resultRow}>
              <View style={styles.resultLabelRow}>
                <MaterialIcons name="skip-next" size={16} color={COLORS.textMuted} />
                <Text style={styles.resultLabel}>Skipped Questions</Text>
              </View>
              <Text style={styles.resultValSkipped}>{skippedCount}</Text>
            </View>

            <View style={styles.resultDivider} />

            <View style={styles.resultRow}>
              <View style={styles.resultLabelRow}>
                <MaterialIcons name="format-list-bulleted" size={16} color={COLORS.obsidian} />
                <Text style={[styles.resultLabel, { fontWeight: '800' }]}>
                  Total Questions Resolved
                </Text>
              </View>
              <Text style={styles.resultValTotal}>
                {correctCount + incorrectCount + skippedCount} of 5
              </Text>
            </View>

            <View style={styles.resultRow}>
              <View style={styles.resultLabelRow}>
                <MaterialIcons name="timer" size={16} color={COLORS.terracotta} />
                <Text style={styles.resultLabel}>Total Solve Time</Text>
              </View>
              <Text style={styles.resultValTime}>{formatTimer(elapsedSeconds)}</Text>
            </View>
          </View>

          {/* Action Buttons: Play Again & Return Home */}
          <View style={styles.completionActionsCol}>
            <TouchableOpacity
              style={styles.playAgainBtn}
              onPress={startFreshQuest}
              activeOpacity={0.85}
            >
              <MaterialIcons name="replay" size={20} color={COLORS.white} />
              <Text style={styles.playAgainBtnText}>Play Again (New Questions)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.returnHomeBtn}
              onPress={() => {
                setQuestPhase('intro');
                if (onNavigateToHome) onNavigateToHome();
              }}
              activeOpacity={0.85}
            >
              <MaterialIcons name="home" size={18} color={COLORS.obsidian} />
              <Text style={styles.returnHomeBtnText}>Return to Learning Desk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // ==========================================
  // PHASE 2: ACTIVE 5-QUESTION QUEST GAMEPLAY
  // ==========================================
  const levelNum = currentQuestionIndex + 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Arena Header Card with Quest Level Indicator & Live Timer */}
      <View style={styles.arenaCard}>
        <View style={styles.arenaTopRow}>
          <View style={styles.challengeBadge}>
            <MaterialIcons name="military-tech" size={15} color={COLORS.terracotta} />
            <Text style={styles.challengeBadgeText}>
              Level {levelNum}: Question {levelNum} of 5
            </Text>
          </View>

          {/* Live Timer */}
          <View style={styles.timerPill}>
            <MaterialIcons name="timer" size={14} color={COLORS.terracotta} />
            <Text style={styles.timerText}>{formatTimer(elapsedSeconds)}</Text>
          </View>
        </View>

        {/* Quest Progress Bar (width reflects question 1 through 5) */}
        <View style={styles.questProgressBar}>
          <View
            style={[
              styles.questProgressFill,
              { width: `${(levelNum / 5) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Architecture Context / Registers Display (if present) */}
      {currentQuestion && currentQuestion.registers && (
        <View style={styles.registerStateBox}>
          <Text style={styles.regStateTitle}>HARDWARE REGISTER CONTEXT</Text>
          <View style={styles.regStateRow}>
            <View style={styles.regStateLeft}>
              <Text style={styles.regStateLetter}>A</Text>
              <Text style={styles.regStateDesc}>Accumulator</Text>
            </View>
            <Text style={styles.regStateBits}>{currentQuestion.registers.a}</Text>
          </View>
          <View style={styles.regStateRow}>
            <View style={styles.regStateLeft}>
              <Text style={[styles.regStateLetter, { color: COLORS.terracotta }]}>M</Text>
              <Text style={styles.regStateDesc}>Multiplicand</Text>
            </View>
            <Text style={styles.regStateBits}>{currentQuestion.registers.m}</Text>
          </View>
          <View style={styles.regStateRow}>
            <View style={styles.regStateLeft}>
              <Text style={styles.regStateLetter}>Q</Text>
              <Text style={styles.regStateDesc}>Multiplier</Text>
            </View>
            <View style={styles.targetBadgeRow}>
              <Text style={styles.regStateBits}>{currentQuestion.registers.q}</Text>
              <View style={styles.targetPill}>
                <Text style={styles.targetPillText}>
                  {currentQuestion.registers.targetBit}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Question Card */}
      <View style={styles.card}>
        <View style={styles.conceptTagRow}>
          <MaterialIcons name="memory" size={14} color={COLORS.terracotta} />
          <Text style={styles.conceptTagText}>{currentQuestion.concept}</Text>
        </View>

        <Text style={styles.questionTitle}>{currentQuestion.question}</Text>

        {/* Validation Warning Alert */}
        {validationAlert && (
          <View style={styles.validationBox}>
            <MaterialIcons name="error-outline" size={16} color="#BA1A1A" />
            <Text style={styles.validationText}>{validationAlert}</Text>
          </View>
        )}

        {/* MCQ Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectAnswer = opt.correct;

            let cardStyle = styles.optionCard;
            let circleStyle = styles.optionLetterCircle;
            let textStyle = styles.optionText;

            if (isResolved) {
              if (isSelected && isCorrectAnswer) {
                cardStyle = [styles.optionCard, styles.optionCorrect];
                circleStyle = [styles.optionLetterCircle, styles.circleCorrect];
                textStyle = [styles.optionText, styles.textBoldWhite];
              } else if (isSelected && !isCorrectAnswer) {
                cardStyle = [styles.optionCard, styles.optionIncorrect];
                circleStyle = [styles.optionLetterCircle, styles.circleIncorrect];
                textStyle = [styles.optionText, styles.textBoldWhite];
              } else if (isCorrectAnswer) {
                cardStyle = [styles.optionCard, styles.optionShowCorrect];
              }
            } else if (isSelected) {
              cardStyle = [styles.optionCard, styles.optionSelected];
              circleStyle = [styles.optionLetterCircle, styles.circleSelected];
              textStyle = [styles.optionText, styles.textBoldWhite];
            }

            return (
              <TouchableOpacity
                key={opt.id}
                style={cardStyle}
                onPress={() => handleSelectOption(opt.id)}
                activeOpacity={0.8}
                disabled={isResolved}
              >
                <View style={styles.optionHeaderRow}>
                  <View style={circleStyle}>
                    {isResolved && isSelected && isCorrectAnswer ? (
                      <MaterialIcons name="check" size={15} color={COLORS.white} />
                    ) : isResolved && isSelected && !isCorrectAnswer ? (
                      <MaterialIcons name="close" size={15} color={COLORS.white} />
                    ) : (
                      <Text
                        style={[
                          styles.optionLetterText,
                          (isSelected || (isResolved && isCorrectAnswer)) && {
                            color: COLORS.white,
                          },
                        ]}
                      >
                        {opt.id}
                      </Text>
                    )}
                  </View>
                  <Text style={textStyle}>{opt.text}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Immediate Feedback Box after Submission */}
        {isResolved && submissionFeedback && (
          <View
            style={[
              styles.feedbackBox,
              submissionFeedback.isCorrect
                ? styles.feedbackCorrectBox
                : styles.feedbackIncorrectBox,
            ]}
          >
            <View style={styles.feedbackHeader}>
              <MaterialIcons
                name={submissionFeedback.isCorrect ? 'check-circle' : 'info'}
                size={18}
                color={submissionFeedback.isCorrect ? COLORS.success : '#BA1A1A'}
              />
              <Text
                style={[
                  styles.feedbackTitle,
                  {
                    color: submissionFeedback.isCorrect
                      ? COLORS.success
                      : '#BA1A1A',
                  },
                ]}
              >
                {submissionFeedback.isCorrect
                  ? 'Correct! Well done.'
                  : 'Incorrect Evaluation'}
              </Text>
            </View>
            <Text style={styles.feedbackText}>
              {submissionFeedback.explanation}
            </Text>
          </View>
        )}
      </View>

      {/* Floating Action Controls */}
      <View style={styles.actionControlsArea}>
        {!isResolved ? (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmitAnswer}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Submit Answer</Text>
            <MaterialIcons name="check" size={18} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextLevelBtn}
            onPress={handleContinueNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextLevelBtnText}>
              {currentQuestionIndex < 4 ? 'Continue to Next Level' : 'View Quest Results'}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <View style={styles.hintSkipRow}>
          <TouchableOpacity
            style={styles.hintBtn}
            onPress={() => setHintVisible(!hintVisible)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="lightbulb" size={16} color={COLORS.terracotta} />
            <Text style={styles.hintBtnText}>
              {hintVisible ? 'Hide Hint' : 'View Hint'}
            </Text>
          </TouchableOpacity>

          {!isResolved && (
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={handleSkipQuestion}
              activeOpacity={0.7}
            >
              <Text style={styles.skipBtnText}>Skip Question</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Interactive Hint Toast Drawer */}
      {hintVisible && (
        <View style={styles.hintToast}>
          <MaterialIcons name="tips-and-updates" size={20} color={COLORS.terracotta} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.hintToastTitle}>Hardware Architecture Hint:</Text>
            <Text style={styles.hintToastText}>{currentQuestion.hint}</Text>
          </View>
          <TouchableOpacity onPress={() => setHintVisible(false)}>
            <MaterialIcons name="close" size={18} color={COLORS.obsidian} />
          </TouchableOpacity>
        </View>
      )}

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
  // Intro Styles
  introCard: {
    backgroundColor: COLORS.cardCream,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 20,
    gap: 16,
    ...SHADOWS.subtleCard,
  },
  introTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  challengeBadgeText: {
    color: COLORS.cardCream,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  soundBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introHeadingCol: {
    gap: 4,
  },
  introMainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  introGreetingText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  boldTerracottaText: {
    color: COLORS.terracotta,
    fontWeight: '800',
  },
  specsBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  specsBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  specItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  specItemText: {
    fontSize: 12,
    color: COLORS.obsidian,
    lineHeight: 18,
    flex: 1,
  },
  boldObsidian: {
    color: COLORS.obsidian,
    fontWeight: '800',
  },
  beginQuestBtn: {
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.hardInk,
  },
  beginQuestBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },

  // Active Quest Styles
  arenaCard: {
    backgroundColor: COLORS.cardCream,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 14,
    gap: 10,
    ...SHADOWS.subtleCard,
  },
  arenaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  questProgressBar: {
    height: 7,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  questProgressFill: {
    height: '100%',
    backgroundColor: COLORS.terracotta,
    borderRadius: 4,
  },

  // Register State Context
  registerStateBox: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  regStateTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  regStateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  regStateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regStateLetter: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    width: 14,
  },
  regStateDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  regStateBits: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1.5,
  },
  targetBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  targetPill: {
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  targetPillText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Question & Options
  conceptTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conceptTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.obsidian,
    lineHeight: 21,
  },
  validationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECE7',
    borderWidth: 1,
    borderColor: '#BA1A1A',
    borderRadius: 8,
    padding: 8,
    gap: 6,
  },
  validationText: {
    color: '#BA1A1A',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  optionsContainer: {
    gap: 8,
    marginTop: 2,
  },
  optionCard: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
  },
  optionSelected: {
    backgroundColor: COLORS.obsidian,
    borderColor: COLORS.terracotta,
    borderWidth: 2,
    ...SHADOWS.subtleCard,
  },
  optionCorrect: {
    backgroundColor: COLORS.obsidian,
    borderColor: COLORS.success,
    borderWidth: 2,
  },
  optionIncorrect: {
    backgroundColor: COLORS.obsidian,
    borderColor: '#BA1A1A',
    borderWidth: 2,
  },
  optionShowCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.success,
    borderWidth: 1.5,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionLetterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  circleCorrect: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  circleIncorrect: {
    backgroundColor: '#BA1A1A',
    borderColor: '#BA1A1A',
  },
  optionLetterText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  optionText: {
    fontSize: 13,
    color: COLORS.obsidian,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  textBoldWhite: {
    color: COLORS.white,
    fontWeight: '700',
  },

  // Feedback
  feedbackBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginTop: 4,
  },
  feedbackCorrectBox: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.success,
  },
  feedbackIncorrectBox: {
    backgroundColor: '#FDECE7',
    borderColor: '#BA1A1A',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  feedbackText: {
    fontSize: 12,
    color: COLORS.obsidian,
    lineHeight: 17,
  },

  // Controls
  actionControlsArea: {
    gap: 8,
  },
  submitBtn: {
    backgroundColor: COLORS.obsidian,
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.hardInk,
  },
  submitBtnText: {
    color: COLORS.cardCream,
    fontSize: 14,
    fontWeight: '800',
  },
  nextLevelBtn: {
    backgroundColor: COLORS.terracotta,
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.hardInk,
  },
  nextLevelBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  hintSkipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hintBtn: {
    flex: 1,
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  hintBtnText: {
    color: COLORS.obsidian,
    fontSize: 11,
    fontWeight: '700',
  },
  skipBtn: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.cardCream,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnText: {
    color: COLORS.obsidian,
    fontSize: 11,
    fontWeight: '700',
  },
  hintToast: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    ...SHADOWS.subtleCard,
  },
  hintToastTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  hintToastText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },

  // Completion Styles
  completionCard: {
    backgroundColor: COLORS.cardCream,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    padding: 20,
    alignItems: 'center',
    gap: 14,
    ...SHADOWS.subtleCard,
  },
  trophyWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.hardInk,
  },
  unlockedBadge: {
    backgroundColor: COLORS.obsidian,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unlockedBadgeText: {
    color: COLORS.cardCream,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  congratsHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.obsidian,
    textAlign: 'center',
  },
  congratsSub: {
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  resultsBox: {
    width: '100%',
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  resultsBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultLabel: {
    fontSize: 12,
    color: COLORS.obsidian,
  },
  resultValCorrect: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.success,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultValIncorrect: {
    fontSize: 14,
    fontWeight: '800',
    color: '#BA1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultValSkipped: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultValTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.obsidian,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultValTime: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.terracotta,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  resultDivider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 4,
  },
  completionActionsCol: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
  playAgainBtn: {
    backgroundColor: COLORS.terracotta,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.hardInk,
  },
  playAgainBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  returnHomeBtn: {
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  returnHomeBtnText: {
    color: COLORS.obsidian,
    fontSize: 13,
    fontWeight: '700',
  },
});
