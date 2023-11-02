import { create } from 'zustand';

export type CellType = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: CellType;
  content: string;
}

export interface CellsState {
  data: {
    [key: string]: Cell;
  };
  loading: boolean;
  error: string | null;
  order: string[];
}

interface StoreState {
  cells: CellsState;
}

type StoreActions = {
  moveCell: (id: string, direction: 'up' | 'down') => void;
  deleteCell: (id: string) => void;
  insertCellBefore: (id: string, type: CellType) => void;
  updateCell: (id: string, content: string) => void;
};

export default create<StoreState & StoreActions>((set) => ({
  cells: {
    data: {},
    loading: false,
    error: null,
    order: [],
  },
  moveCell: (id, direction) => {
    set((state) => {
      return {
        cells: { ...state.cells },
      };
    });
  },
  deleteCell: (id) => {
    set((state) => {
      return {
        cells: { ...state.cells },
      };
    });
  },
  insertCellBefore: (id, type) => {
    set((state) => {
      return {
        cells: { ...state.cells },
      };
    });
  },
  updateCell: (id, content) => {
    set((state) => {
      return {
        cells: { ...state.cells },
      };
    });
  },
}));
