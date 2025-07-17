import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Settings, Bookmark, Share2, Download, Heart, Eye, Calendar, ThumbsUp, ThumbsDown, Volume2, VolumeX, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import FlipBook from '@/components/FlipBook';
import BookRecommendations from '@/components/BookRecommendations';
import ReadingListModal from '@/components/ReadingListModal';
import { useToast } from '@/hooks/use-toast';
// Removed: import { useNavigate } from 'react-router-dom';

interface BookReaderProps {
  bookId: string;
  title: string;
  author: string;
  uploader: string;
  uploaderAvatar: string;
  description: string;
  tags: string[];
  views: number;
  uploadDate: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookReader({
  bookId,
  title,
  author,
  uploader,
  uploaderAvatar,
  description,
  tags,
  views,
  uploadDate,
  currentPage,
  totalPages,
  onPageChange
}: BookReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showReadingListModal, setShowReadingListModal] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const { toast } = useToast();
  // Removed: const navigate = useNavigate();
  
  const progress = (currentPage / totalPages) * 100;

  // Text-to-Speech functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isReading && !isMuted) {
      // Simulate reading with auto page turn
      interval = setInterval(() => {
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        } else {
          setIsReading(false);
        }
      }, 30000 / readingSpeed); // Adjust timing based on reading speed
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReading, isMuted, currentPage, totalPages, readingSpeed, onPageChange]);

  const handleAutoRead = () => {
    if (!isReading) {
      // Start reading
      setIsReading(true);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Reading ${title} by ${author}. Page ${currentPage} of ${totalPages}.`
        );
        utterance.rate = readingSpeed;
        window.speechSynthesis.speak(utterance);
      }
      toast({
        title: "Auto-Read Started",
        description: `Now reading "${title}" at ${readingSpeed}x speed.`,
      });
    } else {
      // Stop reading
      setIsReading(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      toast({
        title: "Auto-Read Stopped",
        description: "Reading has been paused.",
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full">
      {/* Book View - Realistic Styled Container with Controls/Info inside */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl mx-auto mb-2">
        <div className="relative flex justify-center items-center">
          <div className="w-full max-w-2xl">
            <FlipBook
              bookId={bookId}
              title={title}
              author={author}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              progress={progress}
              isReading={isReading}
              isMuted={isMuted}
              isLiked={isLiked}
              isDisliked={isDisliked}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              onAutoRead={handleAutoRead}
              onToggleMute={() => setIsMuted(!isMuted)}
              onLike={() => setIsLiked(!isLiked)}
              onDislike={() => setIsDisliked(!isDisliked)}
              views={views}
              uploadDate={uploadDate}
              formatViews={formatViews}
              formatDate={formatDate}
              uploader={uploader}
              uploaderAvatar={uploaderAvatar}
              isSubscribed={isSubscribed}
              onToggleSubscribe={() => setIsSubscribed(!isSubscribed)}
              description={description}
            />
          </div>
        </div>
      </div>
      {/* Channel/Creator Info below book */}
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 px-2 py-4 border-b border-border">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage src={uploaderAvatar} alt={uploader} />
            <AvatarFallback>{uploader.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg text-foreground">{uploader}</div>
            <div className="text-xs text-muted-foreground">1M subscribers • 200 books</div>
          </div>
          <Button
            className={`ml-4 bg-purple-600 text-white hover:bg-purple-700 ${isSubscribed ? 'opacity-70' : ''}`}
            onClick={() => setIsSubscribed(!isSubscribed)}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex-1">
          {description}
        </div>
      </div>
    </div>
  );
}