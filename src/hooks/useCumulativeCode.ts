import { useMemo } from 'react';
import { useCellsStore } from '../state';
import { Cell } from '../state/cells-store';

const useCumulativeCode = (currentCell: Cell) => {
  const {
    cells: { order, data },
  } = useCellsStore();

  const orderedCells = useMemo(
    () => order.map((id) => data[id]),
    [order, data]
  );

  const cellContent = useMemo(() => {
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === currentCell.id) {
          cumulativeCode.push(`
            import _React from 'react';
            import _ReactDOM from 'react-dom/client';
            
            var show = (value) => {
              const rootElement = document.querySelector('#root');
              const root = _ReactDOM.createRoot(rootElement);

              if (typeof value === 'object') {
                if (value.$$typeof && value.props) {
                  root.render(value);
                } else {
                  rootElement.innerHTML = JSON.stringify(value);
                }
              } else {
                rootElement.innerHTML = value;
              }
            };
          `);
        } else {
          cumulativeCode.push('var show = () => {}');
        }
        cumulativeCode.push(c.content);
      }

      if (c.id === currentCell.id) {
        break;
      }
    }

    return cumulativeCode.join('\n');
  }, [orderedCells, currentCell]);

  return cellContent;
};

export default useCumulativeCode;
