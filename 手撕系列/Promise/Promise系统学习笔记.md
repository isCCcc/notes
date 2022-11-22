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
<
<
<
<
<
<
< HEAD
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

> 1. 在之前的then运行结果中得知,我们使用  [ then ] 后的返回结果是其回调函数的返回结果,而我们需要的返回结果是一个新的promise对象
>
> 解:所以我们在then中`return new Promise()`,使其得到的是一个新的promise对象
>
>2. 在为`解决问题1`后产生一个新问题:新的promise对象因为没有用`rejerect与resolve`方法,导致返回的状态一直是`pending`
>
> 解:在新的promise中判断`运行回调函数`后的返回值是什么,然后根据其不同类型给其赋予不同状态
>
> ​ Ⅰ-`if(result instanceof Promise)`:返回值一个新的②promise对象(因为是新的promise的回调函数返回值,称`②promise对象`),在返回值(因为是promise对象)的`.then()`
> 回调函数中使用rejerect与resolve方法,将其`自身的状态`赋予外层的promise,
>
> ​ 即 回调函数中的promise 赋值 给then返回值 , 所以 `最终返回状态==回调函数中的新promise状态`
>
> ​ Ⅱ-如果返回值是一个`非promise`对象,返回状态设置为成功
>
> ​ Ⅲ-如果返回值是一个异常,返回状态设置为失败

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

> 1. 异步任务是修改`if(this.PromiseState === 'pending')`后面的值,原因参考`6`,下面代码只举例这部分修改
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
        function callBack(type) {  //作用是返回一个Promis对象
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
                onResolved: function () {
                    callBack(onResolved)
                },
                onRejected: function () {
                    callBack(onRejected)
                }
            })
        }
    })
}
```

### 10 - catch 方法与异常穿透与值传递

> 1. 异常穿透:添加`catch 方法 `,并且需要进行回调函数为`undefined`的处理
>
>2. 当前代码中`then()`方法中若只传一个回调或者不传回调函数时,运行代码会报错,因为运行时调用的回调函数是`undefined`
>
> 解:进行回调函数判断,当其为空时,基于默认回调函数内容:`直接往外抛出`这样下方的`then() or catch()`就可以承接到异常或者值

```javascript
//html 调用---------------------------------------
//实例化对象
let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('OK');
    }, 1000);
});
//值传递
let res = p.then()
    .then(value => {
        console.log(222);
    })
    .then(value => {
        console.log(333);
    })
    .catch(reason => {
        console.warn(reason);
    });
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

## Ⅱ-Promise的静态方法实现

### 1 - Promise.resolve 封装

> 1. 判断传入的参数是否为`promise对象`:
>
> Ⅰ-如果为`promise`:将其状态与结果赋值给外层promise对象
>
> Ⅱ-如果为`非promise`:状态设置为成功

```javascript
//html调用----------------------------------------------
<script>
    //实例化对象
    let p = Promise.resolve(123)
    console.log(p);

    let p2 = Promise.resolve(new Promise((res,rej)=>{
    res('OK')
}))
    console.log(p2);
</script>

// Promise.resolve() 的封装代码--------------------------------------------
//resolve
Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(v => {
                resolve(v)
            }, r => {
                reject(r)
            })
        } else {
            resolve(value)
        }
    })
}
```

### 2 - Promise.reject 封装

> 不同于resolve,这个方法只要把传入参数再次传出去,并将状态改为`失败`即可

```js
// html调用------------------------------------------------------------  
let p = Promise.reject(123)
console.log(p);

let p2 = Promise.reject(new Promise((res, rej) => {
    res('OK')
}))
console.log(p2);

// promise.js修改与实现-----------------------------------------------------
//添加 reject 方法
Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
```

### 3 - Promise.all 封装

> 1. 遍历传入的promise数组,每当遍历结果是成功,则用计数器记录,当计数器等同于数组长度,则全部成功,这时候可以返回`成功`状态
> 2. 如果当数组中任意一个promise的执行结果是`reject`,直接中断,返回状态为`失败`

```javascript
// html调用------------------------------------------------------------  
//实例化对象
let p = Promise.resolve(123)
let p2 = Promise.resolve(new Promise((res, rej) => {
    setTimeout(() => {
        res('OK')
    })
}))
let p3 = Promise.resolve('nonono')
let res = Promise.all([p, p2, p3])
console.log(res);

// promise.js修改与实现-----------------------------------------------------
//all
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0
        let result = []
        for (let i in promises) {
            promises[i].then(v => {
                count++
                result[i] = v
                if (count === promises.length) {
                    resolve(result)
                }
            }, r => {
                // 如果 promise 中有一个失败状态，直接设置Promise的状态为失败
                // 后续的promies 实际上是会再次调用的，但不会再修改 Promise 的状态
                //      （在 res / rej 中有检测当前状态是否为 pending）
                reject(r)
            })
        }
    })
}
```

