import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockBooks } from '@/data/mockData';
import BookGrid from '@/components/BookGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface SearchResultsProps {
  searchQuery: string;
  onClose: () => void;
}

export default function SearchResults({ searchQuery, onClose }: SearchResultsProps) {
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(mockBooks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mockBooks.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query) ||
      book.tags.some(tag => tag.toLowerCase().includes(query)) ||
      book.uploader.toLowerCase().includes(query)
    );

    setFilteredBooks(filtered);
  }, [searchQuery]);

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
    onClose();
  };

  const getSearchStats = () => {
    const totalResults = filteredBooks.length;
    const categories = [...new Set(filteredBooks.flatMap(book => book.tags))];
    return { totalResults, categories: categories.slice(0, 5) };
  };

  const { totalResults, categories } = getSearchStats();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-4 bg-background rounded-lg shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-semibold">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-sm text-muted-foreground">
                  {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {searchQuery.trim() && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {filteredBooks.length > 0 ? (
              <div className="space-y-6">
                <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try searching with different keywords or browse our categories
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}