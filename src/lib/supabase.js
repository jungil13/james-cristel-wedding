import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('example.com')
);

// Initial mock data to showcase the luxury dashboard out-of-the-box
const INITIAL_RSVPS = [
  {
    id: '1e4a1a6b-8711-4f8a-9865-c328db374b01',
    full_name: 'Ignacio Jr. & Celyn Echavia',
    email: 'ignacio.echavia@example.com',
    phone: '+63 917 555 1024',
    guest_count: 2,
    attendance: 'accepted',
    message: 'Congratulations James and Cristel! Honored to stand as your Principal Sponsors.',
    dietary_restrictions: 'None',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '2b5b2c7c-9822-4a9b-8754-d439ec485c12',
    full_name: 'Maribeth Tan',
    email: 'maribeth.tan@example.com',
    phone: '+63 928 444 8921',
    guest_count: 1,
    attendance: 'accepted',
    message: 'So happy for you both, Cristel! Can’t wait for the bridesmaid duties!',
    dietary_restrictions: 'Pescatarian',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: '3c6c3d8d-0933-4b0c-9865-e540fd596d23',
    full_name: 'Jon Willie Detal',
    email: 'jonwillie@example.com',
    phone: '+63 919 333 7812',
    guest_count: 2,
    attendance: 'accepted',
    message: 'Cheers to the groom and bride! See you at Chateau By The Sea.',
    dietary_restrictions: 'No shellfish',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '4d7d4e9e-1044-4c1d-0976-f651ge607e34',
    full_name: 'Edeson Malacura',
    email: 'edeson.malacura@example.com',
    phone: '+63 930 222 4567',
    guest_count: 1,
    attendance: 'accepted',
    message: 'Looking forward to celebrating this sacred union with family.',
    dietary_restrictions: 'None',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '5e8e5f0f-2155-4d2e-1087-g762hf718f45',
    full_name: 'Karlo & Sofia Mendoza',
    email: 'karlo.mendoza@example.com',
    phone: '+63 945 111 9876',
    guest_count: 2,
    attendance: 'declined',
    message: 'Warmest congratulations James and Cristel! Sadly we will be overseas, but our prayers and love are with you!',
    dietary_restrictions: '',
    status: 'declined',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '6f9f6g1g-3266-4e3f-2198-h873ig829g56',
    full_name: 'Jasmin Malacura',
    email: 'jasmin.malacura@example.com',
    phone: '+63 956 777 6543',
    guest_count: 1,
    attendance: 'accepted',
    message: 'Excited for the big day! Love you Cristel and James!',
    dietary_restrictions: 'Vegetarian',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: '7a0a7h2h-4377-4f4g-3209-i984jh930h67',
    full_name: 'Kent Brylle Ybañez',
    email: 'kent.brylle@example.com',
    phone: '+63 967 888 1234',
    guest_count: 2,
    attendance: 'accepted',
    message: 'Honored to celebrate with you both! Best wishes on your journey together.',
    dietary_restrictions: '',
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  }
];

// LocalStorage Mock Data Store
class MockSupabaseClient {
  constructor() {
    this.storageKey = 'james_cristel_rsvps';
    this.authKey = 'james_cristel_auth';
    this.listeners = new Set();
    this.initData();
  }

