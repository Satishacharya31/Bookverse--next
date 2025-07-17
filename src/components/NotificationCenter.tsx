import { useState } from 'react';
import { Bell, X, BookOpen, Heart, MessageCircle, UserPlus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'new_book' | 'follow' | 'recommendation';
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  bookCover?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like on Your Book',
    description: 'Sarah Mitchell liked "Writing Masterclass: Crafting Stories"',
    time: '2 minutes ago',
    read: false,
    avatar: '/placeholder-avatar.jpg'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    description: 'Alex Rodriguez commented on "Top 10 Ebooks of 2023"',
    time: '15 minutes ago',
    read: false,
    avatar: '/placeholder-avatar.jpg'
  },
  {
    id: '3',
    type: 'new_book',
    title: 'New Book Released',
    description: 'Classic Literature uploaded "Pride and Prejudice"',
    time: '1 hour ago',
    read: true,
    bookCover: '/placeholder-book.jpg'
  },
  {
    id: '4',
    type: 'follow',
    title: 'New Subscriber',
    description: 'Emma Watson subscribed to your channel',
    time: '3 hours ago',
    read: true,
    avatar: '/placeholder-avatar.jpg'
  },
  {
    id: '5',
    type: 'recommendation',
    title: 'Recommended for You',
    description: 'Based on your reading history: "The Science of Storytelling"',
    time: '1 day ago',
    read: true,
    bookCover: '/placeholder-book.jpg'
  }
];

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'new_book': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'follow': return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'recommendation': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-4 top-20 w-96 bg-background rounded-lg shadow-2xl border max-h-[80vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                        !notification.read ? 'bg-primary/5 border-primary/20' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {notification.avatar ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={notification.avatar} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                            ) : notification.bookCover ? (
                              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-4 w-4 text-primary" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {getIcon(notification.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}