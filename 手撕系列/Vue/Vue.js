class Vue {
    constructor(options) {
        if(typeof options.beforeCreate=='function'){
            options.beforeCreate.bind(this)()
        }
        this.$data = options.data
        if(typeof options.created=='function'){
            options.created.bind(this)()
        }
        if(typeof options.beforeMount=='function'){
            options.beforeMount.bind(this)()
        }
        this.$el = document.querySelector(options.el)
        this.complie(this.$el)
        if(typeof options.mounted=='function'){
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
                this.complie(item)
            }
        })
    }
}