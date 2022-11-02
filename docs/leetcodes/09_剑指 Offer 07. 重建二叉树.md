> --mid

> 输入某二叉树的前序遍历和中序遍历的结果，请构建该二叉树并返回其根节点。
> 
> 假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

> 示例 1:
> Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
> Output: [3,9,20,null,null,15,7]
> 
> 示例 2:
> 
> Input: preorder = [-1], inorder = [-1]
> Output: [-1]

> 来源：力扣（LeetCode）
> 链接：https://leetcode.cn/problems/zhong-jian-er-cha-shu-lcof

```javascript
var buildTree = function (preorder, inorder) {
    if (preorder == null || inorder === null) {
        return null
    }

    let root = new TreeNode(preorder[0])
    let rootIndex = inorder.indexOf(preorder[0])
    // 避免当前左子树为空的状况
    if (rootIndex === -1) { return null }
    
    // 将二叉树劈开，递归找到当前子树的根节点
    root.left = buildTree(preorder.slice(1, rootIndex + 1), inorder.slice(0, rootIndex))
    root.right = buildTree(preorder.slice(rootIndex + 1), inorder.slice(rootIndex + 1))

    return root
};

```