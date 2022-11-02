> --mid

> 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。
> 
> 单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
> 
 

> 例如，在下面的 3×4 的矩阵中包含单词 "ABCCED"（单词中的字母已标出）。
> 示例 1：
> 
> 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
> 输出：true
> 
> 示例 2：
> 
> 输入：board = [["a","b"],["c","d"]], word = "abcd"
> 输出：false

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/ju-zhen-zhong-de-lu-jing-lcof
```javascript
//  dfs + 沉没岛屿
var exist = function (board, word) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] === word.charAt(0)) {  // 找到符合第一个条件的岛屿，开始调用memo函数
                if (memo(board, row, col, word, 0)) {
                    return true
                }
            }
        }
    }

    // 用于处理array数组中是否包含word字符串
    function memo(array, row, col, word, index) {
        // 下标越界 或者 当前值匹配失败
        if (row < 0 || row >= array.length || col < 0 || col >= array[0].length || word[index] !== array[row][col]) {
            return false
        }
        // 已查找到最后一个字符，符合结果
        if (word.length === index + 1) {
            return true
        }

        // 沉没当前岛屿
        array[row][col] = '-'
        // 向四周扩散，查看岛屿
        let res = memo(array, row + 1, col, word, index + 1) ||
            memo(array, row, col + 1, word, index + 1) ||
            memo(array, row - 1, col, word, index + 1) ||
            memo(array, row, col - 1, word, index + 1)
        // 恢复岛屿，防止妨碍下次查找
        array[row][col] = word.charAt(index)
        return res
    }
    console.log('无结果')
    return false
};
```