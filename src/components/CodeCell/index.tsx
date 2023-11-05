import { useEffect } from 'react';
import CodeEditor from '../CodeEditor';
import Preview from '../Preview';
import Resizable from '../Resizable';
import './code-cell.css';
import { Cell } from '../../state/cells-store';
import { useCellsStore, usebundleStore } from '../../state';

interface Props {
  cell: Cell;
}

const CodeCell: React.FC<Props> = ({ cell }) => {
  const { updateCell } = useCellsStore();
  const { bundles, createBundle } = usebundleStore();

  const bundle = bundles[cell.id];

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cell.content);
      return;
    }

    const timer = setTimeout(createBundle, 750, cell.id, cell.content);
    return () => clearTimeout(timer);
  }, [cell.id, cell.content, createBundle]);

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
