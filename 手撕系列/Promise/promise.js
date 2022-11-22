function Promise(executor) {
    //存储then的回调方法
    this.callBack = []
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
        self.callBack.forEach(item => {
            item.onResolved(data)
        })
    }

    // reject
    function reject(data) {
        if (self.PromiseState !== 'pending') {
            return;
        }
        self.PromiseState = 'rejected'
        self.PromiseResult = data
        self.callBack.forEach(item => {
            item.onRejected(data)
        })
    }

    //throw抛出异常处理
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

// 添加 .then 方法
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
        if (this.PromiseState === 'fulfilled') {
            callBack(onResolved)
        } else if (this.PromiseState === 'rejected') {
            callBack(onRejected)
        } else if (this.PromiseState === 'pending') {  // 拦截异步情况
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
// catch 方法
Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
}
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












