> --mid

> 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

> 示例:
> 
> 现有矩阵 matrix 如下：
> 
> [
> 
> [1,   4,  7, 11, 15],
> 
>   [2,   5,  8, 12, 19],
> 
>   [3,   6,  9, 16, 22],
> 
>   [10, 13, 14, 17, 24],
> 
>   [18, 21, 23, 26, 30]
> 
> ]
> 
> 给定 target = 5，返回 true。
> 
> 给定 target = 20，返回 false。

 

> 限制：
> 
> 0 <= n <= 1000
> 
> 0 <= m <= 1000

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof

```javascript
// 以二维数组左下角作为基准点
// 如果基准点小于目标值，则右移
// 如果基准点大于目标值，则上移
// 直到越界或者找到目标值
var findNumberIn2DArray = function (matrix, target) {
    let row = matrix.length - 1;
    let col = 0
    while (row >= 0 && col < matrix[0].length) {
        if (matrix[row][col] === target) {
            return true
        } else if (matrix[row][col] < target) {
            col++
        } else {
            row--
        }
    }
    return false
};
```