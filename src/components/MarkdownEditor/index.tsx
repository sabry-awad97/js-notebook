import MDEditor from '@uiw/react-md-editor';
import './md-editor.css';
import { useCallback, useRef, useState, ElementRef } from 'react';
import { useEventListener } from '../../hooks/useEventListener';

const MarkdownEditor: React.FC<{}> = ({}) => {
  const [editing, setEditing] = useState(false);
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
        <div ref={editorRef}>
          <MDEditor />
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <MDEditor.Markdown source={'Click to edit'} />
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
