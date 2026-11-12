/**
 * Servicio unificado de persistencia para FeriaZone.
 * Abstrae localStorage con try/catch y fallback en memoria.
 * Garantiza que la aplicación funcione al 100% incluso si localStorage falla o está bloqueado.
 */

class StorageService {
  constructor() {
    this.memoryStore = new Map();
    this.isLocalStorageAvailable = this._checkAvailability();
  }

  _checkAvailability() {
    try {
      const testKey = '__fz_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('[StorageService] localStorage no disponible. Usando fallback en memoria.', e);
      return false;
    }
  }

  get(key, defaultValue = null) {
    if (this.isLocalStorageAvailable) {
      try {
        const item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn(`[StorageService] Error al leer "${key}" de localStorage:`, e);
      }
    }
    return this.memoryStore.has(key) ? this.memoryStore.get(key) : defaultValue;
  }

  set(key, value) {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`[StorageService] Error al escribir "${key}" en localStorage:`, e);
      }
    }
    this.memoryStore.set(key, value);
    return true;
  }

  remove(key) {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.warn(`[StorageService] Error al eliminar "${key}" de localStorage:`, e);
      }
    }
    this.memoryStore.delete(key);
    return true;
  }

  clear() {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch (e) {
        console.warn('[StorageService] Error al limpiar localStorage:', e);
      }
    }
    this.memoryStore.clear();
    return true;
  }
}

export const storage = new StorageService();
