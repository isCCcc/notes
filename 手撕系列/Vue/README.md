# 自定义 Vue 响应式编码

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