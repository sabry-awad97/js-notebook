import { Fragment, useMemo } from 'react';
import { useCellsStore } from '../../state';
import CellListItem from '../CellListItem';

const CellList = () => {
  const {
    cells: { data, order },
  } = useCellsStore();

  const cells = useMemo(() => order.map((id) => data[id]), [order, data]);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
    </Fragment>
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
