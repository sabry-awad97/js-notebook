import { useEffect } from 'react';
import { useCellsStore, usebundleStore } from '../../state';
import { Cell } from '../../state/cells-store';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './code-cell.css';
import useCumulativeCode from '../../hooks/useCumulativeCode';

interface Props {
  cell: Cell;
}

const CodeCell: React.FC<Props> = ({ cell }) => {
  const { updateCell } = useCellsStore();
  const { bundles, createBundle } = usebundleStore();
  const bundle = bundles[cell.id];

  const cumulativeCode = useCumulativeCode(cell);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(createBundle, 750, cell.id, cumulativeCode);
    return () => clearTimeout(timer);
  }, [cell.id, cumulativeCode]);

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
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} errorMessage={bundle.errorMessage} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
