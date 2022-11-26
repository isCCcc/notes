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
                    return this.$data[vkey]
                })
            } else if (item.nodeType === 1) {  // node节点：递归解析
                this.complie(item)
            }
        })
    }
}