# 自定义 Vue2 编码

> 本文件将尝试自行封装完成 Vue.js 中的`模板解析`、`生命周期`、`添加事件`、`数据劫持`、`更新视图`、`双向数据绑定`等代码编写。

## 1 - 初始结构搭建

> 在 html 中引入自定义的 Vue.js,并传入 options 参数，
> 在 Vue.js 文件中获取 el 节点和 data 数据。
>
> 接着我们接可以自定义一个模板解析器，解析html，替换 data 数据了

```html
// html 调用 -------------------------------
<body>
<div id="app">
    <h1> {{str}} </h1>
    {{str}}
    <p>{{data}}</p>
</div>

<script type="text/javascript" src="Vue.js"></script>
<script type="text/javascript">
    new Vue({
        el: '#app',
        data: {
            str: '这是 str 的内容',
            data: '这是 data 的内容'
        }
    })
</script>
</body>
```

```javascript
// Vue.js 代码实现
class Vue {
    constructor(options) {
        this.$el = document.querySelector(options.el)
        this.$data = options.data
        console.log(this.$el);
        console.log(this.$data);
    }
}
```

## 2 - 模板解析

> 自定义一个模板解析函数 complie，它的功能是操作 $el，替换其中的模板解析文本。

```javascript
// 模板解析器的编码及实现-------------------------
class Vue {
    constructor(options) {
        this.$el = document.querySelector(options.el)
        this.$data = options.data
        this.complie(this.$el)
    }

    // 模板解析器：解析根结点，将模板语法替换为 $data 中的具体数据
    complie(node) {
        node.childNodes.forEach((item, index) => {
            if (item.nodeType === 3) {        // 文本节点：替换数据
                const reg = /\{\{(.*?)\}\}/g
                item.textContent = item.textContent.replace(reg, (match, vkey) => {
                    vkey = vkey.trim()
                    return this.$data[vkey]  // 替换模板解析文本数据
                })
            } else if (item.nodeType === 1) {  // node节点：递归解析
                this.complie(item)
            }
        })
    }
}
```

## 3 - 生命周期

> 我们知道，在Vue中，生命周期的执行顺序为：
>
> beforeCreate --> created(可以访问到data数据) --> beforeMount --> mounted(可以访问到data数据和el节点)
>
> 那么。我们只需要在自定义的Vue文件中，安装特定的顺序，执行生命周期函数即可。
>
>   - 注意：在执行生命周期函数时，需要使用 bind 函数，指定 this；
>   - 因为我们希望在生命周期函数中使用 this 时，指向的是当前的 Vue 实例,而不是 options 对象。

```javascript
// html 调用--------------------------------------------
new Vue({
    el: '#app',
    data: {
        str: '这是 str 的内容',
        data: '这是 data 的内容',
    },

    beforeCreate() {
        console.log('beforeCreate', this.$data, this.$el);
    },
    created() {
        console.log('created', this.$data, this.$el);
    },
    beforeMount() {
        console.log('beforeMount', this.$data, this.$el);
    },
    mounted() {
        console.log('mounted', this.$data, this.$el);
    },
})

// Vue.js 编码--------------------------------------------
class Vue {
    constructor(options) {
        if (typeof options.beforeCreate == 'function') {
            options.beforeCreate.bind(this)()
        }
        this.$data = options.data
        if (typeof options.created == 'function') {
            options.created.bind(this)()
        }
        if (typeof options.beforeMount == 'function') {
            options.beforeMount.bind(this)()
        }
        this.$el = document.querySelector(options.el)
        this.complie(this.$el)
        if (typeof options.mounted == 'function') {
            options.mounted.bind(this)()
        }
    }

//    .....
}
```

## 4 - 添加事件

> 当我们在模板解析器中，解析到当前元素结点绑定了点击事件，那么就去执行 options 中的 methods 对应的函数即可。
>
>   - 注意：
>   - 在执行生命周期函数时，需要使用 bind 函数，指定 this；理由同[3]
>   - 在这里只实现了点击事件的编码，其他自定义事件实际上可以照葫芦画瓢，为元素结点添加对应的监听事件即可。

```html
// html 调用 -------------------------------------------------
<div id="app">
    <button @click=" btn">按钮</button>
</div>
<script type="text/javascript" src="Vue.js"></script>
<script type="text/javascript">
    new Vue({
        el: '#app',
        method: {
            btn() {
                console.log(this);
            }
        }
    })
</script>
```

