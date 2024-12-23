import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import generate from "@babel/generator";
import tpl from "@babel/template";
import * as t from "@babel/types";

const traverse = _traverse.default;

const code = `
  console.log(1);
  function func() {
    console.info(2);
  }
  export default class Aaa {
    say() {
      console.debug(3);
    }
    render() {
      return (
        <div>{console.error(4)}</div>
      );
    }
  }
`;

const ast = parse(code, {
  sourceType: "module",
  plugins: [
    "jsx"
  ]
});

const apis = ['log', 'info', 'debug', 'error'];

// traverse(ast, {
//   CallExpression(path) {
//     const { node: { callee } } = path;
//     if (t.isMemberExpression(callee) && callee.object.name === 'console' && apis.includes(callee.property.name)) {
//       const { line, column } = path.node.loc.start;
//       path.node.arguments.unshift(t.stringLiteral(`filename: (${line}, ${column})`));
//     }
//   }
// });

// traverse(ast, {
//   CallExpression(path) {
//     console.log(path, 1111);
//     // 通过path.get获取节点的字符串形式
//     const callee = path.get('callee').toString();

//     const targetCallees = apis.map(api => `console.${api}`);
//     if (targetCallees.includes(callee)) {
//       const { line, column } = path.node.loc.start;
//       path.node.arguments.unshift(t.stringLiteral(`filename: (${line}, ${column})`));
//     }
//   }
// });

traverse(ast, {
  CallExpression(path) {
    if (path.node.isNew) return;
    // 通过path.get获取节点的字符串形式
    const callee = path.get('callee').toString();
    const targetCallees = apis.map(api => `console.${api}`);
    if (targetCallees.includes(callee)) {
      const { line, column } = path.node.loc.start;
      const newNode = tpl.expression(`console.log("filename: (${line}, ${column})")`)();
      newNode.isNew = true;
      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(t.arrayExpression([newNode, path.node]));
        path.skip();
        return;
      }
      // 在当前节点前插入新节点
      path.insertBefore(newNode);
    }
  }
})

const output = generate.default(ast);
console.log(output.code);