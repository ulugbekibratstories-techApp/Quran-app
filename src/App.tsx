import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LayoutShell } from './components/LayoutShell';
import { HomeView } from './components/HomeView';
import { QuranReaderView } from './components/QuranReaderView';
import { AudioLibraryView, RecitersView } from './components/AudioAndRecitersView';
import { DownloadsView } from './components/DownloadsView';
import { VideosView } from './components/VideosView';
import { SavedView, SettingsView } from './components/SavedAndSettingsView';
import { AdminPanelView } from './components/AdminPanelView';
import { PrayerTimesView } from './components/PrayerTimesView';
import { DailySpiritualView } from './components/DailySpiritualView';
import { AsmaulHusnaView } from './components/AsmaulHusnaView';
import { HifzAndTajwidView } from './components/HifzAndTajwidView';
import { PersistentAudioBar } from './components/PersistentAudioBar';

const MainRouter: React.FC = () => {
  const { view } = useApp();

  return (
    <LayoutShell>
      {view === 'home' && <HomeView />}
      {view === 'quran' && <QuranReaderView />}
      {view === 'audio' && <AudioLibraryView />}
      {view === 'reciters' && <RecitersView />}
      {view === 'downloads' && <DownloadsView />}
      {view === 'videos' && <VideosView />}
      {view === 'saved' && <SavedView />}
      {view === 'settings' && <SettingsView />}
      {view === 'admin' && <AdminPanelView />}
      {view === 'prayer' && <PrayerTimesView />}
      {view === 'daily' && <DailySpiritualView />}
      {view === 'asmaulHusna' && <AsmaulHusnaView />}
      {view === 'hifzTajwid' && <HifzAndTajwidView />}
      <PersistentAudioBar />
    </LayoutShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
