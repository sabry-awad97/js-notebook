import classNames from 'classnames';
import { FaPlus } from 'react-icons/fa';
import { useCellsStore } from '../../state';
import './add-cell.css';

interface AddCellProps {
  previousCellId: string;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({
  forceVisible = false,
  previousCellId,
}) => {
  const { insertCellAfter } = useCellsStore();

  return (
    <div
      className={classNames('add-cell', {
        'force-visible': forceVisible,
      })}
    >
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'code')}
        >
          <span className="icon is-small">
            <FaPlus />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'markdown')}
        >
          <span className="icon is-small">
            <FaPlus />
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
