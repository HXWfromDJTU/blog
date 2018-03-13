<template>
  <div :class="{slidePanel:true,show:isShowPanel}">
     <el-container>
        <el-header class="header">
            <div class="headerAction">  <i class="el-icon-arrow-right pointer" @click="closePanel"></i> </div>
            <slot name="header" class="headerContent"></slot>
        </el-header>
           <el-main class="main">
                <slot name="main"></slot>
           </el-main>
      <el-footer class="footer">
                <slot name="footer"></slot>
      </el-footer>
</el-container>
  </div>
</template>

<script>
import Lib from "assets/js/Lib";
import systemConfig from "assets/js/config";
export default {
  name:"slidePanel",
  data() {
    return {
     transitionTime:0.5,
     direction:"left"
    };
  },
  components: {},
  //实例初始化最之前，无法获取到data里的数据
  beforeCreate() {},
  //在挂载开始之前被调用
  beforeMount() {},
  //已成功挂载，相当ready()
  mounted() {},
  props:["isShowPanel"],
  //相关操作事件
  methods: {
      closePanel(){
         this.isShowPanel = !this.isShowPanel;
          this.$emit('closePanel',"close");
      }
  }
};
</script>

<style scope>
.slidePanel {
    position: fixed;
    top: 0px;
    right:-100%;
    transition: right 0.8s;
    background:#ebeef5;
    height: 100%;
    width:65%;
    z-index: 10;
   border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
     /* 这里的60px是根据，elementUI的规范，header的高度固定为60px */
    line-height: 60px;
}

.slidePanel.show{
    right:0px;
    width:65%;
}
/* 顶部栏样式 */
.slidePanel .header{
    background-color:#FFF;
   position: absolute;
   top:0px;
   left:0px;
   width: 100%;
}
.slidePanel .header>*{
    display: inline-block !important;
}
.slidePanel .header .headerAction{
    width:5%;
}
.slidePanel .header  > *:last-child{
    width:90%;
}
/* 主要内容部分样式 */
.slidePanel .main{
    position: absolute;
     top:60px;
     left: 0px;
     width:100%;
    height:80%;
    padding-left:20px;
    padding-right:20px;
    overflow-y: scroll;
}
/* 底部样式 */
.slidePanel .footer{
    background-color:#FFF;
   position: absolute;
   bottom:0px;
   left:0px;
   width: 100%;
}
</style>