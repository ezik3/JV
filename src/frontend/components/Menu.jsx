import React, { useState } from 'react';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Menu = ({ menuItems, onOrderComplete }) => {
  const [order, setOrder] = useState({});
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const addToOrder = (itemId) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      [itemId]: (prevOrder[itemId] || 0) + 1
    }));
  };

  const removeFromOrder = (itemId) => {
    setOrder(prevOrder => {
      const newOrder = { ...prevOrder };
      if (newOrder[itemId] > 1) {
        newOrder[itemId]--;
      } else {
        delete newOrder[itemId];
      }
      return newOrder;
    });
  };

  const getTotalPrice = () => {
    return Object.entries(order).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return total + (item.price * quantity);
    }, 0).toFixed(2);
  };

  const handleOrderSubmit = () => {
    onOrderComplete(order);
    setIsOrderDialogOpen(false);
    setOrder({});
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText 
              primary={item.name} 
              secondary={`$${item.price.toFixed(2)}`} 
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => removeFromOrder(item.id)}>
                <RemoveIcon />
              </IconButton>
              <Typography component="span" style={{ margin: '0 10px' }}>
                {order[item.id] || 0}
              </Typography>
              <IconButton edge="end" onClick={() => addToOrder(item.id)}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setIsOrderDialogOpen(true)}
        disabled={Object.keys(order).length === 0}
      >
        Place Order
      </Button>

      <Dialog open={isOrderDialogOpen} onClose={() => setIsOrderDialogOpen(false)}>
        <DialogTitle>Confirm Your Order</DialogTitle>
        <DialogContent>
          {Object.entries(order).map(([itemId, quantity]) => {
            const item = menuItems.find(item => item.id === parseInt(itemId));
            return (
              <Typography key={itemId}>
                {item.name} x {quantity} - ${(item.price * quantity).toFixed(2)}
              </Typography>
            );
          })}
          <Typography variant="h6" style={{ marginTop: 20 }}>
            Total: ${getTotalPrice()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOrderDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleOrderSubmit} color="primary">
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Menu;