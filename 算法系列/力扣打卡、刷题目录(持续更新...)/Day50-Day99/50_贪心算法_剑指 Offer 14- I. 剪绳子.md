> -- 动态规划 - middle
> [点击直达力扣](https://leetcode.cn/problems/jian-sheng-zi-lcof/description/?favorite=xb9nqhhg&languageTags=javascript)

## 题目描述

    给你一根长度为 n 的绳子，请把绳子剪成整数长度的 m 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 k[0],k[1]...k[m-1] 。请问 k[0]*k[1]*...*k[m-1] 可能的最大乘积是多少？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。

示例 1：

    输入: 2
    输出: 1
    解释: 2 = 1 + 1, 1 × 1 = 1

示例 2:

    输入: 10
    输出: 36
    解释: 10 = 3 + 3 + 4, 3 × 3 × 4 = 36

提示：

    2 <= n <= 58

```ts
// 贪心算法
function cuttingRope(n: number): number {
    let dp = new Array(n + 1).fill(0)
    dp[2] = 1  // dp[1]没有意义
    for (let i = 3; i <= n; i++) {  // 外层循环填充1-n内乘积的最大值
        for (let j = 1; j < i - 1; j++) {  // 内层循环具体乘积的最大值
            // 将绳子分成2段以上，请求其最大乘积值
            // (i - j) * j    -->   将绳子分成两段
            // dp[i - j] * j  -->   将绳子分成 dp[i - j] + 1 段
            dp[i] = Math.max(dp[i], (i - j) * j, dp[i - j] * j)
        }
    }
    return dp[n]
};
```