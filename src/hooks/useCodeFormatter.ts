// useCodeFormatter.ts
import * as prettier from 'prettier';
import parser from 'prettier/parser-babel';

export const useCodeFormatter = () => {
  const formatCode = async (code: string) => {
    const formatted = await prettier.format(code, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      singleQuote: true,
    });
    return formatted.replace(/\n$/, '');
  };

  return {
    formatCode,
  };
};
