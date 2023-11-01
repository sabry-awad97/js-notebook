import * as esbuild from 'esbuild-wasm';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState('const a = 1;');
  const [code, setCode] = useState('');

  const [initialized, setInitialized] = useState(false);

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

    const result = await esbuild.transform(input, {
      loader: 'jsx',
      target: 'es2015',
    });

    return result.code;
  };

  const handleClick = async () => {
    const code = await transformCode(input);
    setCode(code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={handleClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
