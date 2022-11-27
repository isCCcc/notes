# 说明

> 该笔记文件是最近整理dom相关知识时，将先前记录的笔记进行整理打包，复制于此。


```html
<body>
    <div id="drag" style="position: absolute;width: 100px;height:100px;border:2px solid pink;"></div>
    <script>
        var dragging = false;
        var position = null;

        drag.addEventListener('mousedown', function (e) {
            dragging = true; // 正在移动
            position = [e.clientX, e.clientY];
        });
				// 监听 document ，预防因拖拽过快而丢失容器
        document.addEventListener('mousemove', function (e) {
            if (!dragging) { return; } // 没有移动则不触发事件
            const x = e.clientX;
            const y = e.clientY;
            const deltaX = x - position[0];
            const deltaY = y - position[1];
            const left = parseInt(drag.style.left || 0);
            const top = parseInt(drag.style.top || 0);
            drag.style.left = left + deltaX + 'px';
            drag.style.top = top + deltaY + 'px';
            // drag.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            position = [x, y];

        });

        document.addEventListener('mouseup', function (e) {
            dragging = false;
        });
    </script>
</body>
```

