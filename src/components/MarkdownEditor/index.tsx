import MDEditor from '@uiw/react-md-editor';
import './md-editor.css';
import { useCallback, useRef, useState, ElementRef } from 'react';
import { useEventListener } from '../../hooks/useEventListener';

const MarkdownEditor: React.FC<{}> = ({}) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
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
          <MDEditor value={content} onChange={(v) => setContent(v || '')} />
        </div>
      ) : (
        <div className="text-editor" onClick={() => setEditing(true)}>
          <MDEditor.Markdown source={content || 'Click to edit'} />
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
