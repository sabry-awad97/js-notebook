import axios, { AxiosResponse } from 'axios';
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';

const fileCache = localForage.createInstance({ name: 'FileCache' });

export const unpkgPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
            .href,
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, (args) => ({
        path: `https://unpkg.com/${args.path}`,
        namespace: 'a',
      }));
    },
  };
};

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad(
        { filter: /.*/ },
        async (args) =>
          await fileCache.getItem<esbuild.OnLoadResult>(args.path),
      );

      build.onLoad({ filter: /.css$/ }, async (args) => {
        const response: AxiosResponse<string> = await axios.get(args.path);
        const request = response.request as { responseURL?: string };
        const escaped = response.data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        const response: AxiosResponse<string> = await axios.get(args.path);
        const request = response.request as { responseURL?: string };
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: response.data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
