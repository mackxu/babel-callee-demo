const apis = ['log', 'info', 'debug', 'error'];
const targetCallees = apis.map(api => `console.${api}`);

export default function consoleInsertPlugin({ types: t, template: tpl }) {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.isNew) return;
        // 通过path.get获取节点的字符串形式
        const callee = path.get('callee').toString();

        if (!targetCallees.includes(callee)) return;

        const { line, column } = path.node.loc.start;
        const newNode = tpl.expression(`console.log("filename: (${line}, ${column})")`)();
        newNode.isNew = true;
        // 如果是jsx元素，则插入到数组中
        if (path.findParent(path => path.isJSXElement())) {
          path.replaceWith(t.arrayExpression([newNode, path.node]));
          path.skip();
          return;
        }
        // 在当前节点前插入新节点
        path.insertBefore(newNode);
      }
    }
  }
};