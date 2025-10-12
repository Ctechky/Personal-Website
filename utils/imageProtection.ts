// Image Protection Utility
const encode = (path: string) => btoa(path).split('').reverse().join('');
const decode = (encoded: string) => atob(encoded.split('').reverse().join(''));

const IMAGE_MAP: Record<string, string> = {
  // Profile images
  'profile_black': encode('/images/profile/ChongKokYang_Black.png'),
  'profile_white': encode('/images/profile/ChongKokYang_White.png'),
  'profile_chill': encode('/images/profile/ChongKokyang_chill.jpeg'),
  
  // Project images
  'proj_1': encode('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop'),
  'proj_2': encode('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop'),
  'proj_3': encode('https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop'),
  'proj_4': encode('https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&h=250&fit=crop'),
  'proj_5': encode('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=250&fit=crop'),
  'proj_6': encode('https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=400&h=250&fit=crop'),
  'proj_7': encode('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop'),
  'proj_8': encode('https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=250&fit=crop'),
  'proj_9': encode('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'),
  'proj_10': encode('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop'),
  
  // Hobby images
  'hobby_coding': encode('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop'),
  'hobby_debate': encode('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&h=300&fit=crop'),
  'hobby_movies': encode('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=300&fit=crop'),
  'hobby_pingpong': encode('https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=500&h=300&fit=crop'),
  'hobby_running': encode('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&h=300&fit=crop'),
  'hobby_mahjong': encode('https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=500&h=300&fit=crop'),
  'hobby_reading': encode('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop'),
};

export const getImageUrl = (key: string): string => {
  const encoded = IMAGE_MAP[key];
  return encoded ? decode(encoded) : '';
};

// Image protection
if (typeof window !== 'undefined') {
  const preventAction = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' && target.classList.contains('protected-image')) {
      e.preventDefault();
    }
  };
  
  window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('contextmenu', preventAction);
    document.addEventListener('dragstart', preventAction);
  });
}

