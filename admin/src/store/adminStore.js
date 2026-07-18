import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
    persist(
        (set) => ({
            admin: null,
            token: null,
            isAuthenticated: false,

            setAdmin: (admin, token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('abeer-admin-token', token);
                }
                set({ admin, token, isAuthenticated: true });
            },

            clearAdmin: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('abeer-admin-token');
                }
                set({ admin: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'abeer-admin-auth',
        }
    )
);

export default useAdminStore;
