// src/lib/youtube-utils.ts

import { YouTubeVideoInfo } from '@/types';

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  try {
    // Remove any extra whitespace
    const cleanUrl = url.trim();
    
    // Handle youtu.be format
    if (cleanUrl.includes('youtu.be/')) {
      const match = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    
    // Handle youtube.com/watch format
    if (cleanUrl.includes('youtube.com/watch')) {
      const match = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    
    // Handle youtube.com/embed format
    if (cleanUrl.includes('youtube.com/embed/')) {
      const match = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting YouTube video ID:', error);
    return null;
  }
}

/**
 * Validate if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null && videoId.length > 0;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string, options?: {
  autoplay?: boolean;
  controls?: boolean;
  start?: number;
  modestbranding?: boolean;
}): string {
  const params = new URLSearchParams({
    modestbranding: '1',
    rel: '0',
    ...options,
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Get YouTube video info from URL
 */
export function getYouTubeVideoInfo(url: string): YouTubeVideoInfo | null {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) return null;
  
  return {
    videoId,
    embedUrl: getYouTubeEmbedUrl(videoId),
    thumbnail: getYouTubeThumbnail(videoId, 'medium'),
  };
}

/**
 * Enhance solution object with YouTube helper methods
 */
export function enhanceSolutionWithYouTube(solution: any): any {
  return {
    ...solution,
    hasValidYoutubeLink: solution.youtubeLink ? isValidYouTubeUrl(solution.youtubeLink) : false,
    youtubeVideoId: solution.youtubeLink ? extractYouTubeVideoId(solution.youtubeLink) : null,
    youtubeEmbedUrl: solution.youtubeLink ? (() => {
      const videoId = extractYouTubeVideoId(solution.youtubeLink);
      return videoId ? getYouTubeEmbedUrl(videoId) : null;
    })() : null,
  };
}