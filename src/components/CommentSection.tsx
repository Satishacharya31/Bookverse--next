import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Reply, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  bookId: string;
  comments: Comment[];
  onCommentSubmit: (content: string) => void;
  onCommentLike: (commentId: string) => void;
  onCommentDislike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

export default function CommentSection({
  bookId,
  comments = [], // Default to empty array
  onCommentSubmit,
  onCommentLike,
  onCommentDislike,
  onReply
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffTime = Math.abs(now.getTime() - commentDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  const CommentCard = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={`comment-card ${isReply ? 'ml-8' : ''} text-xs`}>
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.authorAvatar} alt={comment.author} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium text-xs">{comment.author}</span>
              <span className="text-[10px] text-muted-foreground">
                {formatTimestamp(comment.timestamp)}
              </span>
            </div>
            
            <p className="text-xs mb-2 leading-relaxed">{comment.content}</p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCommentLike(comment.id)}
                className={`text-[10px] gap-1 px-1 py-0 h-6 w-6 ${comment.isLiked ? 'text-blue-500' : ''}`}
              >
                <ThumbsUp className="h-3 w-3" />
                {comment.likes}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCommentDislike(comment.id)}
                className={`text-[10px] gap-1 px-1 py-0 h-6 w-6 ${comment.isDisliked ? 'text-red-500' : ''}`}
              >
                <ThumbsDown className="h-3 w-3" />
                {comment.dislikes > 0 && comment.dislikes}
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-[10px] gap-1 px-1 py-0 h-6 w-6"
                >
                  <Reply className="h-3 w-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="text-[10px] h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-2 space-y-1">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[40px] text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Comments</h2>
            <span className="text-xs text-muted-foreground">
              {(comments?.length ?? 0)} comment{(comments?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Add Comment */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[40px] text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => setNewComment('')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments List */}
          <div className="space-y-4">
            {(comments ?? []).map((comment) => (
              <div key={comment.id} className="space-y-2">
                <CommentCard comment={comment} />
                {(comment.replies ?? []).map((reply) => (
                  <CommentCard key={reply.id} comment={reply} isReply />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}