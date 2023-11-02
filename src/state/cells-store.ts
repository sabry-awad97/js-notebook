import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { nanoid } from 'nanoid';
export type CellType = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: CellType;
  content: string;
}

export interface CellsState {
  data: Record<string, Cell>;
  loading: boolean;
  error: string;
  order: string[];
}

export interface StoreState {
  cells: CellsState;
}

type StoreActions = {
  updateCell: (id: string, content: string) => void;
  moveCell: (id: string, direction: 'up' | 'down') => void;
  deleteCell: (id: string) => void;
  insertCellAfter: (id: string, type: CellType) => void;
};

const initialState = {
  cells: {
    data: {},
    loading: false,
    error: '',
    order: [],
  },
};

export default create(
  combine<StoreState, StoreActions>(initialState, (set) => ({
    updateCell: (id, content) => {
      set((state) => {
        return {
          cells: {
            ...state.cells,
            data: {
              ...state.cells.data,
              [id]: {
                ...state.cells.data[id],
                content,
              },
            },
          },
        };
      });
    },
    deleteCell: (id) => {
      set((state) => {
        const { [id]: _, ...data } = state.cells.data;
        const order = state.cells.order.filter((cellId) => cellId !== id);
        return {
          cells: {
            ...state.cells,
            data,
            order,
          },
        };
      });
    },
    moveCell: (id, direction) => {
      set((state) => {
        const currentIndex = state.cells.order.indexOf(id);
        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= state.cells.order.length) return state;

        const newOrder = [...state.cells.order];
        newOrder[currentIndex] = state.cells.order[newIndex];
        newOrder[newIndex] = id;

        return {
          cells: {
            ...state.cells,
            order: newOrder,
          },
        };
      });
    },
    insertCellAfter: (id, type) => {
      set((state) => {
        const newId = nanoid();
        const newCell: Cell = {
          id: newId,
          type,
          content: '',
        };

        const currentIndex = state.cells.order.indexOf(id);

        const newOrder =
          // If the cell is the last one, simply append the new cell to the end
          currentIndex === state.cells.order.length - 1
            ? [...state.cells.order, newId]
            : // If the cell is in the middle, insert the new cell after it
            currentIndex >= 0
            ? [
                ...state.cells.order.slice(0, currentIndex + 1),
                newId,
                ...state.cells.order.slice(currentIndex + 1),
              ]
            : // If the cell is not found, insert it at the beginning
              [newId, ...state.cells.order];

        return {
          cells: {
            data: {
              ...state.cells.data,
              [newId]: newCell,
            },
            loading: state.cells.loading,
            error: state.cells.error,
            order: newOrder,
          },
        };
      });
    },
  }))
);
