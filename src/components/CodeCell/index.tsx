import { useState } from 'react';
import { useEsbuild } from '../../bundler/hooks';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';

const CodeCell = () => {
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
        <button onClick={onClick} disabled={isTransforming}>
          {isTransforming ? 'Transforming...' : 'Submit'}
        </button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
