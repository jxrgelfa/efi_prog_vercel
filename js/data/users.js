/**
 * Usuarios de prueba para simulación de Login por Roles
 */
export const USERS_DATA = [
  {
    id: 'user-vecino',
    email: 'vecino@feriazone.com.ar',
    password: '123',
    name: 'Joaquín Cabrera',
    role: 'usuario', // Vecino comprador
    phone: '+54 9 358 456-7890',
    address: 'Av. Marcelo T. de Alvear 840, Banda Norte',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'user-feriante',
    email: 'feriante@feriazone.com.ar',
    password: '123',
    name: 'Esteban Molina',
    role: 'feriante', // Feriante emprendedor
    merchantId: 'emp-1', // Vinculado a Mates del Imperio
    phone: '+54 9 358 422-1102',
    address: 'Calle San Martín 1450, Barrio Alberdi',
    plan: 'basico', // 'basico' (hasta 15 productos) o 'pro' (ilimitado)
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'user-organizador',
    email: 'organizador@feriazone.com.ar',
    password: '123',
    name: 'Coordinación Municipal de Cultura y Eventos',
    role: 'organizador', // Administrador de ferias
    organizerId: 'org-1',
    phone: '+54 9 358 412-3890',
    address: 'Paseo Cultural del Andino, Río Cuarto',
    subscriptionStatus: 'activa',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
  }
];
