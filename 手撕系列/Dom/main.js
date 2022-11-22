// 测试代码


// create 测试
const div = dom.create('<div><span>1<span></div>')
console.log(div)
// before 测试
dom.before(node, dom.create('<div>newNode-before</div>'))
// after 测试
dom.after(node, dom.create('<div>newNode-after</div>'))
// wrap 测试
dom.wrap(nodeparent, dom.create('<div id="new-parent"></div>'))


// empty 测试
const empty = dom.empty(window.nodeempty)
console.log(empty)


// attr 测试
const title = dom.attr(window.nodetitle, 'title', 'blanchecc')
console.log(`title:${dom.attr(window.nodetitle, 'title')}`)
// text 测试
const readme = window.readme;
console.log(dom.text(readme))
dom.text(readme, 'This is the new content');
console.log(dom.text(readme))
// html 测试
const readhtml = window.readhtml
console.log(dom.text(readhtml))
dom.html(readhtml, '<span>This is the new HTML</span>');
console.log(dom.text(readhtml))
// style 测试
const style = window.teststyle
dom.style(style, 'font-size', '24px');
dom.style(style, { color: 'red', border: '1px solid pink' })
console.log(dom.style(style, 'color'))
// class 测试
const testclass = window.testclass;
dom.class.add(testclass, 'test')
dom.class.remove(testclass, 'old-class')
console.log(dom.class.has(testclass, 'old-class'))
// 事件监听 测试
const testListener = window.testListener;
fn = () => {
    console.log('事件被监听了')
}
dom.on(testListener, 'click', fn)
dom.off(testListener, 'click', fn)


// find 测试
const testFind = dom.find('#testFind')[0]
console.log(testFind)
const findSpan = dom.find('#findSpan', testFind)[0]
console.log(findSpan)
// parent 测试
console.log(dom.parent(dom.find('#itselft')[0]))
// children 测试
console.log(dom.children(dom.find('#testRelation')[0]))
// siblings 测试
console.log(dom.siblings(dom.find('#itselft')[0]))
// previous 测试
console.log(dom.previous(dom.find('#itselft')[0]))
// next 测试
console.log(dom.next(dom.find('#itselft')[0]))
// each 测试
dom.each(dom.children(dom.find('#testRelation')[0]), (node) => { console.log(node) })
// index 测试
console.log(dom.index(dom.find('#itselft')[0])) // 1
console.log(dom.index(dom.find('#itsft')[0]))   // 查无此节点