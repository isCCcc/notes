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
<<<<<<< HEAD
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

### 7 - 指定多个回调

> 1. 基于6代码进行修改 只展示修改部分代码
>
>2. `6`中保存回调函数的方式有BUG,如果我有多个`.then()`,后面加载的回调函数会覆盖之前的回调函数,导致最后回调函数`有且只有`最后一个
    >
    >   解:使用`数组`的方式进行存储回调函数,调用时也是用数组循环取出
>
>3. 此处的then`仍有瑕疵`,需要继续完善

```javascript
// html调用-----------------------------------------------------------------------
p.then(value => {
    console.log(value)
}, reason => {
    console.warn(reason)
})
p.then(value => {
    alert(value);
}, reason => {
    alert(reason);
});

// promise.js 修改-----------------------------------------------------------------
function Promise(executor) {
    //存储then的回调方法
    this.callBack = []  // 修改一 -------------
    //添加属性
    this.PromiseState = 'pending'
    this.PromiseResult = null
    //保存实例对象的 this 指向
    const self = this

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
        self.callBack.forEach(fn => {   // 修改二 -------------
            fn.onResolved(data)
        })
    }

    // reject
    function reject(data) {
        if (self.PromiseState !== 'pending') {
            return;
        }
        self.PromiseState = 'rejected'
        self.PromiseResult = data
        self.callBack.forEach(fn => {
            fn.onRejected(data)
        })
    }

    //......
}

Promise.prototype.then = function (onResolved, onRejected) {
    // 调用回调函数
    // 此时的 this 为实例对象 p
    if (this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult)
    } else if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult)
    } else if (this.PromiseState === 'pending') {  // 拦截异步情况
        this.callBack.push({onResolved, onRejected})  // 修改三 ------------
    }
}
```

### 8 - 同步任务 then 返回结果

>1. 在之前的then运行结果中得知,我们使用  [ then ] 后的返回结果是其回调函数的返回结果,而我们需要的返回结果是一个新的promise对象
> 
> 解:所以我们在then中`return new Promise()`,使其得到的是一个新的promise对象
> 
>2. 在为`解决问题1`后产生一个新问题:新的promise对象因为没有用`rejerect与resolve`方法,导致返回的状态一直是`pending`
> 
> 解:在新的promise中判断`运行回调函数`后的返回值是什么,然后根据其不同类型给其赋予不同状态
> 
> ​	Ⅰ-`if(result instanceof Promise)`:返回值一个新的②promise对象(因为是新的promise的回调函数返回值,称`②promise对象`),在返回值(因为是promise对象)的`.then()`回调函数中使用rejerect与resolve方法,将其`自身的状态`赋予外层的promise,
> 
> ​	即 回调函数中的promise 赋值 给then返回值 ,  所以 `最终返回状态==回调函数中的新promise状态`
> 
> ​	Ⅱ-如果返回值是一个`非promise`对象,返回状态设置为成功
> 
> ​	Ⅲ-如果返回值是一个异常,返回状态设置为失败

```javascript
// 添加 .then 方法
Promise.prototype.then = function (onResolved, onRejected) {
    const self = this
    // 返回一个全新的 Promise 对象
    // 该 Promise 的状态由回调函数的返回值状态决定
    return new Promise((resolve, reject) => {   // 修改一 --------------------------
        //封装callBack函数，用于处理返回值的状态和返回值
        function callBack(type) {   // 修改二 --------------------------
            try {
                let result = type(self.PromiseResult)
                if (result instanceof Promise) {  // 如果返回值是一个 Promise，则一定可以调用then方法
                    result.then(v => resolve(v), r => reject(r))
                } else {  // 返回一个普通 对象 / 值，则直接返回一个成功的 Promise
                    resolve(result)
                }
            } catch (e) {
                reject(e)
            }
        }

        // 调用回调函数
        // 此时的 this 为实例对象 p
        if (this.PromiseState === 'fulfilled') {
            callBack(onResolved)  // 修改三 --------------------------
        } else if (this.PromiseState === 'rejected') {
            callBack(onRejected)
        } else if (this.PromiseState === 'pending') {  // 拦截异步情况
            this.callBack.push({onResolved, onRejected})
        }
    })
}
```

### 9 - 异步任务 then 返回结果

>1. 异步任务是修改`if(this.PromiseState === 'pending')`后面的值,原因参考`6`,下面代码只举例这部分修改
>
>2. 因为我们需要增加then状态修改,所以在我们保存回调函数这一步我们可以对于回调函数进行`加工`,`添加判断其回调函数的返回值`的代码块再存入实例的回调函数中
> 
> Ⅰ-声明一个新的函数:其内部功能->先运行`onResolved回调函数`,再将其返回值取出,进行判断其返回值(这个过程同`8`>
> Ⅱ-加工后存入实例回调函数数组,之后在`resolve与reject`方法中调用即可(同`6`)

```javascript
Promise.prototype.then = function (onResolved, onRejected) {
    const self = this
    // 返回一个全新的 Promise 对象
    // 该 Promise 的状态由回调函数的返回值状态决定
    return new Promise((resolve, reject) => {
        //封装callBack函数，用于处理返回值的状态和返回值
        function callBack(type) {
            try {
                let result = type(self.PromiseResult)
                if (result instanceof Promise) {  // 如果返回值是一个 Promise，则一定可以调用then方法
                    result.then(v => resolve(v), r => reject(r))
                } else {  // 返回一个普通 对象 / 值，则直接返回一个成功的 Promise
                    resolve(result)
                }
            } catch (e) {
                reject(e)
            }
        }

        // 调用回调函数
        // 此时的 this 为实例对象 p
        // ...
        if (this.PromiseState === 'pending') {  // 拦截异步情况
            this.callBack.push({
                onResolved:function (){
                    callBack(onResolved)
                },
                onRejected:function (){
                    callBack(onRejected)
                }
            })
        }
    })
}
```

### 10 - catch 方法与异常穿透与值传递

>1. 异常穿透:添加`catch 方法 `,并且需要进行回调函数为`undefined`的处理
>
>2. 当前代码中`then()`方法中若只传一个回调或者不传回调函数时,运行代码会报错,因为运行时调用的回调函数是`undefined`
>
> 解:进行回调函数判断,当其为空时,基于默认回调函数内容:`直接往外抛出`这样下方的`then() or catch()`就可以承接到异常或者值


```javascript
//html 调用---------------------------------------
//实例化对象
let p = new Promise((resolve, reject) => {
    setTimeout(() => {reject('OK'); }, 1000);
});
//值传递
let res=p.then()
    .then(value => {console.log(222);})
    .then(value => {console.log(333);})
    .catch(reason => {console.warn(reason);});
console.log(res);

// promise.js 修改-------------------------------------------
Promise.prototype.then = function (onResolved, onRejected) {
    if (typeof onResolved !== 'function') {
        // 这里的 value 实际上只是一个形参，真正的值是在状态改变时，调用该回调函数传入的 data
        onResolved = value => value
    }
    if (typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason
        }
    }
    // ...
}
Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
}
```