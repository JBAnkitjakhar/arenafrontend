// src/lib/youtube-utils.ts

import { YouTubeVideoInfo, Solution } from '@/types';

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  controls?: boolean;
  start?: number;
  modestbranding?: boolean;
}

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
export function getYouTubeEmbedUrl(videoId: string, options: YouTubeEmbedOptions = {}): string {
  const params = new URLSearchParams();
  
  // Set default values
  params.set('modestbranding', '1');
  params.set('rel', '0');
  
  // Add optional parameters, converting to strings
  if (options.autoplay !== undefined) {
    params.set('autoplay', options.autoplay ? '1' : '0');
  }
  
  if (options.controls !== undefined) {
    params.set('controls', options.controls ? '1' : '0');
  }
  
  if (options.start !== undefined) {
    params.set('start', options.start.toString());
  }
  
  if (options.modestbranding !== undefined) {
    params.set('modestbranding', options.modestbranding ? '1' : '0');
  }
  
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
 * Enhanced solution type with YouTube properties
 * Using undefined instead of null to match Solution interface
 */
export interface EnhancedSolution extends Solution {
  hasValidYoutubeLink: boolean;
  youtubeVideoId: string | undefined;
  youtubeEmbedUrl: string | undefined;
}

/**
 * Enhance solution object with YouTube helper methods
 */
export function enhanceSolutionWithYouTube(solution: Solution): EnhancedSolution {
  const hasValidYoutubeLink = solution.youtubeLink ? isValidYouTubeUrl(solution.youtubeLink) : false;
  const extractedVideoId = solution.youtubeLink ? extractYouTubeVideoId(solution.youtubeLink) : null;
  const youtubeVideoId = extractedVideoId || undefined; // Convert null to undefined
  const youtubeEmbedUrl = youtubeVideoId ? getYouTubeEmbedUrl(youtubeVideoId) : undefined;

  return {
    ...solution,
    hasValidYoutubeLink,
    youtubeVideoId,
    youtubeEmbedUrl,
  };
}