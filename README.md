
# babel package

通过 @babel/parser、@babel/traverse、@babel/generator 来组织编译流程，
通过@babel/types 创建AST，
通过 path 的各种 api 对 AST 进行操作。通过 path.replaceWith 和 path.insertBefore 来对 AST 做插入和替换，
通过 path.findParent 来判断 AST 的父元素是否包含 JSXElement 类型的 AST

子节点的 AST 要用 path.skip 跳过遍历，
对新的 AST 做标记，可跳过对新生成的节点的处理

插件不需要调用 parse、traverse、generate 等 api，只需要提供 visitor 函数。

通过 @babel/core 的 api(`transformFileSync`) 使用了下这个插件。

1. `@babel/parser`：这是Babel的解析器，也被称为Babylon。它将源代码转换为抽象语法树（AST）。

2. `@babel/traverse`：提供了遍历AST的能力。使用它来遍历AST的节点，进行添加、更新和删除操作。这是Babel的核心部分。

3. `@babel/generator`：将AST转换回源代码

4. `@babel/types`：包含了用于AST节点的构造函数、验证器以及转换器。你可以使用它来创建、修改和检查AST节点。

5. `@babel/template`：创建AST节点的模板。使用它来编写像字符串一样的代码，然后将其转换为AST节点。这对于生成复杂的代码结构非常有用。


## path.join 与 path.resolve

在path.join()方法中，最好与__dirname变量搭配使用；
path.join()方法也是从右到左依次被解析排列组成路径的；
path.resolve与path.join的区别
结合上面两个方法的演示后的总结，它们之间的区别如下：

path.resolve()自带to参数，也就是当前输出文件的路径，而path.join()没有；
path.resolve()遇到 ' / ' 则会跳转到根目录(E:\)，path.resolve()的拼接是有盘符的；而path.join()则没效果；
path.resove()搭配__dirname变量使用时，就算__dirname在最右边，resolve()会把左边的"path"路径给覆盖掉，形成正确的路径，而path.join()正常拼接，无论对错；

```js
// 等价于path.join(__dirname, './code.js')
new URL('./code.js', import.meta.url).pathname
```

## test

```bash
npm start
npm run start:plugin
```

## 笔记
babel 编译的第一步是把源码 parse 成抽象语法树 AST （Abstract Syntax Tree），后续对这个 AST 进行转换。

语句是代码执行的最小单位，可以说，代码是由语句（Statement）构成的。

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别。

判断 AST 节点是不是某种类型要看它是不是符合该种类型的特点，比如语句的特点是能够单独执行，表达式的特点是有返回值。

Identifier,
Statement,
Declaration,
Expression,

说明符specifiers: 
ImportSpicifier、ImportDefaultSpecifier、ImportNamespaceSpcifier


callee 和 arguments，分别对应调用的函数名和参数
 