```javascript
// 添加事件编码----------------------------------------------------
class Vue {
    // .......其他编码........
    // 模板解析器：解析根结点，将模板语法替换为 $data 中的具体数据
    complie(node) {
        node.childNodes.forEach((item, index) => {
            if (item.nodeType === 3) {        // 文本节点：替换数据
                // .......其他编码........
            } else if (item.nodeType === 1) {  // node节点：递归解析

                if (item.hasAttribute('@click')) {   // 若该元素节点上绑定了 click 事件
                    const vkey = item.getAttribute('@click').trim()  // 获取绑定的事件名
                    item.addEventListener('click', (event) => {
                        const eventFn = this.$options.methods[vkey].bind(this)  // 改变this指向，并执行 methods中对应的函数
                        eventFn(event)
                    })
                }

                if (item.childNodes.length > 0) {
                    this.complie(item)
                }
            }
        })
    }
}
```

## 5 - 数据劫持

> 当前代码 bug：
>   
>   - 无法在 options 配置对象中直接获取 this.data
> 
> 解：
> 
>   - 使用 Object.defineProperty 对 data 进行数据劫持，将数据挂载到 this 身上
> 
> 注：
>   - 自此完成 data 和 UI 界面的绑定

```javascript
// Vue.js 编码 -----------------------------------------------
class Vue {
    constructor(options) {
        // ......其他代码编写.....
        
        this.$data = options.data
        this.proxyData()
        
        // ......其他代码编写.....
    }

    // 为data中的每个属性添加set方法，进行数据劫持
    proxyData() {
        for (let key in this.$data) {
            console.log(key);
            Object.defineProperty(this, key, {
                get() {
                    return this.$data[key]
                },
                set(newVal) {
                    this.$data[key] = newVal
                }
            })
        }
    }

    complie(node) {
        // ......其他代码编写.....
    }
}

//html 中调用 ---------------------
new Vue({
    el: '#app',
    data:{
        str:'data1'
    },
    methods:{
        btn(){
            console.log(this.str);   // 可以直接获取到str属性
            this.str='data2'
            console.log(this.str);   // str属性正确地发生修改
        }
    }
})
```

## 6 - 更新视图

> 当前代码bug：
> 
>   - 在html页面中触发data中任意属性的set事件，数据发生变化，但页面无法更新
> 
> 分析：
>   
>   - 缺乏监听器，监听数据发生变化后，动态地更新页面
> 
> 实现思路：
> 
>1. 在解析模板时，我们动态的为每个data中的属性订阅数据，绑定监听函数;
>
>2. 创建一个 `Watch` 构造函数,用于更改视图;
>
>3. 创建 `observe` 函数，监听数据的变化，一旦数据发生改变，执行监听器中的 `update` 函数
>
> 注：
>   - 自此完成了 UI 界面和 data 之间的绑定

```javascript
class Vue {
    constructor(options) {
        // ......其他代码编写.....
        this.$watchEvent = {}
        this.observe()
        // ......其他代码编写.....
    }
    
    // ......其他代码编写.....

    // 触发data中地数据发生变化时，执行update更新视图 ---------------------------------- 要点三
    observe() {
        for (let key in this.$data) {
            const that = this
            let value = this.$data[key]
            Object.defineProperty(this.$data, key, {
                get() {
                    return value
                },
                set(newValue) {  // 数据发生变化，触发set函数，执行监听器里地update函数，更新视图
                    value = newValue
                    if (that.$watchEvent[key]) {
                        that.$watchEvent[key].forEach(item => {
                            item.update()
                        })
                    }
                }
            })
        }
    }

    // 模板解析器：解析根结点，将模板语法替换为 $data 中的具体数据
    complie(node) {
        node.childNodes.forEach(item => {
            if (item.nodeType === 3) {        // 文本节点：替换数据
                const reg = /\{\{(.*?)\}\}/g
                item.textContent = item.textContent.replace(reg, (match, vkey) => {
                    vkey = vkey.trim()
                    // 解析模板时，为每个变量订阅数据、绑定更新函数 ----------------------------- 要点一
                    if (this.hasOwnProperty(vkey)) {
                        const watcher = new Watch(this, vkey, item, 'textContent')
                        if (!this.$watchEvent[vkey]) {
                            this.$watchEvent[vkey] = []
                        }
                        this.$watchEvent[vkey].push(watcher)
                    }
                    
                    return this.$data[vkey]
                })
            } else if (item.nodeType === 1) {  // node节点：递归解析
                // ......其他代码编写.....
            }
        })
    }
}

// 用于更改视图数据 ------------------------------------------------------ 要点二
class Watch {
    constructor(vm, key, node, attr) {
        this.vm = vm
        this.key = key
        this.node = node
        this.attr = attr
    }

    // 执行更新操作
    update() {
        this.node[this.attr] = this.vm[this.key]
    }
}
```