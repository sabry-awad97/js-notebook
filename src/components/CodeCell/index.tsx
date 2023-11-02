import { useCallback, useEffect, useState } from 'react';
import { useEsbuild } from '../../bundler/hooks';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './code-cell.css';
import { Cell } from '../../state/cells-store';
import { useCellsStore } from '../../state';

interface Props {
  cell: Cell;
}

const CodeCell: React.FC<Props> = ({ cell }) => {
  const { transformCode } = useEsbuild();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { updateCell } = useCellsStore();

  const createBundle = useCallback(async () => {
    const output = await transformCode(cell.content);
    setCode(output.code);
    setErrorMessage(output.errorMessage);
  }, [cell.content]);

  useEffect(() => {
    const timer = setTimeout(() => createBundle(), 750);

    return () => clearTimeout(timer);
  }, [cell.content, createBundle]);

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
          <CodeEditor
            initialValue={cell.content}
            onChange={(v) => v && updateCell(cell.id, v)}
          />
        </Resizable>
        <div className="progress-wrapper">
          <Preview code={code} errorMessage={errorMessage} />
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
