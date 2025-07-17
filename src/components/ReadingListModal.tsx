import { useState } from 'react';
import { Plus, X, BookMarked, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ReadingList {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  isPublic: boolean;
}

interface ReadingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId?: string;
  bookTitle?: string;
}

const mockReadingLists: ReadingList[] = [
  { id: '1', name: 'Want to Read', description: 'Books I plan to read soon', bookCount: 12, isPublic: false },
  { id: '2', name: 'Favorites', description: 'My all-time favorite books', bookCount: 8, isPublic: true },
  { id: '3', name: 'Science Fiction', description: 'Sci-fi collection', bookCount: 15, isPublic: true },
];

export default function ReadingListModal({ isOpen, onClose, bookId, bookTitle }: ReadingListModalProps) {
  const [readingLists, setReadingLists] = useState(mockReadingLists);
  const [newListName, setNewListName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const createNewList = () => {
    if (!newListName.trim()) return;
    
    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: `Custom reading list: ${newListName}`,
      bookCount: bookId ? 1 : 0,
      isPublic: false
    };
    
    setReadingLists(prev => [...prev, newList]);
    setNewListName('');
    setShowCreateForm(false);
    
    if (bookId) {
      toast({
        title: "Book Added!",
        description: `"${bookTitle}" has been added to "${newListName}"`,
      });
    } else {
      toast({
        title: "Reading List Created!",
        description: `"${newListName}" has been created successfully.`,
      });
    }
  };

  const addToList = (listId: string, listName: string) => {
    setReadingLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { ...list, bookCount: list.bookCount + 1 }
          : list
      )
    );
    
    toast({
      title: "Book Added!",
      description: `"${bookTitle}" has been added to "${listName}"`,
    });
    onClose();
  };

  const deleteList = (listId: string, listName: string) => {
    setReadingLists(prev => prev.filter(list => list.id !== listId));
    toast({
      title: "Reading List Deleted",
      description: `"${listName}" has been deleted.`,
      variant: "destructive"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 bg-background rounded-lg shadow-2xl">
        <div className="flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {bookId ? 'Save to Reading List' : 'Manage Reading Lists'}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Create New List Form */}
            {showCreateForm ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Input
                    placeholder="Reading list name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={createNewList} size="sm">
                      Create
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewListName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full justify-start gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Reading List
              </Button>
            )}

            {/* Existing Reading Lists */}
            <div className="space-y-2">
              {readingLists.map((list) => (
                <Card
                  key={list.id}
                  className={`cursor-pointer transition-colors ${
                    bookId ? 'hover:bg-accent/50' : ''
                  }`}
                  onClick={() => bookId && addToList(list.id, list.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookMarked className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">{list.name}</h4>
                          {list.isPublic && (
                            <Badge variant="secondary" className="text-xs">Public</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{list.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {list.bookCount} {list.bookCount === 1 ? 'book' : 'books'}
                        </p>
                      </div>
                      
                      {!bookId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list.id, list.name);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {readingLists.length === 0 && (
              <div className="text-center py-8">
                <BookMarked className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No reading lists yet.</p>
                <p className="text-sm text-muted-foreground">Create your first reading list!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
