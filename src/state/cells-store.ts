import { create } from 'zustand';

export type CellType = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: CellType;
  content: string;
}

export interface StoreState {
  data: {
    [key: string]: Cell;
  };
  loading: boolean;
  error: string;
  order: string[];
}

type StoreActions = {
  updateCell: (id: string, content: string) => void;
  moveCell: (id: string, direction: 'up' | 'down') => void;
  deleteCell: (id: string) => void;
  insertCellBefore: (id: string, type: CellType) => void;
};

export default create<StoreState & StoreActions>((set) => ({
  data: {},
  loading: false,
  error: '',
  order: [],
  updateCell: (id, content) => {
    set((state) => {
      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            content,
          },
        },
      };
    });
  },
  moveCell: (id, direction) => {
    set((state) => {
      return {
        ...state,
      };
    });
  },
  deleteCell: (id) => {
    set((state) => {
      return {
        ...state,
      };
    });
  },
  insertCellBefore: (id, type) => {
    set((state) => {
      return {
        ...state,
      };
    });
  },
}));
