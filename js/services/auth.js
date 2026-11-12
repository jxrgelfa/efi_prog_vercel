import { storage } from './storage.js';
import { USERS_DATA } from '../data/users.js';

const AUTH_USER_KEY = 'fz_auth_user';

class AuthService {
  constructor() {
    this.currentUser = storage.get(AUTH_USER_KEY, null);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getUserRole() {
    return this.currentUser ? this.currentUser.role : null;
  }

  /**
   * Inicia sesión buscando usuario por email o id
   */
  login(email, password = null) {
    const user = USERS_DATA.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      storage.set(AUTH_USER_KEY, user);
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales inválidas' };
  }

  /**
   * Inicio de sesión rápido para botones demo
   */
  loginAsDemo(role) {
    const user = USERS_DATA.find(u => u.role === role);
    if (user) {
      this.currentUser = user;
      storage.set(AUTH_USER_KEY, user);
      return { success: true, user };
    }
    return { success: false, error: `Usuario demo para rol "${role}" no encontrado` };
  }

  /**
   * Registro de nuevo usuario y sesión automática
   */
  register(userData) {
    const role = userData.role || 'usuario';
    const roleNames = {
      usuario: 'Vecino Comprador',
      feriante: 'Feriante Productor',
      organizador: 'Organizador de Ferias'
    };

    const newUser = {
      id: 'usr-' + Date.now(),
      name: userData.name || roleNames[role] || 'Usuario FeriaZone',
      email: userData.email || `${role}_${Date.now().toString().slice(-4)}@feriazone.com.ar`,
      role: role,
      phone: userData.phone || '+54 9 358 456-7890',
      avatar: role === 'usuario' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80' 
        : role === 'feriante'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
    };

    this.currentUser = newUser;
    storage.set(AUTH_USER_KEY, newUser);
    return { success: true, user: newUser };
  }

  logout() {
    this.currentUser = null;
    storage.remove(AUTH_USER_KEY);
    return true;
  }

  /**
   * Guardián de rutas protegidas: verifica autenticación y rol requerido
   */
  requireAuth(allowedRoles = [], redirectUrl = '/pages/login.html') {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl;
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Acceso restringido: Esta sección requiere rol de ${allowedRoles.join(' o ')}.`);
      window.location.href = '/index.html';
      return false;
    }
    return true;
  }
}

export const auth = new AuthService();
