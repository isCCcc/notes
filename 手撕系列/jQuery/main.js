// 测试

// 1、为指定选择器添加类名
const test = $('#test').addClass('red').addClass('yellow')

// 2.查找 #test2 里的 #child 元素,并为其添加类名作为区分
const test2 = $('#test2').find('.child').addClass('black')

// 3.返回到 #test2,并为其添加类名作为区分
const end = test2.end().addClass('pink')

// 4.遍历元素，并执行fn函数
test.each(($div) => { console.log($div) })

// 5.查找父节点
const parent = $('#test3').parent().addClass('parent')

// 6.查找子节点
const child = $('#test3').children().addClass('child')

// 7.查找兄弟节点
const bro = $('#test4').siblings().addClass('bro')

// 8.获取上一个节点
const pre = $('#test5').prev().addClass('pre')

// 9.获取下一个节点
const next = $('#test5').next().addClass('next')

// 10.插入节点
const insert = $('<p>hi,this is the new content</p>')
$('#test6').append(insert)

// 删除节点
const remove = $('#test7').remove()
console.log(remove)

// 清空节点的所有子元素
const empty = $('#test8').empty()
console.log(remove)

// 读取文本内容
const rt = $("#test9").text()
// 写文本内容
const wt = $("#test9").text('new')
console.log(wt)

// 事件监听
let fn = () => { console.log('事件被监听') }
$('#test10').on('click', fn)
$('#test10').off('click', fn)