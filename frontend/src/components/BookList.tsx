import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { backend } from '../../declarations/backend';
import { useAuth } from '../context/AuthContext';

interface Book {
  id: bigint;
  title: string;
  author: string;
  description: string;
  price: bigint;
  imageUrl: string;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const result = await backend.getBooks();
      setBooks(result);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePurchase = async () => {
    if (!selectedBook || !isAuthenticated) return;

    try {
      const result = await backend.purchaseBook(selectedBook.id);
      if ('ok' in result) {
        alert('Book purchased successfully!');
        handleCloseDialog();
      } else {
        alert(`Failed to purchase book: ${result.err}`);
      }
    } catch (error) {
      console.error('Error purchasing book:', error);
      alert('An error occurred while purchasing the book.');
    }
  };

  return (
    <>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={Number(book.id)}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={book.imageUrl}
                alt={book.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${Number(book.price) / 100}
                </Typography>
              </CardContent>
              <Button onClick={() => handleBookClick(book)} sx={{ m: 2 }}>
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {selectedBook && (
          <>
            <DialogTitle>{selectedBook.title}</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1">{selectedBook.author}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedBook.description}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                ${Number(selectedBook.price) / 100}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {isAuthenticated && (
                <Button onClick={handlePurchase} variant="contained" color="primary">
                  Purchase
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default BookList;
