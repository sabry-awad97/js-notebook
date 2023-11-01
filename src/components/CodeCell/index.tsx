import { useState } from 'react';
import { useEsbuild } from '../../bundler/hooks';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './code-cell.css';

const CodeCell = () => {
  const { isTransforming, transformCode } = useEsbuild();
  const [input, setInput] = useState('const a = 1;');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const transformedCode = await transformCode(input);
    setCode(transformedCode);
  };

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor initialValue={input} onChange={(v) => v && setInput(v)} />
        </Resizable>
        <div>
          <button onClick={onClick} disabled={isTransforming}>
            {isTransforming ? 'Transforming...' : 'Submit'}
          </button>
        </div>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
