import { useMemo } from 'react';
import { useCellsStore } from '../state';
import { Cell } from '../state/cells-store';

const extractImports = (code: string) => {
  const importRegex =
    /import(?:(?:(?:[ \n\t]+(?<defaultImport>[^ *\n\t\{\},]+)[ \n\t]*(?:,|[ \n\t]+))?([ \n\t]*\{(?:[ \n\t]*(?<namedImports>[^ \n\t"'\{\}]+)[ \n\t]*,?)+\})?[ \n\t]*)|[ \n\t]*\*[ \n\t]*as[ \n\t]+(?<namespaceImport>[^ \n\t\{\}]+)[ \n\t]+)from[ \n\t]*(?:['"])(?<importPath>[^'"\n]+)(['"])/g;
  const importedLibraries = new Set();
  const libraries = code.match(importRegex);
  const cleanedContent = [];

  if (libraries) {
    for (const library of libraries) {
      if (!importedLibraries.has(library)) {
        cleanedContent.push(library);
        importedLibraries.add(library);
      }
    }
  }

  cleanedContent.push(code.replace(importRegex, ''));
  return cleanedContent.join('\n');
};

const useCumulativeCode = (currentCell: Cell) => {
  const {
    cells: { order, data },
  } = useCellsStore();

  const orderedCells = useMemo(
    () => order.map((id) => data[id]),
    [order, data]
  );

  const cumulativeCode = useMemo(() => {
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

    return extractImports(cumulativeCode.join('\n'));
  }, [orderedCells, currentCell]);

  return cumulativeCode;
};

export default useCumulativeCode;
