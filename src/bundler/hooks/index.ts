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

  const transformCode = async (input: string): Promise<string> => {
    if (!initialized) {
      return '';
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

      return result.outputFiles[0].text;
    } catch (err) {
      console.log(err);
      return '';
    } finally {
      setIsTransforming(false);
    }
  };

  return { isTransforming, transformCode };
};
