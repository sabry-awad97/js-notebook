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
    const importRegex =
      /import(?:(?:(?:[ \n\t]+(?<defaultImport>[^ *\n\t\{\},]+)[ \n\t]*(?:,|[ \n\t]+))?([ \n\t]*\{(?:[ \n\t]*(?<namedImports>[^ \n\t"'\{\}]+)[ \n\t]*,?)+\})?[ \n\t]*)|[ \n\t]*\*[ \n\t]*as[ \n\t]+(?<namespaceImport>[^ \n\t\{\}]+)[ \n\t]+)from[ \n\t]*(?:['"])(?<importPath>[^'"\n]+)(['"])/g;

    const importedLibraries = new Set<string>();

    for (let c of orderedCells) {
      if (c.type === 'code') {
        const libraries = c.content.match(importRegex);

        // Check if library is not already imported
        if (libraries) {
          for (const library of libraries) {
            if (!importedLibraries.has(library)) {
              cumulativeCode.push(library);
              importedLibraries.add(library);
            }
          }
        }

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

        // Push content without libraries to avoid duplication
        const contentWithoutLibraries = c.content.replace(importRegex, '');
        cumulativeCode.push(contentWithoutLibraries);
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
