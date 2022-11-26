class Vue {
    constructor(options) {
        this.$options=options
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

    // 模板解析器：解析根结点，将模板语法替换为 $data 中的具体数据
    complie(node) {
        node.childNodes.forEach((item, index) => {
            if (item.nodeType === 3) {        // 文本节点：替换数据
                const reg = /\{\{(.*?)\}\}/g
                item.textContent = item.textContent.replace(reg, (match, vkey) => {
                    vkey = vkey.trim()
                    return this.$data[vkey]
                })
            } else if (item.nodeType === 1) {  // node节点：递归解析

                if (item.hasAttribute('@click')) {   // 若该元素节点上绑定了 click 事件
                    const vkey = item.getAttribute('@click').trim()  // 获取绑定的事件名
                    item.addEventListener('click',(event)=>{
                        const eventFn=this.$options.methods[vkey].bind(this)  // 改变this指向，并执行 methods中对应的函数
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