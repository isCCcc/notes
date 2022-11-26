# 自定义 Vue 编码

> 本文件将尝试自行封装完成 Vue 响应式代码

## 1 - 初始结构搭建

> 在 html 中引入自定义的 Vue.js,并传入 options 参数，
> 在 Vue.js 文件中获取 el 节点和 data 数据。
>
> 接着我们接可以自定义一个模板解析器，解析html，替换 data 数据了

```javascript
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
>   - 因为我们希望在生命周期函数中使用 this 时，指向的是当前的 Vue 实例,而不是 options 对象

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