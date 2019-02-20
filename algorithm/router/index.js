
class SwRouter extends EventEmitter {
    constructor(routes) {
      super()
      this.routes = routes; // 初始化路由   
      this.isReplace = false; // 初始化模式为push
      this.history = []; // 收集历史记录  
      this.currentIndex = this.history.length; // 当前所在页面的标号     
      this.params = {}; // 初始化加载的时候可以从url中截取参数列表，使用正则     
      this._binding(); // 事件监听     
    }
    // 绑定事件
    _binding(){
      this.refresh = this.refresh.bind(this);   
      var _this = this; // 保存指向
      window.addEventListener('load', function(e){
          _this.refresh(e,_this.params);
      }, false);         // 首次加载
      window.addEventListener('hashchange', function(e){
          _this.refresh(e,_this.params);
      }, false);  //  后续hash变化
    }
    _refreshHistory(){
      this.currentUrl = location.hash.replace('#','/') || '/';   // 提取路径,加入提取失败就设置为默认的`/`
      var currentRoute = this._findRoute(this.currentUrl);
      if(this.isReplace){
          this.history.pop(); // 弹出最后一个元素
          this.history.push(currentRoute);  // 记录新路径   
      }else{
          this.history.push(currentRoute);  // 将当前hash路由推入数组储存
      }
      // 重置是否替换           
      this.isReplace = false;
      var str ='';
      this.history.forEach(function(route){
          str += route.path+'--';
      })
      console.log('当前历史记录栈为：'+str)
    }
    // 刷新页面
    refresh(e,param) {
      this._refreshHistory(); // 记录history   
      // 兼容第一次进入的时候取标志   
      var currentIndex  = this.history.length -2 <0?0:this.history.length -2;
      // 执行组件/页面渲染 以及 进入时的方法   
      let {onLeave} = this.history[currentIndex]?this.history[currentIndex]:{};
      let {renderFun,onEnter} = this._findRoute(this.currentUrl);; // 解构取出两个方法  
      // 第一个页面不执行上层离开回调   
      if(currentIndex!==0){
          this.trigger('beforeLeave')
          onLeave(); // 离开上一个路由   
      }
      this.currentIndex++; // 指针向前移动
      renderFun(); // 渲染当前路由
      onEnter();  // 进入当前路由
    }
    // 根据url找到指定route配置
    _findRoute(path,newRoute){
        var routeArr = this.routes;
        var _this = this;
        var route = routeArr.find(function(route,index){
            return route.path === path;
        })
        var template = {
          path:'/',
          renderFun:function(){},
          onEnter:function(){},
          onLeave:function(){}
        }
        // 若没有预先设置这个路由，则先进行设置
        if(!route){
            route = Object.assign(template,newRoute);  //
            this.routes.push(route);
        }else{
            // 为路由设置默认项，避免执行出错
            route = Object.assign(template,route);
        }
        // 返回路由
        return route;
    }
    // 跳转到某一个路由页面   
    push(route){
        // 表示是否替换式
        this.isReplace = false;
        this._jump(route);
    }
    // 跳转到一个新的路由页面
    replace(route){
        this.isReplace = true;
        this._jump(route);
    }
    go(step){
        if(Object.prototype.toString.call(step) !== '[object Number]'){
            throw Error('param to router.go must be a number~~~');
        }
        // 使用 window.history 和模拟 history 实现
        var supportHistory = window.history?true:false;
        if(supportHistory){
            window.history.go(step)
        }else{
          window.history.go(step) // 等待 this.history 完整
        }
    }
    // 编程式跳转...用于实际进行跳转的内部函数
    _jump(route){
        this.currentUrl = route.path;   // 提取路径
        this.params = route.params; // 使用全局中专页面参数
        route = this._findRoute(this.currentUrl,route); // 
        // 正式触发跳转
        location.hash = route.path.replace('/','#');  
    }
  }
  