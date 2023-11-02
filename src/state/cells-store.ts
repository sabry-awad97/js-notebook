import { create } from 'zustand';
import { combine } from 'zustand/middleware';
export type CellType = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: CellType;
  content: string;
}

export interface StoreState {
  data: Record<string, Cell>;
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

const initialState = {
  data: {},
  loading: false,
  error: '',
  order: [],
};

export default create(
  combine<StoreState, StoreActions>(initialState, (set) => ({
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
    deleteCell: (id) => {
      set((state) => {
        const { [id]: _, ...data } = state.data;
        const order = state.order.filter((cellId) => cellId !== id);
        return {
          ...state,
          data,
          order,
        };
      });
    },
    moveCell: (id, direction) => {
      set((state) => {
        const currentIndex = state.order.indexOf(id);
        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= state.order.length) return state;
        const newOrder = [...state.order];
        newOrder[currentIndex] = state.order[newIndex];
        newOrder[newIndex] = id;

        return {
          ...state,
          order: newOrder,
        };
      });
    },
    insertCellBefore: (id, type) => {
      set((state) => {
        const newCell: Cell = {
          id,
          type,
          content: '',
        };

        return {
          ...state,
          data: {
            ...state.data,
            [id]: newCell,
          },
          order: [...state.order, id],
        };
      });
    },
  }))
);
