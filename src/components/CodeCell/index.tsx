import { useCallback, useEffect, useState } from 'react';
import { useEsbuild } from '../../bundler/hooks';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './code-cell.css';

const CodeCell = () => {
  const { transformCode } = useEsbuild();
  const [input, setInput] = useState('const a = 1;');
  const [code, setCode] = useState('');

  const createBundle = useCallback(async () => {
    const transformedCode = await transformCode(input);
    setCode(transformedCode);
  }, [input]);

  useEffect(() => {
    const timer = setTimeout(() => createBundle(), 750);

    return () => clearTimeout(timer);
  }, [input, createBundle]);

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
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
