import { supabase } from '../config/supabase';

export function globalStoreSupabase(table) {
  const fromTable = () => supabase.from(table);

  const applyFilters = (query, filters = {}) => {
    let builtQuery = query;

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          builtQuery = builtQuery.in(key, value);
        }
      } else {
        builtQuery = builtQuery.eq(key, value);
      }
    });

    return builtQuery;
  };

  return {
    async getAll(select = '*', filters = {}, options = {}) {
      let query = fromTable().select(select);
      query = applyFilters(query, filters);

      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column, { ascending });
      }

      const { data, error } = await query;
      return { data, error };
    },

    async getOne(select = '*', filters = {}, options = {}) {
      let query = fromTable().select(select);
      query = applyFilters(query, filters);

      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column, { ascending });
      }

      const { data, error } = await query.maybeSingle();
      return { data, error };
    },

    async getById(id, select = '*') {
      const { data, error } = await fromTable().select(select).eq('id', id).maybeSingle();
      return { data, error };
    },

    async insert(payload, select = '*') {
      const { data, error } = await fromTable().insert(payload).select(select).single();
      return { data, error };
    },

    async insertMany(payloads, select = '*') {
      const { data, error } = await fromTable().insert(payloads).select(select);
      return { data, error };
    },

    async update(payload, filters = {}, select = '*') {
      let query = fromTable().update(payload);
      query = applyFilters(query, filters);
      const { data, error } = await query.select(select);
      return { data, error };
    },

    async upsert(payload, options = {}) {
      const { data, error } = await fromTable().upsert(payload, options).select('*');
      return { data, error };
    },

    async delete(filters = {}) {
      let query = fromTable().delete();
      query = applyFilters(query, filters);
      const { data, error } = await query;
      return { data, error };
    }
  };
}
