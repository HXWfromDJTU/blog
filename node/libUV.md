epoll
kqueue

libUV提供了两种方式与eventLoop一起协同工作，一个是句柄，一个是请求。

句柄代表了一个长期存在的对象，这些对象当处于一个活跃的状态时候，能够执行特定的操作。
比如说，一个准备 prepare 句柄在活跃的时候，可以在每个循环中调用它的回调一次。
再具象来说，一个TCP服务句柄在每次有新连接的时候，都会调用它的链接回调函数。

请求一般代表短时操作，
### libUV运转流程
#### 整体流程
```c++
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int ran_pending;

  /*
  从uv__loop_alive中我们知道event loop继续的条件是以下三者之一：
  1，有活跃的handles（libuv定义handle就是一些long-lived objects，例如tcp server这样）
  2，有活跃的request
  3，loop中的closing_handles
  */
  r = uv__loop_alive(loop);
  //  假若上述三个条件都不满足，则更新 loop 里的update_times
  if (!r)
    uv__update_time(loop);  // 更新 loop 实体的 time属性为当前时间

  while (r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop);//更新时间变量，这个变量在uv__run_timers中会用到
    uv__run_timers(loop);//timers阶段
    ran_pending = uv__run_pending(loop);//从libuv的文档中可知，这个其实就是I/O callback阶段,ran_pending指示队列是否为空
    uv__run_idle(loop);//idle阶段
    uv__run_prepare(loop);//prepare阶段

    timeout = 0;

    /**
    设置poll阶段的超时时间，以下几种情况下超时会被设为0，这意味着此时poll阶段不会被阻塞，在下面的poll阶段我们还会详细讨论这个
    1，stop_flag不为0
    2，没有活跃的handles和request
    3，idle、I/O callback、close阶段的handle队列不为空
    否则，设为timer阶段的callback队列中，距离当前时间最近的那个
    **/    
    if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
      timeout = uv_backend_timeout(loop);

    uv__io_poll(loop, timeout);//poll阶段
    uv__run_check(loop);//check阶段
    uv__run_closing_handles(loop);//close阶段
    //如果mode == UV_RUN_ONCE（意味着流程继续向前）时，在所有阶段结束后还会检查一次timers，这个的逻辑的原因不太明确
    
    if (mode == UV_RUN_ONCE) {
      uv__update_time(loop);
      uv__run_timers(loop);
    }

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }

  if (loop->stop_flag != 0)
    loop->stop_flag = 0;

  return r;
}
```
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
```c++
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
  void* watcher_queue[2];
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