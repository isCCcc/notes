```javascript
function Fun(age, name) {   // 构造函数
    this.age = age
    this.name = name
    return `name:${name}, age:${age}`
}

function myNew(fn, ...args) {
    // 1.创建一个空对象
    let obj = {}
    // 2.自动为这个空对象关联原型，指向其构造函数的原型
    Object.setPrototypeOf(obj, fn.prototype)
    // 3.将this做为空对象运行其构造函数
    let result = fn.apply(obj, args)
    // 4.返回this
    return result instanceof Object ? result : obj
}

//测试：
console.log(myNew(Fun, 18, 'wzx'));
```