import Editor, { OnChange } from '@monaco-editor/react';
import { FC } from 'react';
import { useCodeEditor } from '../../hooks/useCodeEditor';
import { useCodeFormatter } from '../../hooks/useCodeFormatter';
import './styles.css';

interface CodeEditorProps {
  initialValue: string;
  onChange: OnChange;
}

const CodeEditor: FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const { handleEditorDidMount, getValue, setValue } = useCodeEditor();
  const { formatCode } = useCodeFormatter();

  const handleFormat = async () => {
    const unFormatted = getValue();
    const formatted = await formatCode(unFormatted as string);
    setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={handleFormat}
      >
        Format
      </button>
      <Editor
        value={initialValue}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        height="90vh"
        language="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
