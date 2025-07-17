import { useState } from 'react';
import { Search, Upload, Bell, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import SearchResults from '@/components/SearchResults';
import NotificationCenter from '@/components/NotificationCenter';

interface NavigationProps {
  onSidebarToggle: () => void;
}

export default function Navigation({ onSidebarToggle }: NavigationProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section: Menu + Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="nav-button nav-button-ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BT</span>
            </div>
            <span className="text-xl font-bold text-primary">BookTube</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search books, authors, topics..."
              className="rounded-full border border-border bg-secondary pl-10 pr-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </form>
        </div>

        {/* Right section: Actions + Profile */}
        <div className="flex items-center gap-3">
          <Button
            variant="solid"
            size="sm"
            className="bg-primary text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-md hover:bg-primary/90 border-0"
            onClick={() => router.push('/upload')}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative bg-white text-primary hover:bg-secondary border border-border shadow-sm"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-destructive text-white border-2 border-white"
              variant="destructive"
            >
              3
            </Badge>
          </Button>

          <Avatar 
            className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-2 transition-all"
            onClick={() => router.push('/profile')}
          >
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="bg-gradient-primary text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Search Results Overlay */}
      {showSearchResults && (
        <SearchResults 
          searchQuery={searchQuery}
          onClose={() => setShowSearchResults(false)}
        />
      )}
      
      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </nav>
  );
}