import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// High-capacity parsers for Base64 image transfers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Local folder for uploaded pictures
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Path to dynamic files
const DYNAMIC_MEMBERS_FILE = path.join(process.cwd(), "dynamic_members.json");
const BOT_CONFIG_FILE = path.join(process.cwd(), "bot_config.json");
const DYNAMIC_GALLERY_FILE = path.join(process.cwd(), "dynamic_gallery.json");

// Helper to read dynamic gallery from disk
function readDynamicGallery() {
  try {
    if (fs.existsSync(DYNAMIC_GALLERY_FILE)) {
      const data = fs.readFileSync(DYNAMIC_GALLERY_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading dynamic gallery:", error);
  }
  return [];
}

// Helper to write dynamic gallery to disk
function writeDynamicGallery(gallery: any[]) {
  try {
    fs.writeFileSync(DYNAMIC_GALLERY_FILE, JSON.stringify(gallery, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing dynamic gallery:", error);
  }
}

// Predefined seed data for the gallery to keep the site filled beautifully
const defaultGallery = [
  {
    id: 'gal-1',
    title: 'Indahnya Parahyangan',
    subtitle: 'Pegunungan Jawa Barat',
    category: 'Sunda',
    imageUrl: 'https://images.unsplash.com/photo-1594918731557-0b154807466d?auto=format&fit=crop&w=800&q=80',
    description: 'Hamparan perkebunan teh hijau di dataran tinggi Jawa Barat yang melambangkan kesegaran, keindahan alam, dan kedamaian hati baraya Sunda.',
  },
  {
    id: 'gal-2',
    title: 'Megahnya Borobudur',
    subtitle: 'Karya Agung Nusantara',
    category: 'Jawa',
    imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
    description: 'Simbol kebijaksanaan luhur, ketenangan spiritual, dan kerajinan agung yang terpahat indah di bumi Jawa untuk dunia.',
  },
  {
    id: 'gal-3',
    title: 'Gamelan & Angklung Berpadu',
    subtitle: 'Sinergi Harmoni Musik Tradisional',
    category: 'Kolaborasi',
    imageUrl: 'https://images.unsplash.com/photo-1534156039819-c89418369a4f?auto=format&fit=crop&w=800&q=80',
    description: 'Ketika getaran bambu yang ceria menyatu dengan gema perunggu yang sakral dalam aransemen musik modern digital.',
  },
  {
    id: 'gal-4',
    title: 'Batik Sawat & Megamendung',
    subtitle: 'Estetika Motif Adiluhung',
    category: 'Sajak Motif',
    imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    description: 'Hiasan garuda agung bersanding mesra dengan rupa awan yang meneduhi. Karya seni sakral warisan Nusantara sejati.',
  },
  {
    id: 'gal-5',
    title: 'Kehangatan Secangkir Wedang & Kopi',
    subtitle: 'Rasa yang Menyatukan Kita',
    category: 'Ruang Santai',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Tak peduli secangkir kopi murni priangan maupun segelas wedang jahe manis lereng Lawu, semua berseru dalam semangat kekeluargaan.',
  },
  {
    id: 'gal-6',
    title: 'Gunungan & Pagelaran Wayang',
    subtitle: 'Filosofi Alur Kehidupan',
    category: 'Jawa',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
    description: 'Gunungan melambangkan alam semesta, gejolak hati manusia, rintangan mendaki, serta persatuan puncak ketakwaan kepada Sang Pencipta.',
  }
];

// Helper to read bot configuration from disk
function readBotConfig() {
  try {
    if (fs.existsSync(BOT_CONFIG_FILE)) {
      const data = fs.readFileSync(BOT_CONFIG_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading bot config:", error);
  }
  return { botToken: "", guildId: "" };
}

// Helper to write bot configuration to disk
function writeBotConfig(config: any) {
  try {
    fs.writeFileSync(BOT_CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing bot config:", error);
  }
}

// Helper to read dynamic members from disk
function readDynamicMembers() {
  try {
    if (fs.existsSync(DYNAMIC_MEMBERS_FILE)) {
      const data = fs.readFileSync(DYNAMIC_MEMBERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading dynamic members:", error);
  }
  return [];
}

// Helper to write dynamic members to disk
function writeDynamicMembers(members: any[]) {
  try {
    fs.writeFileSync(DYNAMIC_MEMBERS_FILE, JSON.stringify(members, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing dynamic members:", error);
  }
}

// Predefined seed data matching src/data.ts so they merge seamlessly
const defaultMembers = [
  {
    id: 'owner-anom',
    username: 'S2JxAa_anom',
    role: 'owner',
    avatarSeed: 'anom',
    status: 'online',
    statusText: 'Ngaping dulur-dulur kabeh 🙏✨',
    origin: 'Sunda',
    joinedDate: 'Agustus 2024',
    customIcon: '👑',
    colorTheme: 'from-orange-500 to-red-600',
  },
  {
    id: 'admin-zee',
    username: 'S2JxZeeChei',
    role: 'admin',
    avatarSeed: 'zee',
    status: 'online',
    statusText: 'Rukun agawe santosa 🤝',
    origin: 'Jawa',
    joinedDate: 'September 2024',
    customIcon: '👑',
    colorTheme: 'from-purple-500 to-violet-600',
  },
  {
    id: 'admin-aca',
    username: 'S2JxAcaaa',
    role: 'admin',
    avatarSeed: 'aca',
    status: 'online',
    statusText: 'Silih asih, silih asah, silih asuh 🌻',
    origin: 'Sunda',
    joinedDate: 'September 2024',
    customIcon: '🌻',
    colorTheme: 'from-fuchsia-500 to-indigo-600',
  },
  {
    id: 'admin-cheisy',
    username: 'S2JxCheisyZee',
    role: 'admin',
    avatarSeed: 'cheisy',
    status: 'idle',
    statusText: 'Ngopi santai bersama keluarga 🌸',
    origin: 'Jawa',
    joinedDate: 'Oktober 2024',
    customIcon: '🌸',
    colorTheme: 'from-pink-500 to-purple-600',
  },
  {
    id: 'mem-kem',
    username: 'S2J x Mr.Kem®',
    role: 'member',
    avatarSeed: 'kem',
    status: 'online',
    statusText: 'Gas lur, no rasis club! ⚡',
    origin: 'Nusantara',
    joinedDate: 'Desember 2024',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-afif',
    username: 'S2JxAFIFBAIK 💀1312',
    role: 'member',
    avatarSeed: 'afif',
    status: 'offline',
    statusText: 'Solidaritas nomor siji.',
    origin: 'Jawa',
    joinedDate: 'Januari 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-cipi',
    username: 'S2JxCipiwwww',
    role: 'member',
    avatarSeed: 'cipi',
    status: 'online',
    statusText: 'Someah ka sadayana, asoyy 🍃',
    origin: 'Sunda',
    joinedDate: 'Februari 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-gula',
    username: 'S2JxGulaAren',
    role: 'member',
    avatarSeed: 'gula',
    status: 'online',
    statusText: 'Manis koyo rasaning dulur 🍯',
    origin: 'Jawa',
    joinedDate: 'Februari 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-kyotaka',
    username: 'S2JxKyotaka ⚡ONIC',
    role: 'member',
    avatarSeed: 'kyotaka',
    status: 'online',
    statusText: 'Fokus mabar dulur-dulur 🎮',
    origin: 'Nusantara',
    joinedDate: 'Maret 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-mosh',
    username: 'S2JxMosshhhh',
    role: 'member',
    avatarSeed: 'mosh',
    status: 'idle',
    statusText: 'Nikmati alam Jawa & Sunda 🏔️',
    origin: 'Sunda',
    joinedDate: 'April 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-tyya',
    username: 'SJ2xTyya',
    role: 'member',
    avatarSeed: 'tyya',
    status: 'online',
    statusText: 'Damai neng kene baraya 💕',
    origin: 'Jawa',
    joinedDate: 'Mei 2025',
    colorTheme: 'from-emerald-500 to-teal-600',
  }
];

// API Routes: Discord Bot CONFIG & SYNC
// GET bot config
app.get("/api/bot-config", (req, res) => {
  const config = readBotConfig();
  res.json(config);
});

// POST bot config
app.post("/api/bot-config", (req, res) => {
  const { botToken, guildId } = req.body;
  const config = {
    botToken: botToken || "",
    guildId: guildId || ""
  };
  writeBotConfig(config);
  res.json({ success: true, message: "Konfigurasi Bot Discord berhasil disimpan!" });
});

// POST /api/discord-sync (Integrasi Nyata Discord API)
app.post("/api/discord-sync", async (req, res) => {
  const config = readBotConfig();
  const token = req.body.botToken !== undefined ? req.body.botToken : config.botToken;
  const guildId = req.body.guildId !== undefined ? req.body.guildId : config.guildId;

  if (!token || !guildId) {
    return res.status(400).json({ error: "Discord Bot Token dan Guild ID diperlukan!" });
  }

  try {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members?limit=100`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ 
        error: `Gagal memanggil Discord API: ${response.status} ${response.statusText}`, 
        detail: errText 
      });
    }

    const discordMembers: any = await response.json();
    if (!Array.isArray(discordMembers)) {
      return res.status(500).json({ error: "Response dari Discord bukan list member yang valid." });
    }

    const dynamic = readDynamicMembers();
    const existingUsernames = new Set(dynamic.map((m: any) => m.username.toLowerCase()));
    
    // Add default member usernames to existing checks too
    defaultMembers.forEach((m) => existingUsernames.add(m.username.toLowerCase()));

    let importCount = 0;

    discordMembers.forEach((member: any) => {
      if (!member.user || member.user.bot) return; // Skip bot accounts

      const rawName = member.user.global_name || member.nick || member.user.username;
      // Pre-formatting to follow S2J naming rules
      const mappedUsername = rawName.startsWith("S2J") ? rawName : `S2J x ${rawName}`;

      // Check duplicate
      if (existingUsernames.has(mappedUsername.toLowerCase())) return;

      // Smart origin detection
      let origin: "Sunda" | "Jawa" | "Nusantara" = "Nusantara";
      const nameLower = rawName.toLowerCase();
      
      const sundaKeywords = ["asep", "cecep", "dedi", "ujang", "kang", "nyai", "dadang", "mulyana", "sutisna", "sunda", "isur", "teh", "engkus", "deden", "yayan", "dadan"];
      const jawaKeywords = ["bambang", "eko", "agus", "joko", "sri", "siti", "wahyu", "sugeng", "supardi", "mbak", "mas", "dimas", "kartika", "nugroho", "jawa", "widodo", "bowo"];

      if (sundaKeywords.some(kw => nameLower.includes(kw))) {
        origin = "Sunda";
      } else if (jawaKeywords.some(kw => nameLower.includes(kw))) {
        origin = "Jawa";
      }

      // Selection of beautiful gradient themes
      const gradients = [
        "from-orange-550 to-red-650",
        "from-purple-550 to-indigo-650",
        "from-pink-550 to-purple-650",
        "from-emerald-555 to-teal-655"
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const newMember = {
        id: `dc-${member.user.id}`,
        username: mappedUsername,
        role: "member",
        avatarSeed: member.user.username || "user",
        status: "online",
        statusText: member.nick ? `Panggil abdi: "${member.nick}"! ✨` : "Sedulur Anyar dari Discord Live! 🤝",
        origin: origin,
        joinedDate: "Mei 2026",
        customIcon: "👾",
        colorTheme: randomGradient
      };

      dynamic.push(newMember);
      existingUsernames.add(mappedUsername.toLowerCase());
      importCount++;
    });

    if (importCount > 0) {
      writeDynamicMembers(dynamic);
    }

    res.json({ 
      success: true, 
      message: `Berhasil mengimpor ${importCount} anggota aktif dari Server Discord!`,
      importCount,
      totalCount: discordMembers.length
    });

  } catch (err: any) {
    console.error("Error syncing discord members:", err);
    res.status(500).json({ 
      error: "Sistem server mengalami gangguan saat sinkronisasi Discord.", 
      detail: err.message 
    });
  }
});

// 1. GET `/api/members`
app.get("/api/members", (req, res) => {
  const dynamic = readDynamicMembers();
  // Filter out duplicates if any overlap
  const dynamicIds = new Set(dynamic.map((m: any) => m.id));
  const filteredDefaults = defaultMembers.filter((m) => !dynamicIds.has(m.id));
  
  // Combine native members and dynamic members
  const combined = [...filteredDefaults, ...dynamic];
  res.json({ members: combined });
});

// 2. POST `/api/discord-webhook` (Discord real payload/webhook receiver)
// Can be triggered from a Discord Bot when a member joins
app.post("/api/discord-webhook", (req, res) => {
  const { username, origin, statusText, status, avatarSeed, role, customIcon } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const dynamic = readDynamicMembers();
  
  // Create a clean member object
  const newMember = {
    id: `dc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: username.startsWith("S2J") ? username : `S2J x ${username}`,
    role: role || "member",
    avatarSeed: avatarSeed || username.toLowerCase().replace(/[^a-z0-9]/g, "") || "user",
    status: status || "online",
    statusText: statusText || "Sedulur Baru lewat Discord! 🤝✨",
    origin: origin || "Nusantara",
    joinedDate: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    customIcon: customIcon || "🤖",
    colorTheme: "from-blue-500 to-emerald-600"
  };

  dynamic.push(newMember);
  writeDynamicMembers(dynamic);

  res.status(201).json({ success: true, member: newMember });
});

// 3. POST `/api/simulate-reset`
app.post("/api/simulate-reset", (req, res) => {
  writeDynamicMembers([]);
  res.json({ success: true, message: "Reset dynamic members list" });
});

// 4. DELETE `/api/members/:id`
app.delete("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const dynamic = readDynamicMembers();
  const updated = dynamic.filter((m: any) => m.id !== id);
  writeDynamicMembers(updated);
  res.json({ success: true, message: `Removed member ${id}` });
});

// 5. PATCH `/api/members/:id`
app.patch("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const { status, statusText } = req.body;
  const dynamic = readDynamicMembers();
  let updated = dynamic.map((m: any) => {
    if (m.id === id) {
      return {
        ...m,
        status: status || m.status,
        statusText: statusText !== undefined ? statusText : m.statusText
      };
    }
    return m;
  });
  writeDynamicMembers(updated);
  res.json({ success: true, message: `Updated member ${id}` });
});

// 6. GET `/api/gallery`
app.get("/api/gallery", (req, res) => {
  const dynamic = readDynamicGallery();
  const dynamicIds = new Set(dynamic.map((m: any) => m.id));
  const filteredDefaults = defaultGallery.filter((m) => !dynamicIds.has(m.id));
  res.json({ gallery: [...dynamic, ...filteredDefaults] });
});

// 7. POST `/api/gallery`
app.post("/api/gallery", (req, res) => {
  const { title, subtitle, category, description, imageBase64, imageUrl } = req.body;
  
  if (!title || !category || !description) {
    return res.status(400).json({ error: "Judul, Kategori, dan Deskripsi wajib diisi!" });
  }

  let finalImageUrl = imageUrl || "";

  if (imageBase64) {
    try {
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || "png";
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `photo-${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, buffer);
        finalImageUrl = `/uploads/${filename}`;
      } else {
        finalImageUrl = imageBase64;
      }
    } catch (err: any) {
      console.error("Error saving file uploads:", err);
      return res.status(500).json({ error: "Terjadi galat ketika menyimpan gambar di server." });
    }
  }

  if (!finalImageUrl) {
    return res.status(400).json({ error: "Unggah file foto atau sertakan URL gambar!" });
  }

  const dynamic = readDynamicGallery();
  const newItem = {
    id: `gal-user-${Date.now()}`,
    title,
    subtitle: subtitle || "Unggahan Keluarga S2J",
    category,
    imageUrl: finalImageUrl,
    description,
    isUserUploaded: true
  };

  dynamic.unshift(newItem); // New images come first
  writeDynamicGallery(dynamic);

  res.status(201).json({ success: true, item: newItem });
});

// 8. DELETE `/api/gallery/:id`
app.delete("/api/gallery/:id", (req, res) => {
  const { id } = req.params;
  const dynamic = readDynamicGallery();
  const filtered = dynamic.filter((item: any) => item.id !== id);
  writeDynamicGallery(filtered);
  res.json({ success: true, message: `Berhasil menghapus foto dari gallery!` });
});

// Mount Vite middleware for development (after API routes)
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`S2J Server running on http://localhost:${PORT}`);
  });
};

startServer();
