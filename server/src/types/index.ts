export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'necklaces' | 'earrings' | 'rings' | 'bracelets';
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}
