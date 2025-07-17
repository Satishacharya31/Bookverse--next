import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FlipBookProps {
  bookId: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pages?: string[];
  progress: number;
  isReading: boolean;
  isMuted: boolean;
  isLiked: boolean;
  isDisliked: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onAutoRead: () => void;
  onToggleMute: () => void;
  onLike: () => void;
  onDislike: () => void;
  views: number;
  uploadDate: string;
  formatViews: (views: number) => string;
  formatDate: (date: string) => string;
  uploader?: string;
  uploaderAvatar?: string;
  isSubscribed?: boolean;
  onToggleSubscribe?: () => void;
  description?: string;
}

const BookPage = React.forwardRef<HTMLDivElement, { content: string }>(( { content }, ref) => (
  <div
    ref={ref}
    className="w-full h-full bg-[#fefdf9] text-[#2d2a26] font-serif text-[18px] p-10 leading-relaxed tracking-wide whitespace-pre-wrap"
  >
    {content}
  </div>
));

export default function FlipBook({
  bookId,
  title,
  author,
  currentPage,
  totalPages,
  onPageChange,
  pages = [],
  progress,
  isReading,
  isMuted,
  isLiked,
  isDisliked,
  onPrevPage,
  onNextPage,
  onAutoRead,
  onToggleMute,
  onLike,
  onDislike,
  views,
  uploadDate,
  formatViews,
  formatDate,
  uploader,
  uploaderAvatar,
  isSubscribed,
  onToggleSubscribe,
  description
}: FlipBookProps) {
  const bookRef = useRef<any>(null);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fallback: generate placeholder pages if none provided
  const bookPages = pages.length > 0 ? pages : Array.from({ length: totalPages }, (_, i) => `Page ${i + 1} of "${title}"\n\nThis is a placeholder page. Replace with real book content.`);

  // Show controls on hover/focus/tap
  const handleShowControls = () => setShowControls(true);
  const handleHideControls = () => setShowControls(false);

  return (
    <div
      className="w-full flex flex-col items-center relative group"
      onMouseEnter={handleShowControls}
      onMouseLeave={handleHideControls}
      onTouchStart={handleShowControls}
      onTouchEnd={handleHideControls}
      tabIndex={0}
    >
      <div className="relative">
        <HTMLFlipBook
          ref={bookRef}
          width={isMobile ? 350 : 700}
          height={isMobile ? 500 : 700}
          size="stretch"
          minWidth={isMobile ? 200 : 400}
          maxWidth={isMobile ? 400 : 1200}
          minHeight={isMobile ? 300 : 400}
          maxHeight={isMobile ? 700 : 1533}
          drawShadow={true}
          maxShadowOpacity={0.3}
          showCover={false}
          mobileScrollSupport={true}
          className="mx-auto border border-gray-300 rounded-xl shadow-lg"
          onFlip={(e) => {
            const newPage = e.data;
            onPageChange(newPage);
          }}
          usePortrait={isMobile}
          style={{ overflow: 'visible' }}
        >
          {isMobile
            ? bookPages.map((text, index) => (
                <BookPage key={index} content={text} />
              ))
            : bookPages.map((text, index) => (
                <BookPage key={index} content={text} />
              ))}
        </HTMLFlipBook>
        {/* Controls and Progress - YouTube style, overlayed and only visible on hover/focus/tap */}
        <div
          className={`absolute left-0 right-0 bottom-0 z-20 transition-opacity duration-200 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} `}
        >
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-1 pointer-events-auto">
            <div className="flex items-center justify-between gap-2 px-2 bg-black/60 rounded-b-xl pb-2 pt-2">
              {/* Left controls */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onPrevPage} disabled={currentPage === 0}>
                  <ChevronLeft className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onAutoRead}>
                  {isReading ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onNextPage} disabled={currentPage >= totalPages - 1}>
                  <ChevronRight className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onToggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-white" />
                </Button>
              </div>
              {/* Right info */}
              <div className="text-xs text-white min-w-fit">
                Page <strong>{currentPage + 1}</strong> / {totalPages}
              </div>
            </div>
            {/* Progress bar full width below controls */}
            <div className="w-full px-2">
              <Progress value={progress} className="h-1 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>
      {/* Optionally, render uploader/channel info here if not shown below book */}
      {/* ... */}
    </div>
  );
}