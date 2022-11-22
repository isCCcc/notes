### 说明
> 该笔记文件是最近整理dom相关知识时，将先前记录的笔记进行整理打包，复制于此，
> 
> 存在一次性提交，故而无法具体查看封装的步骤，可点击先前的笔记[查看详情](https://github.com/isCCcc/dom)设计过程。

### Introduction
> 该库是我复习 DOM 时，封装的简化版的 DOM 操作库.
> 
> 使用和安装，以及 API 文档如下：

### Clone
`git clone git@github.com:isCCcc/dom.git`

### Install
`yarn install / npm i`

### Run
> parcel src/index.html

### Test
> 若有需要测试我的 API，可在 src/main.js 编写测试代码

### API
API 文档如下：

#### 增
```
dom.create('<div><span>1<span></div>')  // 用于创建节点
```           


```
dom.before(node, newNode)  // 在 node 节点之前插入节点 newNode
```         

```
dom.after(node, newNode)   // 在 node 节点之后插入节点 newNode
```            

```
dom.appemd(parent,node)    // 在指定节点之后添加一个子节点
```     

```
dom.wrap(node, parent)  // 将 node 的父节点修改为 parent
```          



#### 删
```
dom.remove(node)  // 删除指定节点 node
```      

```
dom.empty(node)   // 清空指点节点 node 里的所有子节点
```   


#### 查
```
dom.find('#testFind')[0]  // 查询 id 为 testFind 的节点，注意返回的是一个伪数组
```         

```
dom.parent(node)  // 查询 node 节点的父节点
```         

```
dom.children(node)  // 查询 node 节点的子节点
```         

```
dom.siblings(node)  // 查询 node 节点的兄弟姐妹节点
```         

```
dom.previous(node)  // 查询 node 节点的上一个节点，第一个节点返回 null
```         

```
dom.next(node)  // 查询 node 节点的下一个节点，最后一个节点返回 null
```         

```
dom.each(nodeList,fn)  // 遍历节点数组，并对每个节点执行 fn 操作
```         

```
dom.index(node)  // 查询当前节点为其父节点的第几个儿子，若没有该节点，则返回null
```         


#### 改
```
dom.attr(node, 'title')  // 读取 node 节点身上的 title 属性值                 
dom.attr(node, 'title','BlancheCC')  // 将 node 节点的 title 属性值修改为 BlancheCC           
```         

```
dom.text(node)  // 读取 node 节点的文本内容            
dom.text(node,'This is new content')  // 将 node 节点的文本内容修改为：This is new content
````          

```
dom.html(node)  //读取 node 节点的 html 内容           
dom.html(node,'<span>This is the new HTML</span>')  // 将 node 节点的 html 内容修改为：'<span>This is the new HTML</span>'
```         

``` 
dom.style(node, 'font-size', '24px');  // 将 node 节点的 font-size 属性值设置为 24px
dom.style(node, { color: 'red', border: '1px solid pink' })  // 批量设置 node 的样式
dom.style(node, 'color')  // 读取 node 节点样式的 style 属性值
```        

```
dom.class.add(node, 'test')   // 为 node 节点的类添加一个 test 值
dom.class.remove(node, 'old-class')  // 移除 node 节点类的 old-test 属性值
dom.class.has(node, 'old-class')     // 查询 node 节点类是否包含 old-test
```           

```
dom.on(node, 'click', fn)   // 为节点添加点击事件，并执行 fn 函数
dom.off(node, 'click', fn)  // 移除节点点击事件的 fn 函数
```          


