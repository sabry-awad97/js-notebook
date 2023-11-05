import { create } from 'zustand';
import bundle from '../bundler';

export interface BundleOutput {
  code: string;
  errorMessage: string;
}

export interface BundleState {
  [key: string]: (BundleOutput & { loading: boolean }) | undefined;
}

interface StoreState {
  bundles: BundleState;
}

type StoreActions = {
  startBundle: (id: string) => void;
  endBundle: (id: string, output: BundleOutput) => void;
  createBundle: (id: string, input: string) => Promise<void>;
};

const useStore = create<StoreState & StoreActions>((set, get) => ({
  bundles: {},
  startBundle: (id) => {
    set((state) => ({
      ...state,
      bundles: {
        ...state.bundles,
        [id]: { loading: true, errorMessage: '', code: '' },
      },
    }));
  },
  endBundle: (id, { code, errorMessage }) => {
    set((state) => ({
      ...state,
      bundles: {
        ...state.bundles,
        [id]: {
          loading: false,
          errorMessage,
          code,
        },
      },
    }));
  },
  createBundle: async (id, input) => {
    get().startBundle(id);
    const output = await bundle(input);
    get().endBundle(id, output);
  },
}));

export default useStore;
