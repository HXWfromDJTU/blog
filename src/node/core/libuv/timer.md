# timer阶段

1️⃣ http模块中的keep-alive与超时断开机制。

### timer运作机制
timer的根本要求是timer中越接近deadline的r任务拥有最高的任务优先级
最合适的数据结构是`最小堆`

二叉堆的C代码结构是
```c
// 单个节点
struct heap_node {
  struct heap_node* left; // 左节点
  struct heap_node* right; // 右节点
  struct heap_node* parent; // 父节点
};

// 二叉堆
struct heap{
    struct heap_node *min;
    unsigned Int nelts;
}
```

timer比较函数
1️⃣ 首先比较两者的 timeout ，
2️⃣ 如果二者一样，则比较二者被schedule的 id, 该 id 由 loop->timer_counter 递增生成，在调用 uv_timer_start时赋值给start_id