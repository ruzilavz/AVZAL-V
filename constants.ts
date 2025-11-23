import { NavItem, Track, Project } from './types';
import { Music, Mic2, Cpu, Image as ImageIcon, ShoppingBag, BookOpen, User, Mail } from 'lucide-react';

export const NAV_ITEMS: (NavItem & { icon: any })[] = [
  { label: 'Home', path: '/', icon: User }, // Using User icon as placeholder for Home/Hero
  { label: 'Music', path: '/music', icon: Music },
  { label: 'AI Lab', path: '/ai-lab', icon: Cpu },
  { label: 'Projects', path: '/projects', icon: Mic2 },
  { label: 'Gallery', path: '/gallery', icon: ImageIcon },
  { label: 'Shop', path: '/shop', icon: ShoppingBag },
  { label: 'Blog', path: '/blog', icon: BookOpen },
  { label: 'Contact', path: '/contact', icon: Mail },
];

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'AVZALØV',
    album: 'Cyber Genesis',
    duration: 184,
    coverUrl: 'https://picsum.photos/id/10/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    isReleased: true,
    releaseDate: '2023-10-15'
  },
  {
    id: '2',
    title: 'System Failure',
    artist: 'AVZALØV',
    album: 'Cyber Genesis',
    duration: 210,
    coverUrl: 'https://picsum.photos/id/20/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    isReleased: true,
    releaseDate: '2023-11-01'
  },
  {
    id: '3',
    title: 'Digital Ghost',
    artist: 'AVZALØV',
    album: 'Singles',
    duration: 165,
    coverUrl: 'https://picsum.photos/id/30/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    isReleased: true,
    releaseDate: '2023-12-20'
  },
  {
    id: '4',
    title: 'Reptile Protocol',
    artist: 'AVZALØV',
    duration: 0,
    coverUrl: 'https://picsum.photos/id/40/300/300',
    audioUrl: '',
    isReleased: false,
    releaseDate: 'Coming Soon'
  }
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Idle Lizard Game',
    description: 'A browser-based idle game integrated with the RUZCOIN economy. Level up your reptile avatar.',
    imageUrl: 'https://picsum.photos/id/100/600/400',
    tags: ['Game', 'Web3', 'Interactive']
  },
  {
    id: '2',
    title: 'Neural Soundscapes',
    description: 'Generative ambient music stream created by fine-tuned AI models on AVZALØV discography.',
    imageUrl: 'https://picsum.photos/id/101/600/400',
    tags: ['AI', 'Audio', 'Generative']
  }
];

export const SOCIAL_LINKS = [
  { name: 'Spotify', url: '#', icon: Music },
  { name: 'Instagram', url: '#', icon: ImageIcon },
  { name: 'YouTube', url: '#', icon: Mic2 },
];
