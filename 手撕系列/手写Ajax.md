# 说明

> 该笔记文件是最近整理dom相关知识时，将先前记录的笔记进行整理打包，复制于此。

## 创建一个 ajax 一般可分为四个步骤：

>1. 创建一个 xhr；
>
>2. 调用 xhr 的 open 方法，并传入请求方式和请求地址；
>
>3. 发送 xhr
>
>4. 监听状态码（onreadystatechange）
>
    - readyState === 0：创建 xhr
    - readyState === 1：调用了 open 方法，但未调用 send 方法
    - readyState === 2：调用了 send 方法
    - readyState === 3：传回的数据开始下载
    - readyState === 4：数据下载完成

> 代码实现：

```javascript
const ajax = (method, url, data, success, fail) => {
    var request = new XMLHttpRequest()
    request.open(method, url);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status >= 200 && request.status < 300 || request.status === 304)
                success(request)
        } else {
            fail(request)
        }
    }
    request.send();
}
```
