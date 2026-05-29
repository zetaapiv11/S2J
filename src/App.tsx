/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Image as ImageIcon, 
  Volume2, 
  Sparkles, 
  Send, 
  Heart, 
  Clock, 
  HeartHandshake, 
  Plus, 
  MapPin, 
  Flame,
  Check,
  ChevronRight,
  Info,
  Compass,
  AlertTriangle,
  Menu,
  X,
  Languages,
  Copy
} from 'lucide-react';

import { s2jKamus, membersData, initialStories, s2jVoices, galleryItems } from './data';
import { Member, S2JStory, WordPair } from './types';
import { KujangSVG, KerisSVG, CrossedKujangKeris } from './components/KujangKerisSVG';
import { AudioEngine } from './components/AudioEngine';

export default function App() {
  // Navigation states
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // App state
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  // Stories (Guestbook) interaction state
  const [stories, setStories] = useState<S2JStory[]>(() => {
    const local = localStorage.getItem('s2j_stories');
    return local ? JSON.parse(local) : initialStories;
  });
  const [storyName, setStoryName] = useState<string>('');
  const [storyOrig, setStoryOrig] = useState<'Sunda' | 'Jawa' | 'Nusantara'>('Nusantara');
  const [storyMsg, setStoryMsg] = useState<string>('');
  const [storyFilter, setStoryFilter] = useState<'all' | 'Sunda' | 'Jawa' | 'Nusantara'>('all');

  // Member lists UI states
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'owner' | 'admin' | 'member'>('all');
  const [memberSearch, setMemberSearch] = useState<string>('');

  // Dictionary UI state
  const [selectedWord, setSelectedWord] = useState<WordPair | null>(s2jKamus[0]);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [translateTarget, setTranslateTarget] = useState<'sunda' | 'jawa'>('sunda');

  // Gallery interactive Lightbox state
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  // Time tracker state
  const [timeStr, setTimeStr] = useState<string>('');

  // S2J fun stats simulation
  const [salamCount, setSalamCount] = useState<number>(() => {
    const local = localStorage.getItem('s2j_salam');
    return local ? parseInt(local) : 312;
  });

  // Clipboard sharing for Rules
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);

  const copyRuleToClipboard = (id: string, title: string, text: string) => {
    const formattedText = `*[ATURAN FAMS S2J (SEDULURAN SUNDA JAWA)]*\n\n*Rule ${id}: ${title}*\n"${text}"\n\n*Sodara di atas segalanya, rumah kedua buat kita semua* 🤝✨`;
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopiedRuleId(id);
        setTimeout(() => setCopiedRuleId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const copyWarningToClipboard = () => {
    const text = "JANGAN MENGHINA, MENGUNJING, MENGADU DOMBA, ATAU MENYAKITI HATI SODARA SENDIRI! Selesaikan masalah dengan bicara baik-baik (JANGAN BAWA KELUAR). Kalo bisa bicara dengan bahasa santun, sopan, dan enak di dengar. Hindari kata kasar, makian, atau perkataan yg menyakiti hati.";
    const formattedText = `*[WARNING S2J]* ⚠⚠⚠⚠⚠\n\n${text}\n\n*WASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH*`;
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        setCopiedRuleId('WARNING');
        setTimeout(() => setCopiedRuleId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const copyAllRulesToClipboard = () => {
    const rulesText = `*[ATURAN FAMS S2J (SEDULURAN SUNDA JAWA)]*
ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH
"Sodara di atas segalanya, rumah kedua buat kita semua"

1. Sodara Tanpa Kasta (Semua Anggota Setara)
Semua anggota yang udah masuk (S2J) di anggap sodara tua, muda, baru, lama, sama aja harganya tidak ada yg membedakan status atau jabatan.

2. Sambutan Hangat, Ikrar & Komitmen Bersama
Anggota baru wajib di sambut dengan hangat, wajib memperkenalkan diri ke anggota yg lama, jangan malu-malu dan jangan sungkan. Siapapun boleh mendaftar, asalkan punya niat tulus ingin menjadi sodara (BUKAN CARI KEUNTUNGAN SENDIRI DAN HARUS SEPAKAT MENGIKUTI SEMUA ATURAN YANG ADA).
Ikrar: "BERJANJI SETIA, MENJAGA NAMA BAIK DAN MENGANGGAP SEMUA ANGGOTA (S2J) SEBAGAI SODARA SENDIRI"
Dan kalopun ada di antara kalian suka sama suka silahkan dan melapor pada ADMIN, kalopun diantara kalian ada masalah kita selesaikan dengan KEKELUARGAAN DAN KEPALA DINGIN. Serta kalopun di antara kalian ingin keluar kasih kita alasan supaya kita sebagai admin bisa berkoreksi, introspeksi diri, MASUK BAIK-BAIK KELUAR PUN HARUS BAIK-BAIK.

3. Pemimpin Sebagai Abdi Keluarga (Bukan Penguasa)
Pemimpin (admin) adalah abdi keluarga bukan PENGUASA, bertugas mengayomi membimbing dan menyatukan semua anggota. Wajib bersikap adil tidak memihak dan bijaksana dalam mengambil keputusan (TIDAK BOLEH PILIH KASIH). Tetua atau pendiri menjadi penasehat dan tempat meminta solusi saat ada masalah, keputusan di ambil lewat musyawarah tapi jika mendesak pemimpin berhak mengambil langkah demi kebaikan bersama. Pemimpin wajib menjadi contoh yg baik dalam tingkah laku dan menjaga nama baik (S2J).

4. Wajib Aktif, Guyub & Peduli Satu Map
Wajib aktif di grup, kabari kalo ada halangan jangan hilang tanpa kabar (KARENA KITA SALING MEMIKIRKAN). Sering kumpul tapi tak sesering itu, ngobrol, atau ikut kegiatan kalo ada yg ngundang atau lagi tidak ada halangan. Kehadiran mu membuat (S2J) makin lengkap dan erat. Kalopun kita gak saling koneksi tapi ada sodara kita satu map jangan egois samperin sapa dan kembali kesemula, kalo bisa ajak dia gabung sama-sama kalo iya emang lagi sendiri.

5. Silih Sayang, Silih Jaga & Silih Bantu
Saling sayang, saling jaga, saling bantu kabeh. Kalo di antara kalian terlibat selisih dengan orang lain/luar, dukung dia dengan cara yg benar dan adil. Cari tau duduk perkaranya dulu jangan langsung ikut marah atau memusuhi dan memprovokasi.

6. Menjaga Sikap & Kehormatan Dimana Saja
Jaga sikap dimana saja, bersikap sopan ramah, dan rendah hati kepada siapapun (becanda boleh asal jangan berlebihan) jangan sampe bikin sakit hati orang lain atau anggota sendiri. (S2J) adalah kehormatan kita jangan lakukan hal yg buruk yg bisa bikin malu atau merusak nama baik.

7. Kemutlakan Kedamaian & Verifikasi Cerita
Di larang memprovokasi menghasut atau mengajak berantem dengan kelompok lain, KITA UTAMAKAN KEDAMAIAN, berani membela jika disakiti. (JANGAN MUDAH PERCAYA ORANG LAIN/LUAR JIKA BERCERITA BURUK TENTANG SODARA TENTANG KITA, CEK KEBENARANNYA DULU KE PIHAK YANG BERSANGKUTAN).

WARNING⚠⚠⚠⚠⚠
JANGAN MENGHINA, MENGUNJING, MENGADU DOMBA, ATAU MENYAKITI HATI SODARA SENDIRI! Selesaikan masalah dengan bicara baik-baik (JANGAN BAWA KELUAR). Kalo bisa bicara dengan bahasa santun, sopan, dan enak di dengar. Hindari kata kasar, makian, atau perkataan yg menyakiti hati.

WASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH`;

    navigator.clipboard.writeText(rulesText)
      .then(() => {
        setCopiedRuleId('ALL');
        setTimeout(() => setCopiedRuleId(null), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy all rules: ', err);
      });
  };

  // Loading sequence simulator
  useEffect(() => {
    let interval = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Sync back stories to localStorage
  useEffect(() => {
    localStorage.setItem('s2j_stories', JSON.stringify(stories));
  }, [stories]);

  // Generate modern dynamic GMT timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        hour12: false,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setTimeStr(now.toLocaleString('id-ID', options) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterApp = () => {
    setHasEntered(true);
    setLoading(false);
  };

  const submitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyName.trim() || !storyMsg.trim()) return;

    const newStory: S2JStory = {
      id: `story-${Date.now()}`,
      sender: storyName.trim(),
      role: 'member',
      origin: storyOrig,
      message: storyMsg.trim(),
      timestamp: 'Baru saja',
      likes: 0,
    };

    setStories([newStory, ...stories]);
    setStoryName('');
    setStoryMsg('');
    setSalamCount((prev) => {
      const updated = prev + 1;
      localStorage.setItem('s2j_salam', updated.toString());
      return updated;
    });
  };

  const handleLikeStory = (id: string) => {
    setStories(prev => prev.map(st => {
      if (st.id === id) {
        return { ...st, likes: st.likes + 1 };
      }
      return st;
    }));
  };

  // Filter members base
  const filteredMembers = membersData.filter(m => {
    const matchesRole = memberRoleFilter === 'all' || m.role === memberRoleFilter;
    const matchesSearch = m.username.toLowerCase().includes(memberSearch.toLowerCase()) || 
                          (m.statusText && m.statusText.toLowerCase().includes(memberSearch.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  // Fast phrase lookups helper
  const handleTranslatePhrase = (indText: string) => {
    if (!indText) {
      setTranslatedText('');
      return;
    }
    // simple word level translation fallback
    const matched = s2jKamus.find(k => k.indonesia.toLowerCase().includes(indText.toLowerCase()));
    if (matched) {
      setTranslatedText(translateTarget === 'sunda' ? matched.sunda : matched.jawa);
    } else {
      setTranslatedText(`(Belum tercatat. Gunakan menu Ruang S2J untuk bertanya ke dulur-dulur!)`);
    }
  };

  // Helper smooth scroll to element ID
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans relative">
      {/* Absolute background batik overlay */}
      <div className="absolute inset-x-0 top-0 h-[300vh] batik-mesh pointer-events-none z-0" />
      
      {/* Top golden gradient glow beam */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[600px] bg-gradient-to-b from-yellow-500/10 via-emerald-500/5 to-transparent filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[1200px] right-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-[2400px] left-10 w-[600px] h-[600px] bg-yellow-600/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      {/* -------------------- LOADING SCREEN -------------------- */}
      <AnimatePresence>
        {loading && (
          <motion.div
            id="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 bg-zinc-950 z-[9999] flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Ambient gold spotlight */}
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-emerald-900/20 via-yellow-600/15 to-transparent rounded-full filter blur-[70px] opacity-80" />
            
            <div className="relative z-10 max-w-lg w-full flex flex-col items-center">
              {/* Logo with sweep animation */}
              <div className="relative mb-8 w-44 h-44 rounded-full bg-zinc-900/80 border-2 border-emerald-500/30 p-2 shadow-[0_0_35px_rgba(16,185,129,0.2)] animate-float">
                <div className="absolute inset-0 bg-radial-glow opacity-30 rounded-full" />
                <img 
                  src="https://hmw1mrn01w5ulmvr.public.blob.vercel-storage.com/1000106697-IP8qcHgKLiofiOOs5MSkc67UNyqTRR.png" 
                  alt="S2J Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full shimmer-sweep"
                />
              </div>

              {/* Title & Greetings in Sunda & Jawa */}
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-serif font-bold tracking-wide text-zinc-100 mb-1"
              >
                Wilujeng Sumping
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-display text-yellow-400 font-semibold tracking-widest uppercase mb-4"
              >
                Sugeng Rawuh ing S2J
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.7 }}
                className="text-zinc-400 text-sm max-w-sm font-sans mb-8 leading-relaxed"
              >
                Mempersatukan saudara Sunda & Jawa dalam kebersamaan dinten asih, solidaritas rukun selawase.
              </motion.p>

              {/* Progress bar and button selector */}
              <div className="w-64">
                {loadingPercent < 100 ? (
                  <div className="space-y-2">
                    <div className="h-[3px] w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-400 transition-all duration-150"
                        style={{ width: `${loadingPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                      <span>Mempersiapkan Gamelan & Degung...</span>
                      <span>{Math.min(loadingPercent, 100)}%</span>
                    </div>
                  </div>
                ) : (
                  <motion.button
                    id="enter-s2j-btn"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnterApp}
                    className="w-full bg-gradient-to-r from-emerald-600 to-yellow-500 text-zinc-950 font-display font-medium text-xs tracking-widest uppercase py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Masuk Ruang S2J
                    <ChevronRight className="w-4 h-4 text-zinc-900" />
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Elegant Loading Footer */}
            <div className="absolute bottom-6 text-[10px] text-zinc-600 font-mono">
              S2J • SEDULURAN SUNDA JAWA ELITE PLATFORM
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- FLOATING NAVBAR -------------------- */}
      <header className="sticky top-0 z-[50] w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand left */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToId('home')}>
            <div className="w-10 h-10 rounded-full border border-emerald-500/40 p-0.5 bg-zinc-900/90 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <img 
                src="https://hmw1mrn01w5ulmvr.public.blob.vercel-storage.com/1000106697-IP8qcHgKLiofiOOs5MSkc67UNyqTRR.png" 
                alt="S2J Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-zinc-100 to-yellow-400">
                S2J
              </span>
              <span className="block text-[8px] text-zinc-500 tracking-widest font-mono uppercase">Seduluran Sunda Jawa</span>
            </div>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'Tentang S2J' },
              { id: 'members', label: 'Member' },
              { id: 'assembly', label: 'Ruang S2J' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'rules', label: 'Rules' }
            ].map((link) => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => scrollToId(link.id)}
                className={`text-xs font-display uppercase tracking-widest font-semibold transition-all duration-300 relative py-2 ${
                  activeSection === link.id ? 'text-yellow-400' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span 
                    layoutId="activeSubline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-yellow-400 rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Sound toggle launcher and UTILITY info on right */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-zinc-400 font-mono tracking-wider flex items-center gap-1.5 justify-end">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ONLINE: {membersData.filter(m => m.status === 'online').length} Dulur</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-mono block">{timeStr}</span>
            </div>
            
            <button
              id="scroll-to-space-btn"
              onClick={() => scrollToId('assembly')}
              className="px-4 py-2 bg-zinc-900 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-5050/10 hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              Gabung Obrolan
            </button>
          </div>

          {/* Hamburger Menu Mobile */}
          <div className="md:hidden">
            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-zinc-200 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-zinc-950 border-b border-zinc-900 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'Tentang S2J' },
                  { id: 'members', label: 'Member S2J' },
                  { id: 'assembly', label: 'Ruang S2J' },
                  { id: 'gallery', label: 'Gallery' },
                  { id: 'rules', label: 'Aturan Kita' }
                ].map((link) => (
                  <button
                    key={link.id}
                    id={`mobile-nav-${link.id}`}
                    onClick={() => scrollToId(link.id)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold tracking-wider text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                
                <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500 px-3">
                    <span className="font-mono">Online: {membersData.filter(m => m.status === 'online').length} Dulur</span>
                    <span className="font-mono text-[9px]">{timeStr}</span>
                  </div>
                  
                  <button
                    onClick={() => scrollToId('assembly')}
                    className="w-full py-2 bg-emerald-600 text-zinc-950 font-bold text-xs text-center rounded-xl"
                  >
                    Masuk Ruang S2J
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* -------------------- MAIN APP BODY -------------------- */}
      <main className="flex-grow z-10 relative">

        {/* ==================== HERO SECTION ==================== */}
        <section id="home" className="relative min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center py-20 px-4 overflow-hidden">
          
          {/* Glowing particle lights behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70vw] max-h-[500px] bg-gradient-to-tr from-emerald-500/5 via-yellow-500/5 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Kujang Traditional Weapon (Sunda) */}
            <div className="hidden lg:block lg:col-span-3 text-center transition-all duration-700 hover:scale-105">
              <KujangSVG className="w-full max-h-[380px] animate-float drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]" />
              <div className="mt-4">
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider">SENJATA TRADISIONAL SUNDA</span>
                <h4 className="text-sm font-display font-bold text-zinc-100">Kujang Pajajaran</h4>
                <p className="text-[11px] text-zinc-400 italic mt-1">Silih asih, silih asah, silih asuh.</p>
              </div>
            </div>

            {/* Center Column: S2J Brand Information */}
            <div className="lg:col-span-6 flex flex-col items-center text-center px-4">
              
              {/* Premium cultural ribbon */}
              <div className="mb-6 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 shadow-inner flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-[10px] font-display font-semibold tracking-widest text-emerald-400 uppercase">
                  DULUR SASARENGAN • SEDULURAN SELAWASE
                </span>
              </div>

              {/* Central Logo */}
              <div className="relative mb-8 w-40 h-40 rounded-full border-2 border-yellow-500/20 p-2 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 shadow-[0_0_40px_rgba(234,179,8,0.15)] group">
                {/* Outer spin circle */}
                <div className="absolute -inset-2 border border-dashed border-yellow-500/30 rounded-full group-hover:rotate-45 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-radial-glow opacity-25 rounded-full" />
                <img 
                  src="https://hmw1mrn01w5ulmvr.public.blob.vercel-storage.com/1000106697-IP8qcHgKLiofiOOs5MSkc67UNyqTRR.png" 
                  alt="S2J Badge Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full transition-all duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title texts */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-300">
                SEDULURAN
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-200 to-yellow-500 mt-1">
                SUNDA JAWA
              </h2>

              <p className="text-zinc-400 font-display text-sm tracking-widest font-semibold uppercase mt-4 text-emerald-400 flex items-center gap-1.5">
                <span>Solid</span>
                <span className="text-zinc-600">•</span>
                <span>Santun</span>
                <span className="text-zinc-600">•</span>
                <span>Saling Menjaga</span>
              </p>

              <p className="text-zinc-400 text-xs sm:text-sm mt-6 mb-8 leading-relaxed max-w-lg">
                S2J adalah keluarga digital modern yang mempersatukan saudara Sunda dan Jawa dalam kebersamaan, solidaritas, rukun damai, dan rasa saling menghormati setinggi langit Nusantara.
              </p>

              {/* Grid actions buttons strictly based on request */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 w-full justify-center max-w-md">
                <button
                  id="hero-masuk-btn"
                  onClick={() => scrollToId('assembly')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-yellow-500 hover:from-emerald-500 hover:to-yellow-400 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                >
                  Masuk S2J
                </button>
                <button
                  id="hero-member-btn"
                  onClick={() => scrollToId('members')}
                  className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 font-semibold text-xs tracking-wider uppercase transition-all duration-300"
                >
                  Lihat Member
                </button>
                <button
                  id="hero-gallery-btn"
                  onClick={() => scrollToId('gallery')}
                  className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 font-semibold text-xs tracking-wider uppercase transition-all duration-300"
                >
                  Gallery S2J
                </button>
                <button
                  id="hero-about-btn"
                  onClick={() => scrollToId('about')}
                  className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 font-semibold text-xs tracking-wider uppercase transition-all duration-300"
                >
                  Tentang S2J
                </button>
              </div>

              {/* Counter status indicator bottom Hero */}
              <div className="mt-12 flex items-center gap-6 px-5 py-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm max-w-sm">
                <div className="text-center">
                  <span className="block text-xl font-bold font-display text-emerald-400 font-sans">{membersData.length}</span>
                  <span className="text-[9px] text-zinc-500 tracking-wider">ANGGOTA ELITE</span>
                </div>
                <div className="w-[1px] h-8 bg-zinc-800" />
                <div className="text-center">
                  <span className="block text-xl font-bold font-display text-yellow-400 font-sans">{salamCount}</span>
                  <span className="text-[9px] text-zinc-500 tracking-wider">SALAM HANGAT</span>
                </div>
                <div className="w-[1px] h-8 bg-zinc-800" />
                <div className="text-center">
                  <span className="block text-xl font-bold font-display text-zinc-100 font-sans">2</span>
                  <span className="text-[9px] text-zinc-500 tracking-wider">BUDAYA BESAR</span>
                </div>
              </div>

            </div>

            {/* Right Column: Keris Traditional Weapon (Jawa) */}
            <div className="hidden lg:block lg:col-span-3 text-center transition-all duration-700 hover:scale-105">
              <KerisSVG className="w-full max-h-[380px] animate-float-delayed drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]" />
              <div className="mt-4">
                <span className="text-[10px] font-mono text-yellow-500 tracking-wider">SENJATA TRADISIONAL JAWA</span>
                <h4 className="text-sm font-display font-bold text-zinc-100">Keris Luk Songo</h4>
                <p className="text-[11px] text-zinc-400 italic mt-1">Rukun agawe santosa, rukun selawase.</p>
              </div>
            </div>

          </div>

          {/* Sparkly traditional floating particles container (Decorative) */}
          <div className="absolute inset-x-0 bottom-0 top-1/2 pointer-events-none overflow-hidden">
            <div className="absolute bottom-20 left-10 w-2 h-2 rounded-full bg-emerald-500/20 animate-bounce" />
            <div className="absolute bottom-32 right-1/4 w-3 h-3 rounded-full bg-yellow-500/10 animate-pulse" />
            <div className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-emerald-400/20 animate-bounce" style={{ animationDelay: '1.5s' }} />
          </div>

        </section>

        {/* ==================== TENTANG S2J SECTION ==================== */}
        <section id="about" className="py-24 px-4 border-t border-zinc-900/80 bg-zinc-950/40 relative">
          
          <div className="max-w-7xl mx-auto">
            
            {/* Elegant section title header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">FILOSOFI LUHUR KELUARGA KITA</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-wide mt-2">
                Tentang S2J
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500 mx-auto mt-4" />
              <p className="text-zinc-400 text-sm mt-6 leading-relaxed">
                S2J (Seduluran Sunda Jawa) adalah wadah persaudaraan digital modern yang dibangun atas dasar solidaritas kuat, sopan santun, keteguhan hati, dan saling menghormati tanpa memandang sekat daerah.
              </p>
            </div>

            {/* Content box showcasing handshake vector icon and cross layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Philosophical badges list */}
              <div className="col-span-1 lg:col-span-4 space-y-6">
                
                {/* Sunda pillar badge */}
                <div className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wider block uppercase mb-1">Filosofi Sunda</span>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">Dulur Sasarengan</h3>
                  <p className="text-[12px] text-emerald-400 font-display font-medium select-all">“Someah Ka Sadayana”</p>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Sikap ramah tamah, sopan santun, tersenyum tulus menyambut siapapun sebagai saudara kandung (Dulur).
                  </p>
                </div>

                {/* Sunda mutual love badge */}
                <div className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-400 font-mono tracking-wider block uppercase mb-1">Pilar Luhur</span>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">Silih Rangkul</h3>
                  <p className="text-[12px] text-emerald-400 font-display font-normal">“Silih asih, asah, tur asuh”</p>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Saling mengasihi dengan tulus, saling mendewasakan kecerdasan, dan saling membimbing dalam kebajikan.
                  </p>
                </div>

              </div>

              {/* Center Column: Crossed illustrations */}
              <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-center p-4">
                <CrossedKujangKeris className="mx-auto" />
                <div className="mt-8 text-center">
                  <h4 className="text-sm font-display font-bold text-zinc-100 uppercase tracking-widest text-yellow-400">PERSATUAN SEJATI</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 max-w-[280px] mx-auto">
                    Kujang Siliwangi bersanding erat dengan Keris Mataram demi menjaga persatuan bangsa Indonesia yang harmoni.
                  </p>
                </div>
              </div>

              {/* Right Column: Javanese pillars and values */}
              <div className="col-span-1 lg:col-span-4 space-y-6">
                
                {/* Jawa pillar badge */}
                <div className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500" />
                  <span className="text-[10px] text-yellow-400 font-mono tracking-wider block uppercase mb-1">Filosofi Jawa</span>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">Seduluran Selawase</h3>
                  <p className="text-[12px] text-yellow-500 font-display font-medium select-all">“Rukun Agawe Santosa”</p>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Kerukunan dan semangat bersatu membawa kekuatan lahir batin yang kokoh selamanya tak lekang oleh zaman.
                  </p>
                </div>

                {/* Jawa behavior badge */}
                <div className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-yellow-500" />
                  <span className="text-[10px] text-yellow-400 font-mono tracking-wider block uppercase mb-1">Pilar Luhur</span>
                  <h3 className="text-xl font-serif font-bold text-zinc-100">Tepo Sliro</h3>
                  <p className="text-[12px] text-yellow-500 font-display font-normal">“Andhap Ashor lan Prasojo”</p>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Menjaga perasaan orang lain, bersikap rendah hati, sederhana, dan menjunjung tinggi kehormatan sesama.
                  </p>
                </div>

              </div>

            </div>

            {/* Shared Quote Banner */}
            <div className="mt-16 bg-gradient-to-r from-emerald-950/30 via-zinc-900/80 to-yellow-950/20 border border-zinc-800 rounded-3xl p-8 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />
              <div className="relative z-10">
                <HeartHandshake className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                <p className="text-lg sm:text-xl font-serif italic text-zinc-200 leading-relaxed">
                  “Cai jeung tanah urang, rukun ayem lan tentrem neng batin... Sunda jeung Jawa teh dulur kandung sajati.”
                </p>
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mt-4">
                  S2J DEKLARASI PERSAUDARAAN DIGITAL MODERN
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== MEMBER SECTION ==================== */}
        <section id="members" className="py-24 px-4 border-t border-zinc-900/80 relative">
          
          <div className="max-w-7xl mx-auto">
            
            {/* Header section title */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">DAFTAR KELUARGA BESAR S2J</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-wide mt-2">
                Member Showcase
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-yellow-500 via-emerald-400 to-yellow-500 mx-auto mt-4" />
              <p className="text-zinc-400 text-sm mt-6">
                Berikut adalah saudara-saudara kita yang menjaga kehormatan dan keutuhan perkumpulan S2J tercinta. Cari dulurmu di sini!
              </p>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl mb-12 backdrop-blur-sm">
              
              {/* Role filter buttons */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {(['all', 'owner', 'admin', 'member'] as const).map((rl) => (
                  <button
                    key={rl}
                    id={`filter-role-${rl}`}
                    onClick={() => setMemberRoleFilter(rl)}
                    className={`text-xs px-4 py-2 rounded-xl font-display font-semibold uppercase tracking-wider transition-all duration-200 ${
                      memberRoleFilter === rl 
                        ? 'bg-emerald-600 text-zinc-950 shadow-md' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {rl === 'all' ? 'Tampilkan Semua' : rl}
                  </button>
                ))}
              </div>

              {/* Live search input */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Cari nama member..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all duration-200 font-sans"
                />
              </div>

            </div>

            {/* Member Grids Layout */}
            
            {/* 1. OWNER CARD (Always big, centered if matches filters) */}
            {memberRoleFilter !== 'admin' && memberRoleFilter !== 'member' && (
              <div className="flex justify-center mb-12">
                {filteredMembers.filter(m => m.role === 'owner').map((owner) => (
                  <motion.div
                    key={owner.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-md w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-red-500/40 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_35px_rgba(239,68,68,0.15)] group"
                  >
                    {/* Glowing backgrounds */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full filter blur-xl" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                      
                      {/* Owner Badge */}
                      <span className="px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-500 font-sans text-[10px] font-extrabold tracking-widest uppercase mb-4 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-spin" />
                        OWNER S2J
                      </span>

                      {/* Large Avatar */}
                      <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-r from-red-500 to-orange-500 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#13151A] border border-red-500/50 flex items-center justify-center">
                          <span className="text-[10px]">👑</span>
                        </div>
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${owner.avatarSeed}`} 
                          alt={owner.username}
                          className="w-full h-full object-contain rounded-full bg-zinc-950"
                        />
                      </div>

                      {/* Username */}
                      <h3 className="text-2xl font-serif font-black tracking-wide text-zinc-100 flex items-center gap-2 justify-center">
                        {owner.username}
                      </h3>

                      {/* Profile details */}
                      <p className="text-zinc-500 text-[11px] font-mono tracking-widest uppercase mt-1">
                        ASAL: <span className="text-emerald-400">{owner.origin}</span> | GABUNG: <span className="text-yellow-400">{owner.joinedDate}</span>
                      </p>

                      {/* Custom subtext */}
                      {owner.statusText && (
                        <p className="text-sm italic text-zinc-300 mt-4 px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl w-full">
                          “{owner.statusText}”
                        </p>
                      )}

                      {/* Active audio link decoration */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{owner.status}</span>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 2. ADMIN LIST GRID */}
            {memberRoleFilter !== 'owner' && memberRoleFilter !== 'member' && (
              <div className="mb-12">
                <h3 className="text-xs font-mono font-bold text-center text-purple-400 uppercase tracking-widest mb-6">ADMINISTRATOR KELUARGA</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredMembers.filter(m => m.role === 'admin').map((adm) => (
                    <motion.div
                      key={adm.id}
                      whileHover={{ y: -6 }}
                      className="bg-zinc-900/60 hover:bg-zinc-900 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.05)] group"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full filter blur-xl" />
                      
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md">
                          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#13151A] border border-purple-400 flex items-center justify-center">
                            <span className="text-[9px]">{adm.customIcon || '✨'}</span>
                          </div>
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${adm.avatarSeed}`} 
                            alt={adm.username}
                            className="w-full h-full object-contain rounded-full bg-zinc-950"
                          />
                        </div>

                        {/* Title details */}
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-400 font-mono text-[9px] font-bold uppercase block w-max mb-1">
                            ADMIN S2J
                          </span>
                          <h4 className="text-base font-serif font-extrabold text-zinc-100 flex items-center gap-1.5">
                            {adm.username}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
                            ASAL: {adm.origin}
                          </span>
                        </div>
                      </div>

                      {adm.statusText && (
                        <p className="text-[11px] text-zinc-300 italic mt-4 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-850">
                          “{adm.statusText}”
                        </p>
                      )}

                      {/* Online status footer */}
                      <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-800/80 pt-3">
                        <span>Joined: {adm.joinedDate}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${adm.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                          <span className="uppercase">{adm.status}</span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. MEMBERS LIST GRID */}
            {memberRoleFilter !== 'owner' && memberRoleFilter !== 'admin' && (
              <div>
                <h3 className="text-xs font-mono font-bold text-center text-emerald-400 uppercase tracking-widest mb-6">ELITE MEMBERS OF S2J</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMembers.filter(m => m.role === 'member').map((mem) => (
                    <motion.div
                      key={mem.id}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-zinc-950 border border-zinc-900 hover:border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 shadow-md group"
                    >
                      {/* Left color glow based on category */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full filter blur-xl" />

                      <div className="flex flex-col items-center text-center">
                        
                        {/* Avatar */}
                        <div className="relative w-14 h-14 rounded-full p-0.5 bg-zinc-800 group-hover:bg-emerald-500/40 mb-3 transition-colors">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${mem.avatarSeed}`} 
                            alt={mem.username}
                            className="w-full h-full object-contain rounded-full bg-zinc-950"
                          />
                        </div>

                        {/* Name */}
                        <h4 className="text-xs font-display font-semibold text-zinc-100 tracking-wider hover:text-emerald-400 transition-colors">
                          {mem.username}
                        </h4>

                        {/* Orig info */}
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 text-emerald-400 border border-zinc-800 uppercase block font-mono tracking-widest mt-1 mb-3">
                          {mem.origin}
                        </span>

                        {mem.statusText && (
                          <p className="text-[10px] text-zinc-400 italic bg-zinc-900/60 p-2 rounded-lg w-full line-clamp-2 h-10 flex items-center justify-center">
                            “{mem.statusText}”
                          </p>
                        )}
                        
                        {/* Status bar */}
                        <div className="mt-4 w-full flex items-center justify-between text-[9px] text-zinc-500 font-mono border-t border-zinc-900 pt-3">
                          <span>Joined {mem.joinedDate.split(' ')[0]}</span>
                          <div className="flex items-center gap-1 justify-end">
                            <span className={`w-1 h-1 rounded-full ${mem.status === 'online' ? 'bg-emerald-400' : mem.status === 'idle' ? 'bg-amber-400' : 'bg-zinc-650'}`} />
                            <span className="uppercase">{mem.status}</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Zero state matches */}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">Tidak ada member S2J dengan nama atau kriteria tersebut.</p>
                <button 
                  onClick={() => { setMemberSearch(''); setMemberRoleFilter('all'); }}
                  className="mt-3 text-xs text-emerald-400 underline hover:text-emerald-300"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

          </div>

        </section>

        {/* ==================== RUANG BERKUMPUL S2J SECTION ==================== */}
        <section id="assembly" className="py-24 px-4 border-t border-zinc-900 bg-zinc-950/30 relative">
          
          <div className="max-w-7xl mx-auto">
            
            {/* Title section info */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">INTERACTIVE VIRTUAL ASSEMBLY</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-wide mt-2">
                Ruang S2J
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500 mx-auto mt-4" />
              <p className="text-zinc-400 text-sm mt-6">
                Ini adalah ruang kumpul digital keduabelas kebudayaan nasional. Anda dapat bersinergi, menyapa dulur, belajar bahasa Sunda-Jawa, serta mendengarkan backsound gamelan tradisi.
              </p>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Grid width 5): AudioEngine + Kamus Kasaduluran */}
              <div className="col-span-1 lg:col-span-5 space-y-6">
                
                {/* 1. Synths live stream audio controller */}
                <AudioEngine />

                {/* 2. S2J Interactive Kamus Buddy */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full filter blur-xl" />
                  
                  <div className="flex items-center gap-2.5 mb-4">
                    <Languages className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100 font-sans">Kamus Kasaduluran</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">Belajar Bahasa Sunda & Jawa Halus</p>
                    </div>
                  </div>

                  {/* Top Word grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {s2jKamus.slice(0, 6).map((k, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWord(k)}
                        className={`p-2.5 text-left rounded-xl border text-[11px] font-sans transition-all duration-200 ${
                          selectedWord?.indonesia === k.indonesia
                            ? 'bg-emerald-900/20 border-emerald-500/40 text-emerald-300 shadow-sm font-bold'
                            : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <span className="block truncate">{k.indonesia}</span>
                      </button>
                    ))}
                  </div>

                  {/* Word inspector card detail */}
                  {selectedWord && (
                    <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/80 mb-4">
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                        <MapPin className="w-2.5 h-2.5 text-yellow-400" />
                        <span>Makna: {selectedWord.indonesia}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {/* Sunda phrase representation */}
                        <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-lg p-3">
                          <span className="text-[8px] text-emerald-400 font-mono tracking-widest block uppercase">Basa Sunda Halus</span>
                          <span className="text-sm font-semibold font-sans text-zinc-100 mt-1 block select-all">
                            {selectedWord.sunda}
                          </span>
                        </div>

                        {/* Jawa phrase representation */}
                        <div className="bg-yellow-950/10 border border-yellow-500/10 rounded-lg p-3">
                          <span className="text-[8px] text-yellow-400 font-mono tracking-widest block uppercase">Basa Jawa Halus</span>
                          <span className="text-sm font-semibold font-sans text-zinc-100 mt-1 block select-all">
                            {selectedWord.jawa}
                          </span>
                        </div>
                      </div>

                      {/* Phrase Context */}
                      <div className="mt-3 text-[10px] text-zinc-400 leading-relaxed font-sans flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{selectedWord.context}</span>
                      </div>
                    </div>
                  )}

                  {/* Micro custom translation helper utility */}
                  <div className="space-y-2 border-t border-zinc-800 pt-4">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase">Pencarian kilat kata:</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ketik kata (misal: 'Terima Kasih')"
                        onChange={(e) => handleTranslatePhrase(e.target.value)}
                        className="flex-grow bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-[11px] text-zinc-200 focus:outline-none"
                      />
                      
                      <button
                        onClick={() => setTranslateTarget(prev => prev === 'sunda' ? 'jawa' : 'sunda')}
                        className="px-2.5 py-1.5 bg-zinc-800 text-[10px] rounded-lg text-yellow-400 font-bold border border-zinc-700"
                      >
                        Target: {translateTarget === 'sunda' ? 'Sunda' : 'Jawa'}
                      </button>
                    </div>
                    {translatedText && (
                      <p className="text-[11px] text-yellow-400 font-sans pl-1">
                        👉 Terjemahan: <strong className="text-zinc-100 select-all">{translatedText}</strong>
                      </p>
                    )}
                  </div>

                </div>

              </div>

              {/* Right Column (Grid width 7): Greeting Live Wall Board + Active voice indicators */}
              <div className="col-span-1 lg:col-span-7 space-y-6">
                
                {/* Digital Obrolan Santai - Gathering Board */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-1.5 h-12 bg-gradient-to-b from-emerald-500 to-yellow-500 rounded-r-lg" />
                  
                  <div className="flex items-center justify-between mb-6 border-b border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="text-md font-bold text-zinc-100 font-sans tracking-tight">Kasaduluran Vibe Hub</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">Papan Salam Hangat & Cerita S2J</p>
                      </div>
                    </div>

                    {/* Filter story board */}
                    <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-[9px] font-mono leading-none">
                      {(['all', 'Sunda', 'Jawa', 'Nusantara'] as const).map((orig) => (
                        <button
                          key={orig}
                          onClick={() => setStoryFilter(orig)}
                          className={`px-2 py-1 rounded-md capitalize transition-all ${
                            storyFilter === orig 
                              ? 'bg-emerald-950/50 text-emerald-400 shadow font-bold border border-emerald-500/20' 
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {orig}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* New story submit form */}
                  <form onSubmit={submitStory} className="bg-zinc-950/60 border border-zinc-850/80 p-4 rounded-xl mb-6">
                    <span className="text-[10px] font-mono text-zinc-500 block uppercase mb-2">TINGGALKAN SALAM KE KELUARGA</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Nama/Username kita..."
                        value={storyName}
                        onChange={(e) => setStoryName(e.target.value)}
                        required
                        className="bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-[11px] text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                      />

                      {/* Origin selector */}
                      <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-850 text-[10px]">
                        {(['Sunda', 'Jawa', 'Nusantara'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setStoryOrig(r)}
                            className={`flex-grow py-1 rounded-md font-sans text-center transition-all ${
                              storyOrig === r 
                                ? 'bg-zinc-950 text-yellow-400 shadow font-bold' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={2}
                        placeholder="Tulis pesan persaudaraan, rukun santun atau sapaan hangat..."
                        value={storyMsg}
                        onChange={(e) => setStoryMsg(e.target.value)}
                        required
                        maxLength={220}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-3 text-[11px] text-zinc-100 focus:outline-none focus:border-emerald-500/50 resize-none pb-8"
                      />
                      <span className="absolute bottom-2 left-3 text-[9px] text-zinc-500 font-mono">
                        Sopan santun adalah tameng kehormatan kita.
                      </span>
                      <button
                        type="submit"
                        id="submit-story-btn"
                        className="absolute bottom-1.5 right-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3 text-zinc-950" />
                        Bagikan
                      </button>
                    </div>
                  </form>

                  {/* Stories list rendering */}
                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                    {stories
                      .filter(s => storyFilter === 'all' || s.origin === storyFilter)
                      .map((st) => (
                        <div 
                          key={st.id} 
                          className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between transition-all hover:border-zinc-800"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {/* Small mini visual badge to replace avatar paths */}
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                                st.origin === 'Sunda' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20' :
                                st.origin === 'Jawa' ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/20' :
                                'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              }`}>
                                {st.sender.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-display font-bold text-[11px] text-zinc-100 tracking-wide block">
                                  {st.sender}
                                </span>
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">
                                  REGIONAL: {st.origin}
                                </span>
                              </div>
                            </div>

                            {/* Timestamp indicator */}
                            <span className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {st.timestamp}
                            </span>
                          </div>

                          <p className="text-zinc-300 text-xs leading-relaxed font-sans mt-3 whitespace-pre-wrap pl-1">
                            {st.message}
                          </p>

                          {/* Action footer likes */}
                          <div className="mt-3 pt-3 border-t border-zinc-900/60 flex items-center justify-between">
                            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest pl-1">S2J INDEPENDENT PLATFORM</span>
                            
                            <button
                              onClick={() => handleLikeStory(st.id)}
                              className="text-zinc-400 hover:text-red-400 hover:bg-zinc-900 py-1 px-2.5 rounded-lg text-[10px] font-sans flex items-center gap-1.5 transition-all"
                            >
                              <Heart className="w-3.5 h-3.5 text-zinc-500 fill-zinc-600 hover:text-red-500 hover:fill-red-500" />
                              Silih Dukung ({st.likes})
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                </div>

                {/* Simulated active voice list digital dashboard */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Kamar Voice S2J (Mendengarkan Musik)</span>
                    <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Sore Damai
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {s2jVoices.map((voice) => (
                      <div key={voice.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <h5 className="text-[11px] font-sans font-bold text-zinc-200 truncate">{voice.name}</h5>
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-[10px] text-zinc-500 font-mono">Aktif:</span>
                          <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded font-mono">
                            {voice.activeUsers.length} Dulur
                          </span>
                        </div>
                        
                        {/* Users faces mock */}
                        <div className="mt-2.5 flex -space-x-2 overflow-hidden">
                          {voice.activeUsers.map((user, i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-950 flex items-center justify-center text-[9px] text-zinc-300 font-bold" title={user}>
                              {user.slice(3, 5).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ==================== GALLERY INTERACTIVE SECTION ==================== */}
        <section id="gallery" className="py-24 px-4 border-t border-zinc-900 bg-zinc-950/40 relative">
          
          <div className="max-w-7xl mx-auto">
            
            {/* Gallery title header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase">HASIL KARYA KELUARGA S2J</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-wide mt-2">
                Gallery Keindahan
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-emerald-500 via-yellow-400 to-emerald-500 mx-auto mt-4" />
              <p className="text-zinc-400 text-sm mt-6">
                Representasi artistik modern kebudayaan serta alam Sunda dan Jawa yang rukun, damai, dan asri. Klik gambar untuk melihat makna luhurnya.
              </p>
            </div>

            {/* Masonry image layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:border-yellow-500/30 hover:shadow-2xl relative"
                >
                  {/* Photo area */}
                  <div className="relative h-64 overflow-hidden bg-zinc-950">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/90 z-10" />
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 z-20 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-900/90 text-yellow-400 border border-yellow-500/20 font-mono">
                      {item.category}
                    </span>
                  </div>

                  {/* Body textual area info */}
                  <div className="p-6 relative z-20">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-zinc-100 group-hover:text-yellow-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mt-2 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-zinc-8050 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Bumi Nusantara</span>
                      <span className="text-yellow-400 hover:underline flex items-center gap-1">
                        Lihat filosofi <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </section>

        {/* ==================== RULES SECTION ==================== */}
        <section id="rules" className="py-24 px-4 border-t border-zinc-900/80 bg-zinc-950 relative">
          
          <div className="max-w-7xl mx-auto">
            
            {/* Titles info wrapper */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-yellow-400 tracking-widest uppercase">ATURAN FAMS (S2J) • SEDULURAN SUNDA JAWA</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-wide mt-2">
                Piagam Kehormatan S2J
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-yellow-500 via-emerald-400 to-yellow-500 mx-auto mt-4" />
              <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mt-6">
                ASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH
              </p>
              <p className="text-zinc-300 text-sm font-medium italic mt-2 font-sans">
                "Sodara di atas segalanya, rumah kedua buat kita semua"
              </p>

              {/* Master Copy Feature */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={copyAllRulesToClipboard}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all flex items-center gap-2 border border-yellow-400/30"
                >
                  {copiedRuleId === 'ALL' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                      <span>Satu Buku Aturan Tersalin! 🤝🏼</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-yellow-200" />
                      <span>Salin Semua Aturan Fams S2J</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Premium scroll layout with golden border ornaments */}
            <div className="max-w-4xl mx-auto bg-zinc-900/80 border-2 border-yellow-500/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              
              {/* Corner decorative borders represent traditional gold ornament */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400" />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gold-glow pointer-events-none opacity-40" />

              <div className="relative z-10 space-y-8">
                
                {/* Rule Item 1 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      01
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Sodara Tanpa Kasta (Semua Anggota Setara)
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Semua anggota yang udah masuk <strong className="text-emerald-400 font-semibold">(S2J)</strong> di anggap sodara tua, muda, baru, lama, sama aja harganya tidak ada yg membedakan status atau jabatan.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '01',
                      'Sodara Tanpa Kasta (Semua Anggota Setara)',
                      'Semua anggota yang udah masuk (S2J) di anggap sodara tua, muda, baru, lama, sama aja harganya tidak ada yg membedakan status atau jabatan.'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 1"
                  >
                    {copiedRuleId === '01' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 2 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      02
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Sambutan Hangat, Ikrar & Komitmen Bersama
                      </h4>
                      <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2">
                        <p>
                          Anggota baru wajib di sambut dengan hangat, wajib memperkenalkan diri ke anggota yg lama, jangan malu-malu dan jangan sungkan. Siapapun boleh mendaftar, asalkan punya niat tulus ingin menjadi sodara <span className="text-yellow-400 font-bold">(BUKAN CARI KEUNTUNGAN SENDIRI DAN HARUS SEPAKAT MENGIKUTI SEMUA ATURAN YANG ADA)</span>.
                        </p>
                        <p className="text-zinc-200 bg-zinc-900/90 border border-yellow-500/10 p-3 rounded-xl italic">
                          "BERJANJI SETIA, MENJAGA NAMA BAIK DAN MENGANGGAP SEMUA ANGGOTA (S2J) SEBAGAI SODARA SENDIRI"
                        </p>
                        <p>
                          Dan kalopun ada di antara kalian suka sama suka silahkan dan melapor pada <strong className="text-emerald-400">ADMIN</strong>, kalopun diantara kalian ada masalah kita selesaikan dengan <strong className="text-emerald-400">KEKELUARGAAN DAN KEPALA DINGIN</strong>. Serta kalopun di antara kalian ingin keluar kasih kita alasan supaya kita sebagai admin bisa berkoreksi, introspeksi diri, <strong className="text-yellow-400">MASUK BAIK-BAIK KELUAR PUN HARUS BAIK-BAIK</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '02',
                      'Sambutan Hangat, Ikrar & Komitmen Bersama',
                      'Anggota baru wajib di sambut dengan hangat, wajib memperkenalkan diri ke anggota yg lama, jangan malu-malu dan jangan sungkan. Siapapun boleh mendaftar, asalkan punya niat tulus ingin menjadi sodara (BUKAN CARI KEUNTUNGAN SENDIRI DAN HARUS SEPAKAT MENGIKUTI SEMUA ATURAN YANG ADA). Ikrar: "BERJANJI SETIA, MENJAGA NAMA BAIK DAN MENGANGGAP SEMUA ANGGOTA (S2J) SEBAGAI SODARA SENDIRI", suka sama suka silahkan melapor ADMIN, masalah selesaikan dengan KEKELUARGAAN DAN KEPALA DINGIN, MASUK BAIK-BAIK KELUAR PUN HARUS BAIK-BAIK.'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 2"
                  >
                    {copiedRuleId === '02' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 3 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      03
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Pemimpin Sebagai Abdi Keluarga (Bukan Penguasa)
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Pemimpin (admin) adalah abdi keluarga bukan PENGUASA, bertugas mengayomi membimbing dan menyatukan semua anggota. Wajib bersikap adil tidak memihak dan bijaksana dalam mengambil keputusan <span className="text-yellow-400 font-bold">(TIDAK BOLEH PILIH KASIH)</span>. Tetua atau pendiri menjadi penasehat dan tempat meminta solusi saat ada masalah, keputusan di ambil lewat musyawarah tapi jika mendesak pemimpin berhak mengambil langkah demi kebaikan bersama. Pemimpin wajib menjadi contoh yg baik dalam tingkah laku dan menjaga nama baik <strong className="text-emerald-400">(S2J)</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '03',
                      'Pemimpin Sebagai Abdi Keluarga (Bukan Penguasa)',
                      'Pemimpin (admin) adalah abdi keluarga bukan PENGUASA, bertugas mengayomi membimbing dan menyatukan semua anggota. Wajib bersikap adil tidak memihak dan bijaksana dalam mengambil keputusan (TIDAK BOLEH PILIH KASIH). Tetua atau pendiri menjadi penasehat dan tempat meminta solusi saat ada masalah, keputusan di ambil lewat musyawarah tapi jika mendesak pemimpin berhak mengambil langkah demi kebaikan bersama. Pemimpin wajib menjadi contoh yg baik dalam tingkah laku dan menjaga nama baik (S2J).'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 3"
                  >
                    {copiedRuleId === '03' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 4 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      04
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Wajib Aktif, Guyub & Peduli Satu Map
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Wajib aktif di grup, kabari kalo ada halangan jangan hilang tanpa kabar <span className="text-emerald-400 font-semibold">(KARENA KITA SALING MEMIKIRKAN)</span>. Sering kumpul tapi tak sesering itu, ngobrol, atau ikut kegiatan kalo ada yg ngundang atau lagi tidak ada halangan. Kehadiran mu membuat <strong className="text-yellow-400">(S2J)</strong> makin lengkap dan erat. Kalopun kita gak saling koneksi tapi ada sodara kita satu map jangan egois samperin sapa dan kembali kesemula, kalo bisa ajak dia gabung sama-sama kalo iya emang lagi sendiri.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '04',
                      'Wajib Aktif, Guyub & Peduli Satu Map',
                      'Wajib aktif di grup, kabari kalo ada halangan jangan hilang tanpa kabar (KARENA KITA SALING MEMIKIRKAN). Sering kumpul tapi tak sesering itu, ngobrol, atau ikut kegiatan kalo ada yg ngundang atau lagi tidak ada halangan. Kehadiran mu membuat (S2J) makin lengkap dan erat. Kalopun kita gak saling koneksi tapi ada sodara kita satu map jangan egois samperin sapa dan kembali kesemula, kalo bisa ajak dia gabung sama-sama kalo iya emang lagi sendiri.'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 4"
                  >
                    {copiedRuleId === '04' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 5 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      05
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Silih Sayang, Silih Jaga & Silih Bantu
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Saling sayang, saling jaga, saling bantu kabeh. Kalo di antara kalian terlibat selisih dengan orang lain/luar, dukung dia dengan cara yg benar dan adil. Cari tau duduk perkaranya dulu jangan langsung ikut marah atau memusuhi dan memprovokasi.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '05',
                      'Silih Sayang, Silih Jaga & Silih Bantu',
                      'Saling sayang, saling jaga, saling bantu kabeh. Kalo di antara kalian terlibat selisih dengan orang lain/luar, dukung dia dengan cara yg benar dan adil. Cari tau duduk perkaranya dulu jangan langsung ikut marah atau memusuhi dan memprovokasi.'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 5"
                  >
                    {copiedRuleId === '05' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 6 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      06
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Menjaga Sikap & Kehormatan Dimana Saja
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Jaga sikap dimana saja, bersikap sopan ramah, dan rendah hati kepada siapapun (becanda boleh asal jangan berlebihan) jangan sampe bikin sakit hati orang lain atau anggota sendiri. <strong className="text-yellow-400">(S2J) adalah kehormatan kita</strong> jangan lakukan hal yg buruk yg bisa bikin malu atau merusak nama baik.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '06',
                      'Menjaga Sikap & Kehormatan Dimana Saja',
                      'Jaga sikap dimana saja, bersikap sopan ramah, dan rendah hati kepada siapapun (becanda boleh asal jangan berlebihan) jangan sampe bikin sakit hati orang lain atau anggota sendiri. (S2J) adalah kehormatan kita jangan lakukan hal yg buruk yg bisa bikin malu atau merusak nama baik.'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 6"
                  >
                    {copiedRuleId === '06' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Item 7 */}
                <div className="relative group/card flex flex-col sm:flex-row gap-4 items-start bg-zinc-950/70 p-6 rounded-2xl border border-zinc-850 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex gap-4 items-start flex-1 w-full">
                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0 font-bold font-sans">
                      07
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-serif font-bold text-zinc-100 mb-1">
                        Kemutlakan Kedamaian & Verifikasi Cerita
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Di larang memprovokasi menghasut atau mengajak berantem dengan kelompok lain, <strong className="text-yellow-400">KITA UTAMAKAN KEDAMAIAN</strong>, berani membela jika disakiti. <span className="text-emerald-400 font-semibold">(JANGAN MUDAH PERCAYA ORANG LAIN/LUAR JIKA BERCERITA BURUK TENTANG SODARA KITA, CEK KEBENARANNYA DULU KE PIHAK YANG BERSANGKUTAN)</span>.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyRuleToClipboard(
                      '07',
                      'Kemutlakan Kedamaian & Verifikasi Cerita',
                      'Di larang memprovokasi menghasut atau mengajak berantem dengan kelompok lain, KITA UTAMAKAN KEDAMAIAN, berani membela jika disakiti. (JANGAN MUDAH PERCAYA ORANG LAIN/LUAR JIKA BERCERITA BURUK TENTANG SODARA KITA, CEK KEBENARANNYA DULU KE PIHAK YANG BERSANGKUTAN).'
                    )}
                    className="mt-3 sm:mt-0 self-end sm:self-start shrink-0 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Aturan 7"
                  >
                    {copiedRuleId === '07' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover/card:text-yellow-400 transition-colors" />
                        <span className="text-zinc-400 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* WARNING TICKET SECTION */}
                <div className="bg-red-950/20 border-2 border-red-500/40 p-6 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <AlertTriangle className="w-24 h-24 text-red-500" />
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-red-400">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-xs sm:text-sm font-display font-black uppercase tracking-wider">
                        PERINGATAN KERAS / WARNING ⚠⚠⚠⚠⚠
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                      <strong>JANGAN MENGHINA, MENGUNJING, MENGADU DOMBA, ATAU MENYAKITI HATI SODARA SENDIRI!</strong> Selesaikan masalah dengan bicara baik-baik (JANGAN BAWA KELUAR). Kalo bisa bicara dengan bahasa santun, sopan, dan enak di dengar. Hindari kata kasar, makian, atau perkataan yg menyakiti hati.
                    </p>
                  </div>
                  <button
                    onClick={copyWarningToClipboard}
                    className="relative z-10 mt-3 sm:mt-0 shrink-0 p-2 rounded-xl bg-red-900/20 border border-red-500/40 text-red-400 hover:text-yellow-400 hover:bg-red-900/30 active:scale-90 transition-all flex items-center justify-center h-8 w-full sm:w-auto sm:px-3 sm:py-1.5 gap-1.5 text-xs font-mono"
                    title="Salin Peringatan Keras"
                  >
                    {copiedRuleId === 'WARNING' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold text-[10px]">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-red-300 text-[10px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* CLOSING GREETING */}
                <div className="text-center pt-6 border-t border-zinc-850">
                  <p className="text-emerald-400 font-bold tracking-wider text-sm sm:text-base">
                    WASSALAMU'ALAIKUM WARAHMATULLAHI WABARAKATUH
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest block mt-2 uppercase">
                    PAGUYUBAN DIGITAL SEDULURAN SUNDA JAWA
                  </span>
                </div>

              </div>
              
            </div>

          </div>

        </section>

      </main>

      {/* ==================== DECORATIVE LIGHTBOX MODAL ==================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 z-[999] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-3xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-96 sm:h-[420px] bg-zinc-950">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <button
                  id="lightbox-close-btn"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-950/80 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
                    {selectedImage.category} • FILOSOFI NUSANTARA
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">EST. 2026</span>
                </div>
                
                <h3 className="text-2xl font-serif font-black text-zinc-100">
                  {selectedImage.title}
                </h3>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                  {selectedImage.description}
                </p>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-sans italic">Silih asih, silih asah, silih asuh.</span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-2 bg-zinc-950 border border-zinc-800 text-xs font-semibold rounded-xl text-yellow-400 hover:text-yellow-300 hover:border-zinc-700"
                  >
                    Tutup Filosofi
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-zinc-950 border-t border-zinc-900 px-4 py-12 relative z-10 overflow-hidden">
        
        {/* Decorative thin lines background */}
        <div className="absolute inset-x-0 bottom-0 top-[80%] batik-mesh opacity-5" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-20">
          
          {/* Brand block footer */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border border-yellow-500/30 p-0.5 bg-zinc-900/90 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <img 
                src="https://hmw1mrn01w5ulmvr.public.blob.vercel-storage.com/1000106697-IP8qcHgKLiofiOOs5MSkc67UNyqTRR.png" 
                alt="S2J Logo in footer" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="text-lg font-serif font-bold tracking-widest text-zinc-100 block">
                SEDULURAN SUNDA JAWA
              </span>
              <span className="text-xs text-emerald-400 font-sans tracking-widest">
                “Seduluran Selawase • Rukun Agawe Santosa”
              </span>
            </div>
          </div>

          {/* Copyright description */}
          <div className="text-center md:text-right">
            <p className="text-zinc-500 text-xs font-sans">
              &copy; {new Date().getFullYear()} S2J (Seduluran Sunda Jawa). Dibuat dengan cinta luhur budaya Indonesia.
            </p>
            <p className="text-[10px] text-zinc-600 font-mono tracking-wider mt-1.5 flex items-center justify-center md:justify-end gap-1.5">
              <span>Time: {timeStr}</span>
            </p>
          </div>

        </div>

      </footer>

    </div>
  );
}
