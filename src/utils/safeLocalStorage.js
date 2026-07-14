// src/utils/safeLocalStorage.js

export const safeLocalStorage = {
  getItem: (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error leyendo ${key} del localStorage:`, error);
      return defaultValue;
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error guardando ${key} en localStorage:`, error);
    }
  }
};