# 自定义 Promise

## Ⅰ- Promise的实例方法实现

### 1 - 初始结构搭建

> html 结构：在 html 中引入自定义的 promise，可以看到控制台中既没有报错，也没有输出

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>手撕Promise - 初始化搭建</title>
    <script src="./promise.js"></script>
</head>
<body>
<script>
    let p = new Promise((resolve, reject) => {
        resolve('OK')
    })
    p.then(value => {
        console.log(value)
    }, reason => {
        console.log(reason)
    })
</script>
</body>
</html>
```

> promise.js:将方法都挂在原型上，后续会改为 class 写法

```javascript
function Promise(executor) {
}

// 添加.then方法
Promise.prototype.then = function (onResolved, onRejected) {
}
```

### 2 - resolve 与 reject 构建与基础实现

> 1. 使用`const self = this;`保存this执行,使function中可以取得当前实例
     >
     >   ps:可以不使用该方法保存,但是下方function需要`改为箭头函数`,否则`function默认指向是window`
     >
     >   之后代码默认使用`self`保存this,箭头函数方式将在最后改为class写法时使用
>
>2. 默认设置 `PromiseState = 'pending'以及 PromiseResult = null`,这就是promise状态基础

> promise.js:resolve 与 reject 代码实现

```javascript
// 声明 Promise 构造函数
//  注：executor 执行器行数是同步调用的
function Promise(executor) {
    //添加属性
    this.PromiseState = 'pending'
    this.PromiseResult = null
    //保存实例对象的 this 指向
    const self = this

    // resolve
    function resolve(data) {
        // 1、修改对象的状态
        self.PromiseState = 'fulfilled'
        // 2、设置对象的结果值
        self.PromiseResult = data
    }

    // reject
    function reject(data) {
        self.PromiseState = 'rejected'
        self.PromiseResult = data
    }

    executor(resolve, reject)
}
```

### 3 - throw抛出异常 改变状态

> 1. 在2的基础上进行修改:将执行器放入`try-catch()`中
>2. 在catch中使用`reject()`修改 promise 对象状态为『`失败`』

```javascript
 try {
    //同步调用『执行器函数』
    executor(resolve, reject);
} catch (e) {
    //修改 promise 对象状态为『失败』
    reject(e);
}
```

### 4 - 状态只能修改一次

> 1. 基于2 3代码中resolve和reject方法进修改
>
>2. 在成功与失败函数中添加判断` if(self.PromiseState !== 'pending') return;`,如果进入函数时状态不为`pending`直接退出,这样就能做到状态只能从`pending`
    改至其他状态且做到只能改一次

> 修改 promise.js中的 resolve 和 reject 函数：

```javascript
    // resolve
function resolve(data) {
    // 判断状态
    if (self.PromiseState !== 'pending') {
        return;
    }
    // 1、修改对象的状态
    self.PromiseState = 'fulfilled'
    // 2、设置对象的结果值
    self.PromiseResult = data
}

// reject
function reject(data) {
    // 判断状态
    if (self.PromiseState !== 'pending') {
        return;
    }
    self.PromiseState = 'rejected'
    self.PromiseResult = data
}
```

> 在 html 中同时调用 resolve 和 reject 函数，发现只执行前者

```javascript
let p = new Promise((resolve, reject) => {
    resolve('OK')
    reject('error')
    // throw 'err'
})
```
