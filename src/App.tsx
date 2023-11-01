import './App.css';

import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import { useCodeTransformer } from './hooks/useCodeTransformer';

const App = () => {
  const [input, setInput] = useState('const a = 1;');
  const { onClick, transforming, iframeRef, srcDoc } = useCodeTransformer();

  return (
    <div>
      <CodeEditor initialValue={input} onChange={(v) => v && setInput(v)} />
      <div>
        <button onClick={() => void onClick(input)} disabled={transforming}>
          {transforming ? 'Transforming...' : 'Submit'}
        </button>
      </div>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={srcDoc}
        title="Output"
      ></iframe>
    </div>
  );
};

export default App;
