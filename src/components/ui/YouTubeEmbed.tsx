// src/components/ui/YouTubeEmbed.tsx

"use client";

import { useState, useCallback } from "react";
import { Play, ExternalLink, AlertCircle } from "lucide-react";
import {
  extractYouTubeVideoId,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
} from "@/lib/youtube-utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  showTitle?: boolean;
  showOpenInYouTube?: boolean;
  aspectRatio?: "16/9" | "4/3";
}

export function YouTubeEmbed({
  url,
  title = "Video Solution",
  className,
  autoplay = false,
  showTitle = true,
  showOpenInYouTube = true,
  aspectRatio = "16/9",
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(autoplay);

  const videoId = extractYouTubeVideoId(url);

  const handlePlayClick = useCallback(() => {
    setShowPlayer(true);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  if (!videoId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Invalid YouTube URL</span>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoId, { autoplay: showPlayer });
  const thumbnailUrl = getYouTubeThumbnail(videoId, "high");
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Title */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          {showOpenInYouTube && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(watchUrl, "_blank")}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in YouTube</span>
            </Button>
          )}
        </div>
      )}

      {/* Video Player */}
      <div
        className={cn(
          "relative bg-gray-100 rounded-lg overflow-hidden",
          aspectRatio === "16/9" ? "aspect-video" : "aspect-[4/3]"
        )}
      >
        {!showPlayer ? (
          // Thumbnail with play button
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={handlePlayClick}
          >
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/video-placeholder.png";
              }}
              unoptimized // For external YouTube thumbnails
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-colors">
              <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* YouTube logo */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                YouTube
              </div>
            </div>
          </div>
        ) : (
          // Actual embedded player
          <div className="relative w-full h-full">
            {(!isLoaded || hasError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                {hasError ? (
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Failed to load video
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(watchUrl, "_blank")}
                    >
                      Watch on YouTube
                    </Button>
                  </div>
                ) : (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                )}
              </div>
            )}

            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={cn("w-full h-full border-0", !isLoaded && "opacity-0")}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Video ID: {videoId}</span>
        {!showOpenInYouTube && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(watchUrl, "_blank")}
            className="text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            YouTube
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact version for lists
export function YouTubeThumbnail({
  url,
  className,
  onClick,
}: {
  url: string;
  className?: string;
  onClick?: () => void;
}) {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) return null;

  const thumbnailUrl = getYouTubeThumbnail(videoId, "medium");

  return (
    <div
      className={cn(
        "relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group aspect-video",
        className
      )}
      onClick={onClick}
    >
      <Image
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-colors">
        <Play className="h-6 w-6 text-white" fill="currentColor" />
      </div>
    </div>
  );
}