### 4 - Promise.race 封装

> 谁先执行，谁的返回结果就影响当前 Promise 的返回结果

```javascript
// html调用------------------------------------------------------------  
//实例化对象
let p2 = Promise.resolve(new Promise((res, rej) => {
    setTimeout(() => {
        res('OK')
    })
}))
let p3 = Promise.resolve('nonono')
let res = Promise.all([p2, p3])
console.log(res);

// promise.js修改与实现-----------------------------------------------------
//race
Promise.race = function (promises) {
    return new Promise((res, rej) => {
        for (let i in promises) {
            promises[i].then(v => {
                res(v)
            }, r => {
                rej(r)
            })
        }
    })
}
```

### 5 - Promise.then 方法回调的异步执行

> 1. 如果我们运行下面代码,正确顺序是: 111 --> 333 -->444
>
>```js
>  let p1 = new Promise((resolve, reject) => {
>      reject('OK');
>      console.log(111);
>    });
>
>    p1.then(value => {
>      console.log(222);
>    }, reason => {
>      console.log(444);
>    });
>
>    console.log(333);
>```
>
>2. 但当我们运行之前封装的 **Promise** 代码时,结果却是:111 --> 444 --> 333
    >
    >   我们需要将我们的then方法变成`异步方法`
>
>3. 我们只要在以下四处地方的`回调函数调用`外层包裹一层定时器(不一定是定时器,开启异步即可),即可做到异步操作
>
>```js
>
> function resolve(data){
>        setTimeout(() => { self.callbacks.forEach(item => { item.onResolved(data); }); });--修改1
>    }
>   //reject 函数
>    function reject(data){
>        setTimeout(() => { self.callbacks.forEach(item => { item.onRejected(data); }); });---修改2
>    }
>
>//添加 then 方法
>Promise.prototype.then = function(onResolved, onRejected){
>    return new Promise((resolve, reject) => {
>        //调用回调函数  PromiseState
>       /*  修改前代码
>       if (this.PromiseState === 'fulfilled') { callback(onResolved); }
>   		if (this.PromiseState === 'rejected') { callback(onRejected);
>   		 */
>        if(this.PromiseState === 'fulfilled'){setTimeout(() => { callback(onResolved);});}  -----修改3
>        if(this.PromiseState === 'rejected'){ setTimeout(() => { callback(onRejected);});   ---修改4
>        }
>    }
>
>```
>
>4. `相关原理参照js事件循环机制、宏任务与微任务`

### 6 - Class 版本的实现

> 1. 将原先在构造函数中封装的所有变量和方法放进类的构造函数中
> 2. 将实例上的方法直接放进类里
> 3. 将类身上的属性放进类里，并使用关键字 static 修饰，表明这是一个静态方法，属于类本身，而不属于实例对象

> Class 版本完整代码：

```javascript
class Promise {
    //构造器函数
    constructor(executor) {
        //存储then的回调方法
        this.callBack = []
        //添加属性
        this.PromiseState = 'pending'
        this.PromiseResult = null
        //保存实例对象的 this 指向
        const self = this

        // resolve
        function resolve(data) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

        // reject
        function reject(data) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}
            
        //throw抛出异常处理
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    // 添加 .then 方法
    then(onResolved, onRejected) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

    // 添加 catch 方法
    catch(onRejected) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

    //resolve
    static resolve(value) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

    //reject
    static reject(reason) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

    //all
    static all(promises) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}

    //race
    static race(promises) { /*  完整代码可查看 手撕系列/Promise/class版本/promise.js  */}
        
    }
```


# Promise+ async + await 

