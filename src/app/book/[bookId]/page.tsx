"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import BookReader from '@/components/BookReader';
import CommentSection from '@/components/CommentSection';
import { mockBooks, mockComments } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookRecommendations from '@/components/BookRecommendations';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [comments, setComments] = useState(mockComments);

  const book = mockBooks.find(b => b.id === bookId);
  const [bookState, setBookState] = useState({
    currentPage: book?.currentPage || 1,
    totalPages: book?.totalPages || 120,
  });

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <Button onClick={() => router.push('/') }>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBookPageChange = (page: number) => {
    setBookState(prev => ({ ...prev, currentPage: page }));
  };

  const handleCommentSubmit = (content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: 'You',
      authorAvatar: '/placeholder-avatar.jpg',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isDisliked: false,
            dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
          }
        : comment
    ));
  };

  const handleCommentDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isDisliked: !comment.isDisliked,
            dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
            isLiked: false,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes
          }
        : comment
    ));
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: 'You',
      authorAvatar: '/placeholder-avatar.jpg',
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
    };
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...(comment.replies || []), newReply] }
        : comment
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl px-4 md:px-8">
            <div className="block md:hidden mb-2">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="text-xs px-2 py-1 h-7"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to Home
              </Button>
            </div>
            <div className="mb-8">
              <BookReader
                bookId={book.id}
                title={book.title}
                author={book.author}
                uploader={book.uploader}
                uploaderAvatar={book.uploaderAvatar}
                description={book.description}
                tags={book.tags}
                views={book.views}
                uploadDate={book.uploadDate}
                currentPage={bookState.currentPage}
                totalPages={bookState.totalPages}
                onPageChange={handleBookPageChange}
              />
            </div>
            <div className="mt-6">
              <CommentSection
                bookId={book.id}
                comments={comments}
                onCommentSubmit={handleCommentSubmit}
                onCommentLike={handleCommentLike}
                onCommentDislike={handleCommentDislike}
                onReply={handleReply}
              />
            </div>
            <div className="block md:hidden mt-8">
              <BookRecommendations
                currentBookId={book.id}
                onBookSelect={(id) => {
                  setBookState({
                    currentPage: 1,
                    totalPages: mockBooks.find(b => b.id === id)?.totalPages || 120,
                  });
                }}
              />
            </div>
          </div>
        </main>
        <aside className="hidden md:block w-[340px] flex-shrink-0">
          <div className="h-full flex flex-col justify-start pt-8 pr-4">
            <BookRecommendations
              currentBookId={book.id}
              onBookSelect={(id) => {
                setBookState({
                  currentPage: 1,
                  totalPages: mockBooks.find(b => b.id === id)?.totalPages || 120,
                });
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
} 