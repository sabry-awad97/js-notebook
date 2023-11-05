import { build, initialize } from 'esbuild-wasm';
import { BundleOutput } from '../state/bundle-store';
import { fetchPlugin, unpkgPlugin } from './plugins';

let service = false;

const bundle = async (input: string): Promise<BundleOutput> => {
  if (!service) {
    service = true;
    try {
      await initialize({
        wasmURL: '/esbuild.wasm',
        worker: true,
      });
    } catch {
      service = false;
    }
  }

  try {
    const result = await build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPlugin(), fetchPlugin(input)],
      define: {
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });

    return {
      code: result.outputFiles[0].text,
      errorMessage: '',
    };
  } catch (error: any) {
    return {
      code: '',
      errorMessage: error.message,
    };
  }
};

export default bundle;
