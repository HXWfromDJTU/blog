
# Libuv

### 分阶段解析
##### timer阶段
使用一个`for`循环执行所有的 `setTimeout`,`setInterval`的回调，源码在此。[传送门>>](https://github.com/libuv/libuv/blob/9ed3ed5fcb3f19eccd3d29848ae2ff0cfd577de9/src/unix/timer.c#L150)
```js
void uv__run_timers(uv_loop_t* loop) {
  struct heap_node* heap_node;
  uv_timer_t* handle;

  for (;;) {
      //取出timer堆上超时时间最小的元素
    heap_node = heap_min((struct heap*) &loop->timer_heap);
     // 如果 timer最小堆中没有回调，则直结束处理过程
    if (heap_node == NULL)
      break;    
    //根据上面的元素，计算出handle的地址，head_node结构体和container_of的结合非常巧妙，值得学习
    handle = container_of(heap_node, uv_timer_t, heap_node);
    
    /** 如果最小的超时时间比循环运行的时间还要大
         则表示没有到期的callback需要执行
        此时退出timer阶段  因为是有序堆结构，所以取到的一直都是最小的
    */
    if (handle->timeout > loop->time)
      break;

    uv_timer_stop(handle);//将这个handle移除
    uv_timer_again(handle);//如果handle是repeat类型的，重新插入堆里
    handle->timer_cb(handle);//执行handle上的callback
  }
}
```
##### Timer Pahse实体
```cpp
/*
 * uv_timer_t 是 uv_handle_t 的一个子类
 * 用于在未来的某一个时间被唤醒
 * 存储了timer阶段所需要的数据结构
 */
struct uv_timer_t
{
    /*  继承自 UV_HANDLE 的属性 */
    void *data;
    uv_loop_t *loop;
    uv_handle_type type;
    uv_close_cb close_cb;
    void *handle_queue[2];
    union {
        int fd;
        void *reserved[4];
    } u;
    uv_handle_t *endgame_next;
    unsigned int flags;

    /*  UV_TIMER 自身的属性  */
    uv_handle_t *endgame_next;
    void *heap_node[3];   // 最小堆结构，用于保存所有的定时器，从小到大存放
    int unused;
    uint64_t timeout;
    uint64_t repeat;   // 标志该timeout的handle是 setTimeout还是 setInterval，若是后者则为真
    uint64_t start_id;
    uv_timer_cb timer_cb;    // 用于执行timer定时器中的callback
}
```
### libUV内部实体
###### uv__loop_alive
```c++
// 判断 当前的 loop是否处于活跃状态
static int uv__loop_alive(const uv_loop_t* loop) {
  return uv__has_active_handles(loop) ||
         uv__has_active_reqs(loop) ||
         loop->closing_handles != NULL;
}
// 指针指向的值是常量
// const uv_loop_t* loop 指向常量对象的指针，在这个函数的作用域内， loop指向的内容则是一个
// 最终返回的是 0 或者 1 ，因为隐式转换
```
###### uv_timer_stop
```c++
int uv_timer_stop(uv_timer_t* handle) {
  if (!uv__is_active(handle))
    return 0;

  heap_remove(timer_heap(handle->loop),
              (struct heap_node*) &handle->heap_node,
              timer_less_than);
  uv__handle_stop(handle);

  return 0;
}
```
###### uv__update_time
```c++
UV_UNUSED(static void uv__update_time(uv_loop_t* loop)) {
  /* Use a fast time source if available.  We only need millisecond precision.
   */
  loop->time = uv__hrtime(UV_CLOCK_FAST) / 1000000;
}
```
###### uv_timer_again
```c++
int uv_timer_again(uv_timer_t* handle) {
  if (handle->timer_cb == NULL)
    return UV_EINVAL;

  if (handle->repeat) {
    uv_timer_stop(handle);
    uv_timer_start(handle, handle->timer_cb, handle->repeat, handle->repeat);
  }

  return 0;
}
```

### uv_loop_t 实体
```c++
struct uv_loop_t
{
  /* User data - use this for whatever. */
  void* data;
  /* Loop reference counting. */
  unsigned int active_handles;
  void* handle_queue[2];
  union {
    void* unused[2];
    unsigned int count;
  } active_reqs;
  /* UV_LOOP_PRIVATE_FIELDS */                         
  unsigned long flags;                                                 
  int backend_fd;                                                      
  void* pending_queue[2];    // 用于存储上一个loop中poll阶段未执行完的callback
  void* watcher_queue[2];         //                                      
  uv__io_t** watchers;                                                 
  unsigned int nwatchers;                                              
  unsigned int nfds;              // 五负数整数                                    
  void* wq[2];                                                         
  uv_mutex_t wq_mutex;                                                 
  uv_async_t wq_async;                                                 
  uv_rwlock_t cloexec_lock;                                            
  uv_handle_t* closing_handles;                                        
  void* process_handles[2];   
  // 三个阶段的回调                                         
  void* prepare_handles[2];                                            
  void* check_handles[2];                                              
  void* idle_handles[2];                                               
  void* async_handles[2];                                              
  void (*async_unused)(void); 
  uv__io_t async_io_watcher;                                           
  int async_wfd;                                                       
  struct {                                                             
    void* min;                                                         
    unsigned int nelts;                                                
  } timer_heap;                                                        
  uint64_t timer_counter;                                              
  uint64_t time;                                                       
  int signal_pipefd[2];                                                
  uv__io_t signal_io_watcher;                                          
  uv_signal_t child_watcher;                                           
  int emfile_fd;              
 /* UV_PLATFORM_LOOP_FIELDS */                                
   int fs_fd;                      
};
```


#### uv_io_t
```c
struct uv__io_s {
  uv__io_cb cb;
  void* pending_queue[2];
  void* watcher_queue[2];v
  unsigned int pevents; /* Pending event mask i.e. mask at next tick. */
  unsigned int events;  /* Current event mask. */
  int fd;
};
```
###### uv__io_cb
```c
typedef void (*uv__io_cb)(struct uv_loop_s* loop,
                          struct uv__io_s* w,
                          unsigned int events);
```

![](/blog_assets/libuv_network_io.png)

![](/blog_assets/libuv_file_io.png)