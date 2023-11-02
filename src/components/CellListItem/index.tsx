import { FC } from 'react';
import { Cell } from '../../state/cells-store';
import CodeCell from '../CodeCell';
import MarkdownEditor from '../MarkdownEditor';

interface Props {
  cell: Cell;
}

const CellListItem: FC<Props> = ({ cell }) => {
  return (
    <div>
      {cell.type === 'code' ? (
        <CodeCell cell={cell} />
      ) : (
        <MarkdownEditor cell={cell} />
      )}
    </div>
  );
};

export default CellListItem;
