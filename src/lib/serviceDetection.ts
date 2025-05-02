
import { Facebook, Instagram, ShoppingCart } from 'lucide-react';

interface ServiceInfo {
  name: string;
  icon: string;
  deepLink?: string;
  webUrl?: string;
}

// Common services database
export const knownServices: Record<string, ServiceInfo> = {
  'facebook': {
    name: 'Facebook',
    icon: 'facebook',
    deepLink: 'fb://',
    webUrl: 'https://facebook.com'
  },
  'instagram': {
    name: 'Instagram',
    icon: 'instagram',
    deepLink: 'instagram://',
    webUrl: 'https://instagram.com'
  },
  'twitter': {
    name: 'Twitter',
    icon: 'twitter',
    deepLink: 'twitter://',
    webUrl: 'https://twitter.com'
  },
  'amazon': {
    name: 'Amazon',
    icon: 'amazon',
    deepLink: 'amzn://',
    webUrl: 'https://amazon.com'
  },
  'google': {
    name: 'Google',
    icon: '🔍',
    webUrl: 'https://google.com'
  },
  'gmail': {
    name: 'Gmail',
    icon: '📧',
    deepLink: 'googlegmail://',
    webUrl: 'https://mail.google.com'
  },
  'youtube': {
    name: 'YouTube',
    icon: '📺',
    deepLink: 'youtube://',
    webUrl: 'https://youtube.com'
  },
  'netflix': {
    name: 'Netflix',
    icon: '📺',
    deepLink: 'netflix://',
    webUrl: 'https://netflix.com'
  },
  'linkedin': {
    name: 'LinkedIn',
    icon: 'linkedin',
    deepLink: 'linkedin://',
    webUrl: 'https://linkedin.com'
  },
  'spotify': {
    name: 'Spotify',
    icon: '🎵',
    deepLink: 'spotify://',
    webUrl: 'https://spotify.com'
  },
  'apple': {
    name: 'Apple',
    icon: '🍎',
    webUrl: 'https://apple.com'
  },
  'microsoft': {
    name: 'Microsoft',
    icon: '🪟',
    webUrl: 'https://microsoft.com'
  },
  'github': {
    name: 'GitHub',
    icon: '📝',
    webUrl: 'https://github.com'
  }
};

/**
 * Detects service info based on title or URL
 */
export const detectService = (title: string, url?: string): ServiceInfo | null => {
  // Normalize inputs
  const normalizedTitle = title.toLowerCase();
  const normalizedUrl = url ? url.toLowerCase() : '';
  
  // First try direct matches with the service name
  for (const [key, info] of Object.entries(knownServices)) {
    if (normalizedTitle === key || normalizedTitle.includes(key)) {
      return info;
    }
    
    // If URL is available, check if it contains the service name
    if (normalizedUrl && normalizedUrl.includes(key)) {
      return info;
    }
  }
  
  // If we couldn't find a match, return null
  return null;
};

/**
 * Tries to open a deep link, falls back to web URL
 */
export const openServiceLink = (service: ServiceInfo): void => {
  if (service.deepLink) {
    // Try to open the deep link
    window.location.href = service.deepLink;
    
    // Set a timeout to check if the app was opened
    // If not, fall back to the web URL
    setTimeout(() => {
      if (document.hidden) return; // App was opened
      if (service.webUrl) {
        window.location.href = service.webUrl;
      }
    }, 500);
  } else if (service.webUrl) {
    // If there's no deep link, just open the web URL
    window.open(service.webUrl, '_blank');
  }
};
