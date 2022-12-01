> --mid

> 实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，xn）。不得使用库函数，同时不需要考虑大数问题。

 

> 示例 1：
> 
> 输入：x = 2.00000, n = 10
> 输出：1024.00000
> 
> 示例 2：
> 
> 输入：x = 2.10000, n = 3
> 输出：9.26100

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/shu-zhi-de-zheng-shu-ci-fang-lcof
```javascript
// 假设所求为 2^32，那么我们只需 2^16 * 2^16，即2^16的值，
// 2^16 = 2^8 * 2^8,  4...2...1 ,即我们只需求5次，即可获得目标值
var myPow = function (x, n) {
    if (n === 0) return 1
    if (n === 1) return x

    let absN = Math.abs(n)
    let result = 1
    while (absN) {
        // 判断absN是否为奇数
        if (absN & 1) {
            result *= x
        }
        x *= x
        absN = Math.floor(absN / 2)
    }
    // 判断n是否为负数，若是，则取其倒数
    return n < 0 ? 1 / result : result

};
```