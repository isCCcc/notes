var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号如 \nnode server.js 8888 ')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method




    console.log('后台收到一个请求，路径（带查询参数）为：' + pathWithQuery)


    response.statusCode = 200

    // 获取请求文件路径
    const filePath = path === '/' ? '/index.html' : path;
    // 设置请求体
    const index = filePath.lastIndexOf('.');
    const suffix = filePath.substring(index);
    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
    let content;
    try {
        content = fs.readFileSync(`./public${filePath}`);
    } catch (error) {
        content = '当前请求文件内容不存在，请查看请求路径是否正确';
        response.statusCode = 404;
    }
    response.write(content)
    response.end()


})

server.listen(port)
console.log('监听 ' + port + ' 成功\n点击查看 http://localhost:' + port)