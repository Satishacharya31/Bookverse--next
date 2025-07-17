import { Home, Zap, Heart, BookOpen, History, User, Settings, BookMarked, TrendingUp, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const mainNavItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shorts', label: 'Shorts', icon: Zap },
  { id: 'subscriptions', label: 'Subscriptions', icon: Heart },
];

const libraryItems = [
  { id: 'library', label: 'Your Library', icon: BookOpen },
  { id: 'history', label: 'History', icon: History },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'reading-list', label: 'Reading List', icon: BookMarked },
];

const discoverItems = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'authors', label: 'Authors', icon: Users },
  { id: 'genres', label: 'Browse Genres', icon: BookOpen },
];

export default function Sidebar({ isOpen, currentPage, onPageChange }: SidebarProps) {
  const renderNavItem = (item: typeof mainNavItems[0], isActive: boolean) => (
    <Button
      key={item.id}
      variant="ghost"
      onClick={() => onPageChange(item.id)}
      className={cn(
        "sidebar-item w-full justify-start px-3 py-2 rounded-lg transition-all",
        isActive
          ? "bg-primary/10 text-primary font-semibold [&_svg]:text-primary"
          : "text-muted-foreground hover:bg-secondary [&_svg]:text-muted-foreground",
        "gap-3"
      )}
    >
      <item.icon className="h-5 w-5" />
      {isOpen && <span className="ml-1">{item.label}</span>}
    </Button>
  );

  return (
    <aside className={cn(
      "sticky top-[73px] h-[calc(100vh-73px)] bg-background border-r border-border transition-all duration-300",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="flex flex-col gap-2 p-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map(item => renderNavItem(item, currentPage === item.id))}
        </div>

        {isOpen && (
          <>
            <Separator className="my-2 bg-border/60" />
            
            {/* Library Section */}
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                Your Library
              </h3>
              {libraryItems.map(item => renderNavItem(item, currentPage === item.id))}
            </div>

            <Separator className="my-2 bg-border/60" />

            {/* Discover Section */}
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                Discover
              </h3>
              {discoverItems.map(item => renderNavItem(item, currentPage === item.id))}
            </div>

            <Separator className="my-2 bg-border/60" />

            {/* Settings */}
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => onPageChange('settings')}
                className={cn(
                  "sidebar-item w-full justify-start",
                  currentPage === 'settings' && "sidebar-item-active"
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </Button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}