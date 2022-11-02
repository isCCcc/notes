> --easy

> 给定两个字符串 s 和 t ，编写一个函数来判断它们是不是一组变位词（字母异位词）。
> 
> 注意：若 s 和 t 中每个字符出现的次数都相同且字符顺序不完全相同，则称 s 和 t 互为变位词（字母异位词）。

 

> 示例 1:
> 
> 输入: s = "anagram", t = "nagaram"
> 输出: true
> 
> 示例 2:
> 
> 输入: s = "rat", t = "car"
> 输出: false
> 
> 示例 3:
> 
> 输入: s = "a", t = "a"
> 输出: false

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/dKk3P7
```javascript
var isAnagram = function (s, t) {
    if (s.length !== t.length || s===t) {
        return false
    }

    let map = new Map()
    for (let i in s) {
        if (map.has(s[i])) {
            map.set(s[i], map.get(s[i]) + 1)
        } else {
            map.set(s[i], 1)
        }

        if (map.has(t[i])) {
            map.set(t[i], map.get(t[i]) - 1)
        } else {
            map.set(t[i], -1)
        }
    }
    for (let [key, val] of map) {
        if (val != 0) {
            return false
        }
    }

    return true
};
```