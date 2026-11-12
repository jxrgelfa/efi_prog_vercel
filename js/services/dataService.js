import { storage } from './storage.js';
import { PRODUCTS_DATA } from '../data/products.js';
import { FAIRS_DATA } from '../data/fairs.js';
import { MERCHANTS_DATA } from '../data/merchants.js';
import { REVIEWS_DATA } from '../data/reviews.js';

const PRODUCTS_KEY = 'fz_products';
const FAIRS_KEY = 'fz_fairs';
const REVIEWS_KEY = 'fz_reviews';
const ORDERS_KEY = 'fz_orders';

class DataService {
  constructor() {
    this._initSeeds();
  }

  _initSeeds() {
    const existingProducts = storage.get(PRODUCTS_KEY);
    if (!existingProducts) {
      storage.set(PRODUCTS_KEY, PRODUCTS_DATA);
    } else {
      // Sincronizar productos base para asegurar que todos tengan su imagen y datos actualizados sin duplicados
      const mergedProducts = PRODUCTS_DATA.map(seedProd => {
        const found = existingProducts.find(p => p.id === seedProd.id);
        if (!found) return seedProd;
        return {
          ...found,
          ...seedProd,
          stock: found.stock !== undefined ? found.stock : seedProd.stock
        };
      });
      const customProducts = existingProducts.filter(p => !PRODUCTS_DATA.some(sp => sp.id === p.id));
      storage.set(PRODUCTS_KEY, [...mergedProducts, ...customProducts]);
    }
    const existingFairs = storage.get(FAIRS_KEY);
    if (!existingFairs) {
      storage.set(FAIRS_KEY, FAIRS_DATA);
    } else {
      // Sincronizar ferias base para asegurar que todas tengan su imagen propia
      const mergedFairs = FAIRS_DATA.map(seedFair => {
        const found = existingFairs.find(f => f.id === seedFair.id);
        if (!found) return seedFair;
        return {
          ...found,
          ...seedFair,
          status: found.status || seedFair.status
        };
      });
      const customFairs = existingFairs.filter(f => !FAIRS_DATA.some(sf => sf.id === f.id));
      storage.set(FAIRS_KEY, [...mergedFairs, ...customFairs]);
    }
    if (!storage.get(REVIEWS_KEY)) {
      storage.set(REVIEWS_KEY, REVIEWS_DATA);
    }
    if (!storage.get(ORDERS_KEY)) {
      storage.set(ORDERS_KEY, [
        {
          id: 'ORD-9821',
          date: '2026-10-24',
          total: 25700,
          status: 'Entregado en puesto',
          fairName: 'Feria de Artesanos del Parque Sarmiento',
          items: [
            { name: 'Mate Imperial de Calabaza', quantity: 1, price: 18500 },
            { name: 'Bombilla Pico de Loro de Alpaca', quantity: 1, price: 7200 }
          ]
        }
      ]);
    }
  }

  // --- PRODUCTOS ---
  getProducts() {
    return storage.get(PRODUCTS_KEY, PRODUCTS_DATA);
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  saveProduct(productData) {
    const products = this.getProducts();
    if (productData.id) {
      const idx = products.findIndex(p => p.id === productData.id);
      if (idx > -1) {
        products[idx] = { ...products[idx], ...productData };
      }
    } else {
      productData.id = 'prod-' + Date.now();
      products.unshift(productData);
    }
    storage.set(PRODUCTS_KEY, products);
    return productData;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    storage.set(PRODUCTS_KEY, products);
  }

  // --- FERIAS ---
  getFairs() {
    return storage.get(FAIRS_KEY, FAIRS_DATA);
  }

  getFairById(id) {
    return this.getFairs().find(f => f.id === id) || null;
  }

  saveFair(fairData) {
    const fairs = this.getFairs();
    if (fairData.id) {
      const idx = fairs.findIndex(f => f.id === fairData.id);
      if (idx > -1) {
        fairs[idx] = { ...fairs[idx], ...fairData };
      }
    } else {
      fairData.id = 'feria-' + Date.now();
      fairs.unshift(fairData);
    }
    storage.set(FAIRS_KEY, fairs);
    return fairData;
  }

  // --- EMPRENDEDORES ---
  getMerchants() {
    return MERCHANTS_DATA;
  }

  getMerchantById(id) {
    return MERCHANTS_DATA.find(m => m.id === id) || null;
  }

  // --- RESEÑAS ---
  getReviews() {
    return storage.get(REVIEWS_KEY, REVIEWS_DATA);
  }

  addReview(type, review) {
    const reviews = this.getReviews();
    review.id = 'rev-' + Date.now();
    review.date = new Date().toISOString().split('T')[0];
    if (type === 'product') {
      reviews.products.unshift(review);
    } else {
      reviews.fairs.unshift(review);
    }
    storage.set(REVIEWS_KEY, reviews);
    return review;
  }

  // --- PEDIDOS ---
  getOrders() {
    return storage.get(ORDERS_KEY, []);
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    const orderNumber = 'FZ-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'Confirmado (Pendiente de retiro)',
      ...orderData
    };
    orders.unshift(newOrder);
    storage.set(ORDERS_KEY, orders);
    return newOrder;
  }
}

export const dataService = new DataService();
