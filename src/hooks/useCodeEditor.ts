import { OnMount, loader } from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { useRef, useCallback } from 'react';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import Highlighter from 'monaco-jsx-highlighter';

loader.config({
  paths: {
    vs: 'https://www.unpkg.com/monaco-editor/min/vs',
  },
});

export const useCodeEditor = () => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.getModel()?.updateOptions({ tabSize: 2 });

    // Activate Monaco JSX Highlighter
    const highlighter = new Highlighter(monaco, parse, traverse, editor);
    highlighter.highlightOnDidChangeModelContent();
    highlighter.addJSXCommentCommand();
  }, []);

  const getValue = useCallback(() => {
    if (!editorRef.current) return;
    return editorRef.current.getModel()?.getValue();
  }, []);

  const setValue = useCallback((value: string) => {
    editorRef.current?.setValue(value);
  }, []);

  return { handleEditorDidMount, getValue, setValue };
};
