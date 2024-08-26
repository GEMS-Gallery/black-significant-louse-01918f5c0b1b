import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Book {
  id: bigint;
  title: string;
  author: string;
  price: bigint;
}

const UserPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Book[]>([]);

  useEffect(() => {
    fetchUserPurchases();
  }, []);

  const fetchUserPurchases = async () => {
    try {
      const purchasedBookIds = await backend.getUserPurchases();
      const purchasedBooks = await Promise.all(
        purchasedBookIds.map(async (id) => {
          const result = await backend.getBookDetails(id);
          if ('ok' in result) {
            return result.ok;
          }
          return null;
        })
      );
      setPurchases(purchasedBooks.filter((book): book is Book => book !== null));
    } catch (error) {
      console.error('Error fetching user purchases:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Purchases
      </Typography>
      {purchases.length > 0 ? (
        <List>
          {purchases.map((book) => (
            <ListItem key={Number(book.id)}>
              <ListItemText
                primary={book.title}
                secondary={`${book.author} - $${Number(book.price) / 100}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>You haven't purchased any books yet.</Typography>
      )}
    </Paper>
  );
};

export default UserPurchases;
