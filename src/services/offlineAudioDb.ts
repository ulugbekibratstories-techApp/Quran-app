/**
 * IndexedDB storage for offline Quran audio tracks
 */

export interface OfflineStoredTrack {
  id: string;
  reciterId: string;
  surahNumber: number;
  surahNameLatin: string;
  surahNameCyrillic: string;
  surahNameArabic: string;
  blob: Blob;
  mimeType: string;
  sizeBytes: number;
  savedAt: string;
}

const DB_NAME = 'QuronApp_OfflineAudio';
const DB_VERSION = 1;
const STORE_NAME = 'audio_tracks';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_surah', 'surahNumber', { unique: false });
        store.createIndex('by_reciter', 'reciterId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAudioOffline(track: OfflineStoredTrack): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(track);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineTrack(id: string): Promise<OfflineStoredTrack | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve((request.result as OfflineStoredTrack) || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineTrackBySurah(
  reciterId: string,
  surahNumber: number
): Promise<OfflineStoredTrack | null> {
  const id = `${reciterId}_${surahNumber}`;
  return getOfflineTrack(id);
}

export async function getAllOfflineTracks(): Promise<OfflineStoredTrack[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as OfflineStoredTrack[]) || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineTrack(id: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllOfflineTracks(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
