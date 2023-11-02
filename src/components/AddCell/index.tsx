import { useCellsStore } from '../../state';

const AddCell = () => {
  const { insertCellAfter } = useCellsStore();

  return (
    <div>
      <button onClick={() => insertCellAfter('123', 'code')}>
        <span>Code</span>
      </button>
      <button onClick={() => insertCellAfter('1234', 'markdown')}>
        <span>Markdown</span>
      </button>
    </div>
  );
};

export default AddCell;
