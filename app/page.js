'use client';

import { useEffect, useState } from 'react';

// Import all your components, including the new background
import AnimateBackground from '../components/AnimateBackground'; // <-- 1. IMPORT IT
import Navbar from '../components/Navbar';
import Portfolio from '../components/Portfolio';
import RAGPlayground from '../components/RAGPlayground';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState('portfolio'); // 'portfolio' or 'chat'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`);
        const profileData = await profileRes.json();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <AnimateBackground /> {/* Add background to loading screen too */}
        <div className="relative z-10"> {/* Ensure loader is on top */}
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent">
      <AnimateBackground /> {/* <-- 2. ADD THE COMPONENT HERE */}
      
      {/* All content below is positioned relative and with a z-index to appear on top */}
      <div className="relative z-10"> 
        <Navbar name={profile.name} activeView={activeView} setActiveView={setActiveView} />
        <main>
          {activeView === 'portfolio' && <Portfolio profile={profile} />}
          {activeView === 'chat' && <RAGPlayground />}
        </main>
        <footer className="text-center py-8 bg-gray-50/70 backdrop-blur-sm">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}