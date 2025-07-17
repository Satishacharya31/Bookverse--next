import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, ThumbsUp } from 'lucide-react';
import { mockBooks } from '@/data/mockData';

interface BookRecommendationsProps {
  currentBookId: string;
  onBookSelect: (bookId: string) => void;
}

export default function BookRecommendations({ currentBookId, onBookSelect }: BookRecommendationsProps) {
  const recommendations = mockBooks.filter(book => book.id !== currentBookId);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (pages: number) => {
    const minutes = Math.floor(pages * 2.5); // Assume 2.5 minutes per page
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
    }
    return `${minutes}:00`;
  };

  return (
    <div className="w-full max-w-sm space-y-3">
      <h3 className="text-lg font-semibold text-foreground mb-4">Up Next</h3>
      
      {recommendations.map((book) => (
        <Card 
          key={book.id}
          className="cursor-pointer hover:bg-accent/50 transition-colors duration-200"
          onClick={() => onBookSelect(book.id)}
        >
          <CardContent className="p-3">
            <div className="flex gap-3">
              {/* Book Cover Thumbnail */}
              <div className="relative flex-shrink-0">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-24 h-16 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {formatDuration(book.totalPages)}
                </div>
              </div>
              
              {/* Book Info */}
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
                  {book.title}
                </h4>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={book.uploaderAvatar} alt={book.uploader} />
                    <AvatarFallback>{book.uploader.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{book.uploader}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(book.views)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {book.uploadDate}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {book.tags[0]}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    {Math.floor(book.views * 0.05)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}