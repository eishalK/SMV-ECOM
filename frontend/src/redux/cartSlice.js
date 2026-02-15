import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],         
  totalQuantity: 0,   
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // This action sets the entire cart, typically after fetching from the backend
    setCart: (state, action) => {
      state.items = action.payload || [];
      state.totalQuantity = (action.payload || []).reduce(
        (acc, item) => acc + item.quantity, 
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    }
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;