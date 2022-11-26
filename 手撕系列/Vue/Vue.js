class Vue {
    constructor(options) {
        this.$options = options
        this.$watchEvent = {}
        if (typeof options.beforeCreate == 'function') {
            options.beforeCreate.bind(this)()
        }
        this.$data = options.data
        this.proxyData()
        this.observe()
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

    // 为data中的每个属性添加set方法，进行数据劫持
    proxyData() {
        for (let key in this.$data) {
            console.log(this);
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

    // 触发data中地数据发生变化时，执行update更新视图
    observe() {
        for (let key in this.$data) {
            const that = this
            let value = this.$data[key]
            Object.defineProperty(this.$data, key, {
                get() {
                    return value
                },
                set(newValue) {
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
                    // 解析模板时，为每个变量订阅数据、绑定更新函数
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
                // 若该元素节点上绑定了 click 事件
                if (item.hasAttribute('@click')) {
                    const vkey = item.getAttribute('@click').trim()  // 获取绑定的事件名
                    item.addEventListener('click', (event) => {
                        const eventFn = this.$options.methods[vkey].bind(this)  // 改变this指向，并执行 methods中对应的函数
                        eventFn(event)
                    })
                }
                // 该元素若绑定了v-model，则绑定input事件，实现双向数据绑定
                if (item.hasAttribute('v-model')) {
                    const vkey = item.getAttribute('v-model').trim()  // 获取绑定的事件名
                    if(this.hasOwnProperty(vkey)){
                        item.value=this.$data[vkey]
                    }
                    item.addEventListener('input',(e)=>{
                        this[vkey]=item.value
                    })
                }
                // 该元素为结点元素，继续递归解析
                if (item.childNodes.length > 0) {
                    this.complie(item)
                }
            }
        })
    }
}

// 用于更改视图数据
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