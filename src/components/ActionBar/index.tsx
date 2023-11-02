import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import { useCellsStore } from '../../state';
import './action-bar.css';

interface Props {
  id: string;
}

const ActionBar: React.FC<Props> = ({ id }) => {
  const { moveCell, deleteCell } = useCellsStore();

  return (
    <div className="action-bar">
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'up')}
      >
        <span className="icon">
          <FaArrowUp />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'down')}
      >
        <span className="icon">
          <FaArrowDown />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => deleteCell(id)}
      >
        <span className="icon">
          <FaTimes />
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
