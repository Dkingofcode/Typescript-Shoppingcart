import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useQuery } from "react-query";

// COmponents
import Drawer from  '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';
import Item from './Item/item';

// Styles
import { Wrapper } from './App.styles';
import { StyledButton } from './App.styles';
// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}


const getProducts = async (): Promise<CartItemType[]>  => 
   await (await fetch('https://fakestoreapi.com/products')).json();


function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([] as CartItemType[]);
    



 // const [count, setCount] = useState(0)
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);
  console.log(data);

  const getTotalItems = (items: CartItemType[]) => 
  items.reduce((acc: number, item) => acc + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
     
      if(isItemInCart) {
        return prev.map(item => 
          item.id === clickedItem.id ? { ...item, amount: item.amount + 1 } : item    
          );
      }
    
      // First time the item is added
      return [ ...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((acc, item) => {

      if(item.id === id){
        if (item.amount === 1) return acc;
        return [...acc, { ...item, amount: item.amount - 1}];
      }else{
        return [ ...acc, item];
      }

      }, [] as CartItemType[])
    );
  };

  if(isLoading) return <LinearProgress />;
  if(error) return <div>Something went wrong ... </div>;




  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        Cart Goes here
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
{/* 
    <div className="App">
    start      
    </div> */}
    </Wrapper>
  )
};

export default App;
