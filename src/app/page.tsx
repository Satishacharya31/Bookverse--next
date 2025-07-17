"use client";
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import BookGrid from '@/components/BookGrid';
import { mockBooks } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Star, Users } from 'lucide-react';

const featuredCategories = [
  { name: 'Trending', icon: TrendingUp, color: 'bg-destructive' },
  { name: 'New Releases', icon: Clock, color: 'bg-accent' },
  { name: 'Top Rated', icon: Star, color: 'bg-yellow' },
  { name: 'Popular', icon: Users, color: 'bg-green' },
];

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  // Next.js navigation for book click
  const handleBookClick = (bookId: string) => {
    window.location.href = `/book/${bookId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onSidebarToggle={handleSidebarToggle} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-6xl px-4 md:px-8 space-y-10">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-4xl font-bold text-primary">
                Welcome to BookTube
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover, read, and share amazing books with our community of readers
              </p>
            </div>
            {/* Featured Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredCategories.map((category) => (
                <div
                  key={category.name}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group flex items-center gap-3 bg-card rounded-xl border border-border shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      42 books
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Trending Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Trending Now</h2>
                <Badge variant="secondary" className="text-sm">
                  Updated hourly
                </Badge>
              </div>
              <BookGrid books={mockBooks} onBookClick={handleBookClick} />
            </div>
            {/* Recently Added */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recently Added</h2>
                <Badge variant="outline" className="text-sm">
                  New this week
                </Badge>
              </div>
              <BookGrid books={mockBooks.slice(0, 4)} onBookClick={handleBookClick} />
            </div>
            {/* Popular This Week */}
            <div className="space-y-6 pb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Popular This Week</h2>
                <Badge variant="secondary" className="text-sm">
                  Most viewed
                </Badge>
              </div>
              <BookGrid books={mockBooks.slice(2, 6)} onBookClick={handleBookClick} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
