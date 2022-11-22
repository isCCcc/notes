window.$ = window.jQuery = function (selector) {
    let elements
    if (typeof selector === 'string') {    // 设计模式 -- 重构
        if (selector[0] === "<") {
            // 创建div
            elements = [createElement(selector)]
        } else {
            // 查询div
            elements = document.querySelectorAll(selector)
        }
    } else if (selector instanceof Array) {
        elements = selector  // 闭包，访问外界变量 elements
    }

    // 创建节点
    function createElement(string) {
        const container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
    }

    // 指定jQuery的prototype
    const api = Object.create(jQuery.prototype)
    // const api = {__proto__: jQuery.prototype}

    Object.assign(api, {
        elements: elements,
        oldApi: selector.oldApi,
    })
    // api.elements = elements
    // api.oldApi = selectorOrArrayOrTemplate.oldApi

    // 返回一个可以操作 elements 的对象的 api
    return api        // 设计模式 -- 链式操作
}

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: true,

    // 查找 #xxx 里的 #yyy 元素
    find(selector) {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            const el = Array.from(this.elements[i].querySelectorAll(selector))
            array = array.concat(el)
        }
        array.oldApi = this   // 将现阶段的 this 存储下来(旧api)
        return jQuery(array)  // 返回新的 api
    },
    // 回退到上一个操作的 api
    end() {
        return this.oldApi
    },
    // 遍历元素
    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i)
        }
        return this
    },
    // 获取父节点
    parent() {
        const array = []
        this.each((node) => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode)
            }
        })
        return jQuery(array);
    },
    // 获取子节点
    children() {
        const array = []
        this.each((node) => {
            array.push(...node.children)
        })
        return jQuery(array);
    },
    // 获取兄弟节点
    siblings() {
        const array = []
        this.each((node) => {
            array.push(...Array.from(node.parentNode.children).filter(n => n != node))
        })
        return jQuery(array);
    },
    // 获取上一个节点
    prev() {
        const array = []
        this.each((node) => {
            let flag = node.previousSibling
            while (flag && flag.nodeType === 3) {
                flag = flag.previousSibling
            }
            array.push(flag)
        })
        return jQuery(array)
    },
    // 获取下一个节点
    next() {
        const array = []
        this.each((node) => {
            let flag = node.nextSibling
            while (flag && flag.nodeType === 3) {
                flag = flag.nextSibling
            }
            array.push(flag)
        })
        return jQuery(array)
    },
    // 获取指定下标节点数组
    get(index) {
        return this.elements[index];
    },
    // 打印节点
    print() {
        console.log(this.elements)
    },


    // 将节点插入到node中
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el));
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el));
        }
    },
    // 添加节点到第一个选择器内
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children);
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i]);
            }
        } else if (children.jquery === true) {
            children.each(node => this.get(0).appendChild(node));
        }
    },

    // 删除被选元素及子元素
    remove() {
        let array = []
        for (let i = 0; i < this.elements.length; i++) {
            array.push(this.elements[i].parentNode.removeChild(this.elements[i]))
        }
        return array
    },
    // 清空元素中的子元素
    empty() {
        const array = [];
        for (let i = 0; i < this.elements.length; i++) {
            let x = this.elements[i].firstChild
            while (x) {
                array.push(this.elements[i].removeChild(this.elements[i].firstChild))
                x = this.elements[i].firstChild
            }
        }
        return array
    },

    // 读写文本内容
    text(string) {
        // 写操作：dom.text(div,'newTextContent')
        if (arguments.length === 1) {
            if ('innerText' in this.elements[0]) {
                this.elements[0].innerText = string // 兼容ie
            } else {
                this.elements[0].textContent = string
            }
        } else if (arguments.length === 0) {  // 读操作dom.text(div)
            if ('innerText' in this.elements[0]) {
                return this.elements[0].innerText
            } else {
                return this.elements[0].textContent
            }
        }
        return this.elements
    },
    // 读写 HTML 内容
    html(string) {
        if (arguments.length === 1) {
            this.elements[0].innerHTML = string
        } else if (arguments.length === 0) {
            return this.elements[0].innerHTML
        }
        return this.elements
    },
    // 读写属性
    attr(name, value) {
        if (arguments.length === 2) {
            this.elements[0].setAttribute(name, value)
        } else if (arguments.length === 1) {
            return this.elements[0].getAttribute(name)
        }
        return this.elements
    },
    // 读写 style 
    style(name, value) {
        if (arguments.length === 2) {
            // .style('font-size', '24px');
            this.elements[0].style[name] = value
        } else if (arguments.length === 1) {
            if (typeof name === 'string') {
                // .style('color')
                return this.elements[0].style[name]
            } else if (name instanceof Object) {
                // .style({ color: 'red', border: '1px solid pink' })
                for (let key in name) {
                    this.elements[0].style[key] = name[key]
                }
            }

        }
        return this.elements
    },
    // 添加类名
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className)
        }
        // 链式操作，返回对象本身
        return this
    },
    // $().on('click','li',fn)
    // 绑定事件
    on(eventName, fn) {
        this.elements[0].addEventListener(eventName, fn)
        return this.elements
    },
    // 移除事件
    off(eventName, fn) {
        this.elements[0].removeEventListener(eventName, fn)
        return this.elements
    }

}