"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import BookGrid from '@/components/BookGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Eye, Calendar, Settings, Bell } from 'lucide-react';
import { mockBooks } from '@/data/mockData';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('profile');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();

  // Mock user data
  const userProfile = {
    name: 'BookLover123',
    avatar: '/placeholder-avatar.jpg',
    subscribers: 12500,
    totalViews: 2450000,
    booksUploaded: 8,
    joinedDate: '2022-03-15',
    bio: 'Passionate about literature and sharing great books with the world. I love classic novels, science fiction, and educational content.',
    isVerified: true
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/');
    }
  };

  const handleBookClick = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const userBooks = mockBooks.filter(book => book.uploader === userProfile.name);
  const likedBooks = mockBooks.slice(0, 3);
  const savedBooks = mockBooks.slice(3, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSidebarToggle={handleSidebarToggle} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">{userProfile.name}</h1>
                        {userProfile.isVerified && (
                          <Badge variant="secondary">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {formatNumber(userProfile.subscribers)} subscribers
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {userProfile.booksUploaded} books
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(userProfile.totalViews)} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(userProfile.joinedDate)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-2xl">
                        {userProfile.bio}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleSubscribe}
                        variant={isSubscribed ? "outline" : "default"}
                        className="flex items-center gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Content Tabs */}
            <Tabs defaultValue="books" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
              </TabsList>
              <TabsContent value="books" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Uploaded Books</CardTitle>
                    <CardDescription>
                      Books uploaded by {userProfile.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookGrid books={userBooks} onBookClick={handleBookClick} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="liked" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Liked Books</CardTitle>
                    <CardDescription>
                      Books you've liked
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookGrid books={likedBooks} onBookClick={handleBookClick} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="saved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Books</CardTitle>
                    <CardDescription>
                      Books you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookGrid books={savedBooks} onBookClick={handleBookClick} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="playlists" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reading Lists</CardTitle>
                    <CardDescription>
                      Your custom reading lists
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No reading lists yet. Create your first reading list!
                      </p>
                      <Button className="mt-4">Create Reading List</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
} 