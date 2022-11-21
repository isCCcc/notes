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

### 5 - then 方法执行回调基础实现

> 1. 修改`Promise.prototype.then`方法
> 2. 传入`then(成功回调,失败回调)`,当调用then后,会判断当前`this.PromiseState`的状态,当其为成功时调用`成功回调`,失败时调用`失败回调`

```js
    //html调用----------------------------------------
let p = new Promise((resolve, reject) => {
    // resolve('OK');// reject("Error");
    throw "ERROR";
});
p.then(
    value => {
        console.log(value);
    },
    reason => {
        console.warn(reason);
    }
)
// promise.js修改与实现--------------------------------------
//添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
    //调用回调函数  PromiseState
    if (this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult);
    }
    if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult);
    }
}
```

### 6 - 异步任务 then 方法实现

> then 方法的执行始终要在执行器函数调用之后：
>
>     执行器函数内为同步代码：在then里面调用指定回调
>
>     执行器函数内为异步代码，指定回调的调用时机为状态发生改变之时

> 当前 Promise 中执行异步任务时，控制台中将没有任何输出
>
> 原因：
> Promise 中的异步任务会被放入队列中，接着执行 p.then 方法，此时PromiseState='pending',故不会执行传入 then 中的回调函数
>
> 解决办法：
> 为 Promise.prototype.then 判断当前 Promise 状态是否为 pending，若判断条件成立，则将回调函数保存在 callBack 对象里面。
>
> 当状态发生改变时，执行 callBack 中响应的回调函数

```javascript
// Promise.prototype.then 中判断当前 Promise 状态是否为 pending-----------------------------------
Promise.prototype.then = function (onResolved, onRejected) {

    //......
    //存储then的回调方法
    this.callBack = {}
    // 调用回调函数
    // 此时的 this 为实例对象 p
    // ......
    if (this.PromiseState === 'pending') {  // 拦截异步情况
        this.callBack = {onResolved, onRejected}
    }
}

//Promise 中监视当前状态是否改变，若改变，则调用 callBack 中相应的回调函数
function Promise(executor) {
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
        //调用成功的回调函数  加判断的原因是防止无回调报错
        //状态发生改变，触发异步then调用
        if (self.callBack.onResolved) {
            self.callBack.onResolved(data)
        }
    }

    // reject
    function reject(data) {
        if (self.PromiseState !== 'pending') {
            return;
        }
        self.PromiseState = 'rejected'
        self.PromiseResult = data
        if (self.callBack.onRejected) {
            self.callBack.onRejected(data)
        }
    }

    //......

}
```