import { create } from 'zustand';
import type { Movement, ChartDataPoint } from '@/services/api';

export type ViewType = 'scanner' | 'dashboard' | 'cartola';

interface AppState {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Dashboard state
  currentDashboardDate: Date;
  setDashboardDate: (date: Date) => void;
  changeMonth: (offset: number) => void;
  
  // Cached data
  cachedRealTimeData: {
    diario: number;
    semanal: number;
    comparativa: number;
  } | null;
  setCachedRealTimeData: (data: { diario: number; semanal: number; comparativa: number }) => void;
  
  cachedRecentMovements: Movement[];
  setCachedRecentMovements: (movements: Movement[]) => void;
  
  cachedChartData: ChartDataPoint[];
  setCachedChartData: (data: ChartDataPoint[]) => void;
}

export const useAppState = create<AppState>((set) => ({
  // Navigation
  currentView: 'scanner',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Dashboard state
  currentDashboardDate: new Date(),
  setDashboardDate: (date) => set({ currentDashboardDate: date }),
  changeMonth: (offset) => set((state) => {
    const newDate = new Date(state.currentDashboardDate);
    newDate.setMonth(newDate.getMonth() + offset);
    return { currentDashboardDate: newDate };
  }),
  
  // Cached data
  cachedRealTimeData: null,
  setCachedRealTimeData: (data) => set({ cachedRealTimeData: data }),
  
  cachedRecentMovements: [],
  setCachedRecentMovements: (movements) => set({ cachedRecentMovements: movements }),
  
  cachedChartData: [],
  setCachedChartData: (data) => set({ cachedChartData: data }),
}));
