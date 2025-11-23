export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  isReleased: boolean;
  releaseDate?: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}
