export interface Member {
  id: string;
  username: string;
  role: 'owner' | 'admin' | 'member';
  avatarSeed: string;
  status: 'online' | 'offline' | 'idle';
  statusText?: string;
  origin?: 'Sunda' | 'Jawa' | 'Nusantara';
  joinedDate: string;
  customIcon?: string;
  colorTheme: string;
}

export interface S2JStory {
  id: string;
  sender: string;
  role: string | 'owner' | 'admin' | 'member';
  origin: 'Sunda' | 'Jawa' | 'Nusantara';
  message: string;
  timestamp: string;
  likes: number;
}

export interface WordPair {
  indonesia: string;
  sunda: string;
  jawa: string;
  context: string;
}
