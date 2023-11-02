import MDEditor from '@uiw/react-md-editor';
import './md-editor.css';
import { useCallback, useRef, useState, ElementRef } from 'react';
import { useEventListener } from '../../hooks/useEventListener';
import { Cell } from '../../state/cells-store';
import { useCellsStore } from '../../state';

interface Props {
  cell: Cell;
}

const MarkdownEditor: React.FC<Props> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const { updateCell } = useCellsStore();

  const documentRef = useRef(document);
  const editorRef = useRef<ElementRef<'div'>>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      event.target instanceof Node &&
      !editorRef.current?.contains(event.target)
    ) {
      setEditing(false);
    }
  }, []);

  useEventListener('click', handleClickOutside, documentRef, {
    capture: true,
  });

  return (
    <div>
      {editing ? (
        <div className="text-editor" ref={editorRef}>
          <MDEditor
            value={cell.content}
            onChange={(v) => v && updateCell(cell.id, v)}
          />
        </div>
      ) : (
        <div className="text-editor" onClick={() => setEditing(true)}>
          <div className="card-content">
            <MDEditor.Markdown source={cell.content || 'Click to edit'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
