import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

// HIGHLY experimental code to investigate babel jsx

const updateElementText = ({ lineNumber, columnNumber, text, code }) => {
  if (!text) {
    return code;
  }

  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  traverse(ast, {
    enter(path) {
      const nodeLineNumber = path.node.loc?.start.line;
      const nodeColumnNumber = path.node.loc?.start.column;

      if (
        path.isJSXElement() &&
        nodeLineNumber === lineNumber &&
        nodeColumnNumber === columnNumber
      ) {
        const child = path.node.children[0];

        // Only update simple text for now
        if (path.node.children.length === 1 && t.isJSXText(child)) {
          path.node.children[0] = t.jsxText(text);
        }
      }
    },
  });

  return generate(ast).code;
};

export default updateElementText;
