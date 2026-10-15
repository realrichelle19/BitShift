import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const PLAYER_NAME_KEY = '@bitshift_player_name';

export async function getStoredPlayerName() {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      const name = window.localStorage.getItem(PLAYER_NAME_KEY);
      if (name && name.trim()) return name.trim();
    }
    const name = await AsyncStorage.getItem(PLAYER_NAME_KEY);
    return name && name.trim() ? name.trim() : null;
  } catch (error) {
    console.warn('Failed to read player name from storage:', error);
    return null;
  }
}

export async function storePlayerName(name) {
  try {
    const trimmed = (name || '').trim();
    if (!trimmed) return false;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(PLAYER_NAME_KEY, trimmed);
    }
    await AsyncStorage.setItem(PLAYER_NAME_KEY, trimmed);
    return true;
  } catch (error) {
    console.warn('Failed to save player name to storage:', error);
    return false;
  }
}

export async function clearStoredPlayerName() {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(PLAYER_NAME_KEY);
    }
    await AsyncStorage.removeItem(PLAYER_NAME_KEY);
  } catch (error) {
    console.warn('Failed to clear player name:', error);
  }
}
