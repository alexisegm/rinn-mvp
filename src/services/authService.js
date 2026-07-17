import { supabase } from '../config/supabase';

export const authService = {
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  async onAuthStateChange(callback) {
    const { data: { subscription }, error } = supabase.auth.onAuthStateChange(callback);
    return { subscription, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }
};