  initData() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_RSVPS));
      }
    }
  }

  getRsvps() {
    if (typeof window === 'undefined') return INITIAL_RSVPS;
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : INITIAL_RSVPS;
  }

  saveRsvps(rsvps) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(rsvps));
      this.notifyListeners();
    }
  }

  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (err) {
        console.error('Error in mock listener', err);
      }
    });
  }

  // Auth simulation
  auth = {
    signInWithPassword: async ({ email, password }) => {
      await new Promise(res => setTimeout(res, 600));
      // Demo credentials allowed: admin@jamescristel.wedding / Love2027!
      // Or any email with password 'Love2027!' or 'admin123'
      const trimmedEmail = email?.trim().toLowerCase();
      if (
        (trimmedEmail === 'admin@jamescristel.wedding' || trimmedEmail === 'james@jamescristel.wedding' || trimmedEmail === 'admin') &&
        (password === 'Love2027!' || password === 'admin123' || password === 'admin')
      ) {
        const user = {
          id: 'admin-uuid-0001',
          email: trimmedEmail,
          role: 'admin',
          user_metadata: { name: 'Wedding Administrator' }
        };
        const session = { access_token: 'mock-token-xyz', user };
        localStorage.setItem(this.authKey, JSON.stringify(session));
        return { data: { user, session }, error: null };
      }
      return { data: { user: null, session: null }, error: { message: 'Invalid login credentials. Use admin@jamescristel.wedding with password Love2027!' } };
    },

    signOut: async () => {
      localStorage.removeItem(this.authKey);
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem(this.authKey);
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    },

    getUser: async () => {
      const session = localStorage.getItem(this.authKey);
      return { data: { user: session ? JSON.parse(session).user : null }, error: null };
    },

    onAuthStateChange: (callback) => {
      // Return unsubscription function
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  };

  // Channel simulation for Realtime
  channel(name) {
    const that = this;
    return {
      on(event, filter, callback) {
        const listener = () => callback({ eventType: 'UPDATE' });
        that.listeners.add(listener);
        return {
          subscribe() {
            return {
              unsubscribe() {
                that.listeners.delete(listener);
              }
            };
          }
        };
      }
    };
  }

  from(tableName) {
    const that = this;
    return {
      select(fields = '*') {
        let records = that.getRsvps();
        let error = null;

        const chain = {
          order(field = 'created_at', { ascending = false } = {}) {
            records.sort((a, b) => {
              if (field === 'guest_count') {
                return ascending ? a.guest_count - b.guest_count : b.guest_count - a.guest_count;
              }
              const dateA = new Date(a[field]).getTime();
              const dateB = new Date(b[field]).getTime();
              return ascending ? dateA - dateB : dateB - dateA;
            });
            return chain;
          },
          eq(column, value) {
            records = records.filter(r => String(r[column]).toLowerCase() === String(value).toLowerCase());
            return chain;
          },
          then(resolve) {
            resolve({ data: records, error });
          }
        };

        return chain;
      },

      async insert(newRecords) {
        await new Promise(r => setTimeout(r, 400));
        const items = Array.isArray(newRecords) ? newRecords : [newRecords];
        let current = that.getRsvps();
        const created = [];

        for (const item of items) {
          // Duplicate detection by email if email provided
          const email = item.email ? item.email.trim().toLowerCase() : null;
          const existingIndex = email ? current.findIndex(r => r.email && r.email.trim().toLowerCase() === email) : -1;

          if (existingIndex >= 0) {
            // Update existing record
            current[existingIndex] = {
              ...current[existingIndex],
              ...item,
              updated_at: new Date().toISOString()
            };
            created.push(current[existingIndex]);
          } else {
            const newRecord = {
              id: 'rsvp-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
              status: item.status || 'pending',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...item
            };
            current.unshift(newRecord);
            created.push(newRecord);
          }
        }

        that.saveRsvps(current);
        return { data: created, error: null };
      },

      async update(updates) {
        await new Promise(r => setTimeout(r, 300));
        let current = that.getRsvps();
        return {
          eq: async (column, value) => {
            current = current.map(item => {
              if (String(item[column]) === String(value)) {
                return { ...item, ...updates, updated_at: new Date().toISOString() };
              }
              return item;
            });
            that.saveRsvps(current);
            return { data: current, error: null };
          }
        };
      },

      async delete() {
        await new Promise(r => setTimeout(r, 300));
        let current = that.getRsvps();
        return {
          eq: async (column, value) => {
            const beforeLen = current.length;
            current = current.filter(item => String(item[column]) !== String(value));
            that.saveRsvps(current);
            return { data: null, error: null };
          }
        };
      }
    };
  }
}

// Export active supabase client (Real Supabase if configured, otherwise high-fidelity mock)
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new MockSupabaseClient();
