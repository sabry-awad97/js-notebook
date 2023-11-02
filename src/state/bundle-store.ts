import { create } from 'zustand';

export interface BundleState {
  [key: string]:
    | {
        loading: boolean;
        err: string;
        code: string;
      }
    | undefined;
}

interface StoreState {
  bundles: BundleState;
}

type StoreActions = {
  createBundle: (id: string, input: string) => Promise<void>;
};

const useStore = create<StoreState & StoreActions>((set) => ({
  bundles: {},
  createBundle: async (id, input) => {
    set((state) => {
      return {
        bundles: { ...state.bundles },
      };
    });
  },
}));

export default useStore;
