import './App.css';

import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import { useEsbuild } from './bundler/hooks';

const App = () => {
  const { isTransforming, transformCode } = useEsbuild();
  const [input, setInput] = useState('const a = 1;');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const transformedCode = await transformCode(input);
    setCode(transformedCode);
  };

  return (
    <div>
      <CodeEditor initialValue={input} onChange={(v) => v && setInput(v)} />
      <div>
        <button onClick={() => void onClick()} disabled={isTransforming}>
          {isTransforming ? 'Transforming...' : 'Submit'}
        </button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default App;
