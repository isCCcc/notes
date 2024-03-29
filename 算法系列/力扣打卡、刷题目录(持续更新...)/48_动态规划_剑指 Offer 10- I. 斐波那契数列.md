> -- 动态规划 - easy
> [点击直达力扣](https://leetcode.cn/problems/fei-bo-na-qi-shu-lie-lcof/description/?languageTags=javascript)

## 题目描述

    写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：
    
    F(0) = 0,   F(1) = 1
    F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
    
    斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。
    
    答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

 

示例 1：
    
    输入：n = 2
    输出：1

示例 2：

    输入：n = 5
    输出：5

 

提示：

    0 <= n <= 100

## 解题思路 & 代码
```ts
/* 动态规划五部曲：
 *  1.确定dp[i]含义
 *  2.确定递推公式
 *  3.dp数组如何初始化
 *  4.遍历顺序
 *  5.打印数组
 */
function fib(n: number): number {
    let dp = [0, 1]  // 3.初始化dp数组
    for (let i = 2; i <= n; i++) {  // 4.从前向后遍历
        // 1.dp[i]为第i个斐波数值、2.递推公式为dp[i - 1] + dp[i - 2]
        dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007
    }
    return dp[n]  // 5.打印数组
}
```
