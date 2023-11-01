import { useState } from 'react';
import './App.css';
import { useCodeTransformer } from './hooks/useCodeTransformer';

const App = () => {
  const [input, setInput] = useState('const a = 1;');
  const { onClick, transforming, iframeRef, srcDoc } = useCodeTransformer();

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={() => onClick(input)} disabled={transforming}>
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
