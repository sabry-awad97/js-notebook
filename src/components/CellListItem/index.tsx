import { FC } from 'react';
import { Cell } from '../../state/cells-store';
import ActionBar from '../ActionBar';
import CodeCell from '../CodeCell';
import MarkdownEditor from '../MarkdownEditor';

interface Props {
  cell: Cell;
}

const CellListItem: FC<Props> = ({ cell }) => {
  return (
    <div>
      {cell.type === 'code' ? (
        <>
          <div className="action-bar-wrapper">
            <ActionBar id={cell.id} />
          </div>
          <CodeCell cell={cell} />
        </>
      ) : (
        <>
          <MarkdownEditor cell={cell} />
          <ActionBar id={cell.id} />
        </>
      )}
    </div>
  );
};

export default CellListItem;
