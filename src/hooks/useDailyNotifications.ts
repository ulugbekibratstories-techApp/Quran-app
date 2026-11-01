import { useEffect, useState, useCallback } from 'react';
import { getTodayAyah, getTodayDua, getTodayHadith } from '../data/islamicData';

export interface NotificationSettings {
  enabled: boolean;
  ayahTime: string; // "HH:MM"
  hadithTime: string;
  zikrTime: string;
  permission: NotificationPermission | 'unsupported';
}

const STORAGE_KEY = 'quron_notification_settings';

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  ayahTime: '08:00',
  hadithTime: '12:30',
  zikrTime: '20:00',
  permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
};

function loadSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        permission:
          typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
      };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: NotificationSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesUntil(targetHHMM: string): number {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = timeToMinutes(targetHHMM);
  let diff = targetMinutes - nowMinutes;
  if (diff <= 0) diff += 24 * 60; // next day
  return diff;
}

export function useDailyNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Request permission when enabling
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false;
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    setSettings((prev) => ({ ...prev, permission: result }));
    return result === 'granted';
  }, []);

  const toggleEnabled = useCallback(async () => {
    if (!settings.enabled) {
      const granted = await requestPermission();
      if (granted) {
        setSettings((prev) => ({ ...prev, enabled: true }));
      }
    } else {
      setSettings((prev) => ({ ...prev, enabled: false }));
    }
  }, [settings.enabled, requestPermission]);

  const updateTime = useCallback(
    (key: 'ayahTime' | 'hadithTime' | 'zikrTime', value: string) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Schedule notifications using setTimeout
  useEffect(() => {
    if (!settings.enabled || settings.permission !== 'granted') return;
    if (typeof Notification === 'undefined') return;

    const todayStr = new Date().toISOString().split('T')[0];

    type ScheduledNotif = {
      label: string;
      delay: number;
      body: string;
      tag: string;
    };

    const scheduleNext = (): ScheduledNotif | null => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      const candidates: Array<{
        key: string;
        time: string;
        body: () => string;
      }> = [
        {
          key: 'ayah',
          time: settings.ayahTime,
          body: () => {
            const ayah = getTodayAyah(todayStr);
            return `${ayah.surahLatin} ${ayah.ayahNumber}-oyat: ${ayah.uzbekLatin}`;
          },
        },
        {
          key: 'hadith',
          time: settings.hadithTime,
          body: () => {
            const hadith = getTodayHadith(todayStr);
            return `${hadith.uzbekLatin} (${hadith.collection}, ${hadith.hadithNumber})`;
          },
        },
        {
          key: 'zikr',
          time: settings.zikrTime,
          body: () => {
            const dua = getTodayDua(todayStr);
            return `${dua.titleLatin}: ${dua.uzbekLatin}`;
          },
        },
      ];

      let best: ScheduledNotif | null = null;

      for (const c of candidates) {
        const targetMin = timeToMinutes(c.time);
        let diff = targetMin - nowMinutes;
        if (diff <= 0) diff += 24 * 60;
        if (!best || diff < best.delay) {
          best = { label: c.key, delay: diff, body: c.body(), tag: `quron_${c.key}_${todayStr}` };
        }
      }

      return best;
    };

    const next = scheduleNext();
    if (!next) return;

    const timer = setTimeout(() => {
      try {
        new Notification('QUR\u2019ON APP — Kunlik eslatma', {
          body: next.body,
          tag: next.tag,
          icon: '/pwa-192x192.png',
        });
      } catch {
        // Notification may fail in some browsers
      }
      // Re-run to schedule the next one
      setSettings((prev) => ({ ...prev }));
    }, next.delay * 60 * 1000);

    return () => clearTimeout(timer);
  }, [settings]);

  // Send a test notification
  const sendTestNotification = useCallback(async () => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const todayStr = new Date().toISOString().split('T')[0];
    const ayah = getTodayAyah(todayStr);
    try {
      new Notification('QUR\u2019ON APP — Bildirishnoma ishlamoqda', {
        body: `${ayah.surahLatin} ${ayah.ayahNumber}-oyat: ${ayah.uzbekLatin}`,
        tag: 'quron_test',
        icon: '/pwa-192x192.png',
      });
    } catch {
      // ignore
    }
  }, []);

  return {
    settings,
    toggleEnabled,
    updateTime,
    requestPermission,
    sendTestNotification,
  };
}
