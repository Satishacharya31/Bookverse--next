"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Book, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('upload');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    tags: [] as string[],
    category: '',
    file: null as File | null,
    thumbnail: null as File | null
  });
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      router.push('/');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'file' | 'thumbnail', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.file) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload a book file.",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      toast({
        title: "Upload Successful!",
        description: "Your book has been uploaded and is now available for readers.",
      });
      setIsUploading(false);
      router.push('/');
    }, 3000);
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
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Your Book
                </CardTitle>
                <CardDescription>
                  Share your book with the BookTube community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Book File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="book-file">Book File *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        id="book-file"
                        type="file"
                        accept=".pdf,.epub,.mobi"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('file', e.target.files[0])}
                        className="hidden"
                      />
                      <label htmlFor="book-file" className="cursor-pointer">
                        <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.file ? formData.file.name : 'Click to upload your book (PDF, EPUB, MOBI)'}
                        </p>
                      </label>
                    </div>
                  </div>
                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Book Cover</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnail', e.target.files[0])}
                        className="hidden"
                      />
                      <label htmlFor="thumbnail" className="cursor-pointer">
                        <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.thumbnail ? formData.thumbnail.name : 'Click to upload book cover'}
                        </p>
                      </label>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter book title"
                    />
                  </div>
                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter book description"
                      rows={4}
                    />
                  </div>
                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Select category</option>
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-Fiction</option>
                      <option value="science">Science</option>
                      <option value="technology">Technology</option>
                      <option value="history">History</option>
                      <option value="biography">Biography</option>
                      <option value="children">Children's Books</option>
                      <option value="educational">Educational</option>
                    </select>
                  </div>
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Book'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 