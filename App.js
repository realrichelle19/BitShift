import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SHADOWS } from './src/theme';
import Header from './src/components/Header';
import BottomNav from './src/components/BottomNav';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LearnScreen from './src/screens/LearnScreen';
import SimulatorScreen from './src/screens/SimulatorScreen';
import QuestScreen from './src/screens/QuestScreen';
import TableScreen from './src/screens/TableScreen';
import { getStoredPlayerName, storePlayerName } from './src/utils/storage';

export default function App() {
  const [playerName, setPlayerName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learn');

  // Edit name modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [editError, setEditError] = useState('');

  // Load saved name on mount
  useEffect(() => {
    async function loadName() {
      const stored = await getStoredPlayerName();
      if (stored) {
        setPlayerName(stored);
      }
      setIsLoading(false);
    }
    loadName();
  }, []);

  const handleNameEntered = (name) => {
    setPlayerName(name);
    setActiveTab('learn');
  };

  const handleOpenEditModal = () => {
    setEditNameInput(playerName || '');
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleSaveEditedName = async () => {
    const trimmed = editNameInput.trim();
    if (!trimmed) {
      setEditError('Name cannot be empty.');
      return;
    }
    if (trimmed.length < 2) {
      setEditError('Name must be at least 2 characters.');
      return;
    }
    await storePlayerName(trimmed);
    setPlayerName(trimmed);
    setIsEditModalOpen(false);
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'learn':
        return 'Learn';
      case 'simulator':
        return 'Simulator';
      case 'quest':
        return 'Quest';
      case 'table':
        return 'Table';
      default:
        return 'Learn';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
      </View>
    );
  }

  // First-time entry: Prompt for player's name
  if (!playerName) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor={COLORS.pageBg} />
        <WelcomeScreen onComplete={handleNameEntered} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={COLORS.cardCream} />
      <View style={styles.appContainer}>
        {/* Top Persistent Header */}
        <Header
          subtitle={getSubtitle()}
          playerName={playerName}
          onEditName={handleOpenEditModal}
        />

        {/* Active Screen Body */}
        <View style={styles.screenContainer}>
          {activeTab === 'learn' && (
            <LearnScreen
              playerName={playerName}
              onNavigateToSimulator={() => setActiveTab('simulator')}
              onNavigateToQuest={() => setActiveTab('quest')}
            />
          )}
          {activeTab === 'simulator' && <SimulatorScreen />}
          {activeTab === 'quest' && (
            <QuestScreen
              playerName={playerName}
              onNavigateToHome={() => setActiveTab('learn')}
            />
          )}
          {activeTab === 'table' && <TableScreen />}
        </View>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabSelect={setActiveTab} />

        {/* Edit Name Modal */}
        <Modal
          visible={isEditModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalTitleRow}>
                  <MaterialIcons name="badge" size={20} color={COLORS.terracotta} />
                  <Text style={styles.modalTitle}>Update Player Name</Text>
                </View>
                <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                  <MaterialIcons name="close" size={20} color={COLORS.obsidian} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSub}>
                Update your name to personalize your greetings and completion certificates.
              </Text>

              <TextInput
                style={[
                  styles.modalInput,
                  editError ? styles.modalInputError : null,
                ]}
                value={editNameInput}
                onChangeText={(text) => {
                  setEditNameInput(text);
                  if (editError) setEditError('');
                }}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
                maxLength={30}
              />

              {editError ? (
                <Text style={styles.modalErrorText}>{editError}</Text>
              ) : null}

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsEditModalOpen(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveEditedName}
                >
                  <Text style={styles.modalSaveBtnText}>Save Name</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cardCream,
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
    maxWidth: Platform.OS === 'web' ? 520 : undefined,
    width: '100%',
    alignSelf: 'center',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: COLORS.cardBorder,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.pageBg,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(30, 34, 61, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.cardCream,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    gap: 12,
    ...SHADOWS.hardInk,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.obsidian,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    lineHeight: 17,
  },
  modalInput: {
    backgroundColor: COLORS.pageBg,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.obsidian,
  },
  modalInputError: {
    borderColor: '#BA1A1A',
  },
  modalErrorText: {
    fontSize: 11,
    color: '#BA1A1A',
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.cardCreamAlt,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  modalCancelBtnText: {
    color: COLORS.obsidian,
    fontSize: 13,
    fontWeight: '700',
  },
  modalSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: COLORS.terracotta,
    ...SHADOWS.hardInk,
  },
  modalSaveBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
});
