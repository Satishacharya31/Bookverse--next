import BookCard from './BookCard';

interface Book {
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
}

interface BookGridProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
}

export default function BookGrid({ books, onBookClick }: BookGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          {...book}
          onClick={() => onBookClick(book.id)}
        />
      ))}
    </div>
  );
}