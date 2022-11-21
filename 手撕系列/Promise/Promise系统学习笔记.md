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