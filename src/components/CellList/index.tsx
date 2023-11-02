import { nanoid } from 'nanoid';
import { Fragment, useMemo } from 'react';
import { useCellsStore } from '../../state';
import AddCell from '../AddCell';
import CellListItem from '../CellListItem';
import './cell-list.css';

const firstCellId = nanoid();

const CellList = () => {
  const {
    cells: { data, order },
  } = useCellsStore();

  const cells = useMemo(() => order.map((id) => data[id]), [order, data]);

  const renderedCells = cells.map((cell) => {
    return (
      <Fragment key={cell.id}>
        <CellListItem cell={cell} />
        <AddCell previousCellId={cell.id} />
      </Fragment>
    );
  });

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} previousCellId={firstCellId} />
      {renderedCells}
    </div>
  );
};

export default CellList;
