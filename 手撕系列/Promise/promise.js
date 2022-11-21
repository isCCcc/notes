// 声明 Promise 构造函数
//  注：executor 执行器行数是同步调用的
function Promise(executor) {
    //存储then的回调方法
    this.callBack = {}
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

    //throw抛出异常处理
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

// 添加 .then 方法
Promise.prototype.then = function (onResolved, onRejected) {
    // 调用回调函数
    // 此时的 this 为实例对象 p
    if (this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult)
    } else if (this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult)
    } else if (this.PromiseState === 'pending') {  // 拦截异步情况
        this.callBack = {onResolved, onRejected}
    }
}