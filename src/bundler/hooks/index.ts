import * as esbuild from 'esbuild-wasm';
import { useEffect, useState } from 'react';
import { fetchPlugin, unpkgPlugin } from '../plugins';

export const useEsbuild = () => {
  const [initialized, setInitialized] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  useEffect(() => {
    const initializeEsbuild = async () => {
      if (!initialized) {
        await esbuild.initialize({
          worker: true,
          wasmURL: '/esbuild.wasm',
        });

        setInitialized(true);
      }
    };

    initializeEsbuild().catch(() => {});
  }, [initialized]);

  const transformCode = async (
    input: string
  ): Promise<{ code: string; errorMessage: string }> => {
    if (!initialized) {
      return { code: '', errorMessage: '' };
    }

    setIsTransforming(true);

    try {
      const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPlugin(), fetchPlugin(input)],
        define: {
          global: 'window',
        },
      });

      return { code: result.outputFiles[0].text, errorMessage: '' };
    } catch (err: any) {
      console.log(err);
      return { code: '', errorMessage: err.message };
    } finally {
      setIsTransforming(false);
    }
  };

  return { isTransforming, transformCode };
};
