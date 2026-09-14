import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentViewsState {
  viewedProperties: Array<{
    propertyId: number;
    viewedAt: Date;
  }>;
  
  // Actions
  addViewedProperty: (propertyId: number) => void;
  removeViewedProperty: (propertyId: number) => void;
  clearAllViewedProperties: () => void;
  getRecentProperties: () => Array<{ propertyId: number; viewedAt: Date }>;
}

export const useRecentViewsStore = create<RecentViewsState>()(
  persist(
    (set, get) => ({
      viewedProperties: [],
      
      addViewedProperty: (propertyId) => {
        set((state) => {
          const filtered = state.viewedProperties.filter(
            item => item.propertyId !== propertyId
          );
          return {
            viewedProperties: [
              { propertyId, viewedAt: new Date() },
              ...filtered
            ].slice(0, 50)
          };
        });
      },
      
      removeViewedProperty: (propertyId) => {
        set((state) => ({
          viewedProperties: state.viewedProperties.filter(
            item => item.propertyId !== propertyId
          )
        }));
      },
      
      clearAllViewedProperties: () => {
        set({ viewedProperties: [] });
      },
      
      getRecentProperties: () => {
        return get().viewedProperties;
      }
    }),
    {
      name: 'recent-views-storage'
    }
  )
);