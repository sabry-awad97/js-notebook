import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import './md-editor.css';

const MarkdownEditor: React.FC<{}> = ({}) => {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      {editing ? (
        <div>
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
