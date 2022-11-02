> --easy

> 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

> 示例 1：
> 
> 输入：head = [1,3,2]
> 输出：[2,3,1]

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof
```javascript
var reversePrint = function (head) {
    let array = []
    while (head !== null) {
        array.unshift(head.val)
        head = head.next
    }
    return array
};
```