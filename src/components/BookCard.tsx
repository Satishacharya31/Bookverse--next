import { Calendar, Eye, User, Clock, Heart, Share2, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  uploader: string;
  uploaderAvatar: string;
  views: number;
  uploadDate: string;
  duration: string;
  tags: string[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  onClick?: () => void;
}

export default function BookCard({
  id,
  title,
  author,
  coverImage,
  description,
  uploader,
  uploaderAvatar,
  views,
  uploadDate,
  duration,
  tags,
  isLiked = false,
  isBookmarked = false,
  onClick
}: BookCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - uploadDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="bg-card rounded-xl border border-border shadow-sm group cursor-pointer transition-all hover:shadow-lg book-card" onClick={onClick}>
      <div className="relative">
        <img 
          src={coverImage} 
          alt={title}
          className="book-card-image"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium shadow">
          {duration}
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-secondary text-primary border border-border shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle like
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-secondary text-primary border border-border shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle bookmark
            }}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={uploaderAvatar} alt={uploader} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground line-clamp-2 leading-tight mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                by {author}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <span>{uploader}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViews(views)} views
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(uploadDate)}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-secondary text-foreground border border-border">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs border border-border text-muted-foreground bg-card">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}