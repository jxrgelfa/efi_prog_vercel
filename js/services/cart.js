import { storage } from './storage.js';

const CART_KEY = 'fz_cart_items';

class CartService {
  constructor() {
    this.items = storage.get(CART_KEY, []);
    this.listeners = [];
  }

  getItems() {
    return this.items;
  }

  getCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        merchantId: product.merchantId,
        merchantName: product.merchantName,
        quantity: quantity
      });
    }
    this._persist();
  }

  updateQuantity(productId, quantity) {
    const parsed = parseInt(quantity, 10);
    if (parsed <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity = parsed;
      this._persist();
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this._persist();
  }

  clear() {
    this.items = [];
    this._persist();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  _persist() {
    storage.set(CART_KEY, this.items);
    this.listeners.forEach(cb => {
      try {
        cb(this.items, this.getCount(), this.getTotalPrice());
      } catch (e) {
        console.warn('Error en listener de carrito', e);
      }
    });
  }
}

export const cart = new CartService();