>##### 							1)Promise==>异步
>
>##### 							2)await==>异步转同步
>
>1. await 可以理解为是 async wait 的简写。await 必须出现在 async 函数内部，不能单独使用。
>2. await 后面可以跟任何的JS 表达式。虽然说 await 可以等很多类型的东西，但是它最主要的意图是用来等待 Promise 对象的状态被 resolved。如果await的是 promise对象会造成异步函数停止执行并且等待 promise 的解决,如果等的是正常的表达式则立即执行		
>
>##### 							3)async==>同步转异步
>
>1.    方法体内部的某个表达式使用await修饰，那么这个方法体所属方法必须要用async修饰所以使用awit方法会自动升级为异步方法
>
>###### 4)mdn文档
>
>1. [async](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 
>2. [await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)

## Ⅰ-async函数

>1. 函数的返回值为 promise 对象 
>2. promise 对象的结果由 async 函数执行的返回值决定

## Ⅱ-await表达式

>1. await 右侧的表达式一般为 promise 对象, 但也可以是其它的值 
>
>2. 如果表达式是 promise 对象, await 返回的是 promise 成功的值 
>3. 如果表达式是其它值, 直接将此值作为 await 的返回值

## Ⅲ-注意

>1. await 必须写在 async 函数中, 但 async 函数中可以没有 await 
>2. 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理

## Ⅳ-自己对某些问题理解解答

### 1、如何在Promise外部使用Promise的结果

>用到的本章节知识:
>
>1、axios本质上就是一个promise,所以下面用定时器+Promise模拟axios,效果一样,可以将`new Promise(resolve => {setTimeout(function() { resolve("promise普通结果"); }, 1000); })`等价于`axios({})`
>
>2、resolve() 与reject()是修改Promise状态并往外抛出的,一个Promise只能改变一次状态,所以一个primise中只能调用一次
>
>3、 上一步抛出后可以在下面 的.then()中获取到
>
>   Ⅰ-如果没有用.then(),则值会抛往Promise外部
>
>   Ⅱ-如果声明了.then(),则值会被.then()接住,放到里面处理,如果需要再次抛出--`某些业务场景需要` ,然后在下一个then()或者外部使用, 则可以 .then(v=>return v) ---前提这个链式调用前曾使用过resolve() 与reject()才用return,不然就用这两个resolve() 与reject()
>
>```js
>//讲解时写的简单demo
>let resolveCommon = ()=> {
>  let result="普通promise初始值"
>   result=new Promise(resolve => {setTimeout(function() { resolve("promise普通结果"); }, 1000); })
>  console.log(result)
>  //打印结果: Promise { <pending> } 
>};
>let resolveAsync=async ()=> {
>  let result="await+async的promise初始值"
>   result=await new Promise(resolve => { setTimeout(function() { resolve("这是async+await结果"); }, 1000);})
>  console.log(result)
>  //打印结果: 这是async+await结果  这里就是正确的值,你可以在下一步进行正常使用,也可以用在下一步的promise中
>  //------------------------------------------------------
>  //在第二个promise中调用使用
>  let result2=""
>  result2= await new Promise(resolve => { setTimeout(function() { resolve(result+"+经过第二个promise加工"); }, 1000);})
>  .then(v=>{
>    console.log("第二个promise的then()中打印并返回:",v)
>    return v+",经过then()加工返回"
>  })
>  console.log("最终结果:第二个promise外部结果打印,",result2)
>  //---------------------------------------------
>};
>resolveCommon()  //调用普通promise函数
>resolveAsync()    //调用await+async
>/**
> 运行结果
> 1.resolveCommon() 运行结果:    Promise { <pending> }
> 2.resolveAsync() 运行结果:     
>  这是async+await结果
>  第二个promise的then()中打印并返回: 这是async+await结果+经过第二个promise加工
>  最终结果:第二个promise外部结果打印, 这是async+await结果+经过第二个promise加工,经过then()加工返回
>*/
>```
>
>原因解析:
>
>1. new Promise()是一个异步任务,会加到异步队列中,而正常运行比如console.log()是同步运行的(即从上往下运行),会加到同步队列 
>
>   所以 Promise()通常是会在同一等级的同步任务之后才得到结果的 所以你得到的是一个挂起的 Promise { <pending> } 对象
>
>2. 而await则是让跟在后面的异步任务转为同步任务(效果如此,就通俗来讲,具体概念需要自学),所以result就能得到一个已经修改状态为成功或者失败的值
>
>   所以下面的任务就可以使用到这个值
>
>3. 为什么这些操作要放在同一个async fn()=>{} 中?
>
>  1)Promise==>异步
>
>  2)await==>异步转同步
>
>   1. await 可以理解为是 async wait 的简写。await 必须出现在 async 函数内部，不能单独使用。
>
>   2. await 后面可以跟任何的JS 表达式。虽然说 await 可以等很多类型的东西，但是它最主要的意图是用来等待 Promise 对象的状态被 resolved。如果await的是 promise对象会造成异步函数停止执行并且等待 promise 的解决,如果等的是正常的表达式则立即执行  
>
>  3)async==>同步转异步
>
>   方法体内部的某个表达式使用await修饰，那么这个方法体所属方法必须要用async修饰所以使用awit方法会自动升级为异步方法





