<template>
    <div :class="{
        'y-tree-select': true,
        'is-focus': optsVisible
    }"  @click="showPopper" v-clickoutside="closePopper">
        <el-input ref="reference" placeholder="请选择" :readonly="true" :class="{}" :value="selectOptText" type="text"></el-input>
        <i class="el-icon-arrow-right"></i>
        <transition class="select-top-popper" name="y-zoom-in-top">
            <y-popper ref="popper" style="z-index: 3009" v-show="optsVisible" @popperMounted="popperMounted">
                <el-tree
                  :indent="5"
                  highlight-current
                  :expand-on-click-node="false"
                  default-expand-all
                  :empty-text="emptyText"
                  :data="treeData"
                  :props="props"
                  @node-click="handleNodeClick"
                  style="padding: 10px;height: 100%;"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span :style="{}" :title="data[props.label]">{{ data[props.label] }}</span>
                  </span>
                </el-tree>
            </y-popper>
        </transition>
    </div>
</template>

<script>
import Clickoutside from '@/utils/clickoutside'
import YPopper from '../YPopper'
import { findNodeById } from '@/utils/common'


export default {
    name: 'YTreeSelect',
    components: { YPopper },
    directives:{
        Clickoutside
    },
    props:{
        options:{
            type: Array,
            require: true,
            defautl: true
        },
        initialValue: {
          type: String | Number,
        },
        value: {
            type: String | Number,
        },
        treeData: {
          type: Array,
          require: true,
        },
        props: {
          type: Object,
          default(){
            return {
              label: 'label',
              children: 'children',
              key: 'key'
            }
          }
        }
    },
    data(){
        return {
            optsVisible: false,
            selectedValue: '',
            selectNode: {},
            emptyText: '暂无数据'
        }
    },
    mounted(){
        console.log(Clickoutside);
        
    },
    watch:{
        options:{
            
        },
        value: {
          handler(nval){
            this.findNodeByValue(nval)
          },
          immediate: true
        },
    },
    computed:{
      selectOptText(){
        return this.selectNode && this.selectNode[this.props.label]
      },
    },
    methods:{
        findNodeByValue(nval){
            if(nval !== undefined && nval !== null){
                this.selectNode = findNodeById(this.treeData, nval, this.props.children, this.props.key) 
            }else{
              this.selectNode = {}
            }
        },
        showPopper(){
            this.optsVisible = true;
            this.$refs.reference.$el.focus();
            this.$refs.popper.getPopperStyle()
        },
        closePopper(){
            this.optsVisible = false;
            this.$emit('blur', this.selectedValue)
        },
        popperMounted(ele){
            this.popElement = ele
        },
        handleNodeClick(node){
            this.selectedValue = node[this.props.key];
            this.$emit('input', this.selectedValue);
            this.trggerValidate()
            this.closePopper();
        },
        trggerValidate(){
          let parent = this.$parent,
              validateField;
          while(parent){
            if(parent.$options.componentName == 'ElFormItem'){
              validateField = parent.prop
              console.log(parent.prop);
            }
            if(parent.$options.componentName == 'ElForm' && validateField && parent.rules[validateField]){
              parent.validateField(validateField)
              return
            }
            parent = parent.$parent
          }
        }
    },
    
}
</script>

<style lang="scss">
.y-tree-select{
    display: inline-block;
    width: 200px;
    height: 30px;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    .el-input, .el-input input{
        width: 100%;
        line-height: 28px;
        cursor: pointer;
    }
    .el-icon-arrow-right{
        position: absolute;
        top: calc(50% + 1px);
        transform: translateY(-50%);
        right: 10px;
        font-size: 16px;
        transition: ease-in .3s;
    }
    .el-icon-arrow-right::before{
        transition: ease-in .3s;
        transform-origin: center center;
    }
    &.is-focus{
        .el-icon-arrow-right{
            color:#333;
        }
        .el-icon-arrow-right{
            transform: translateY(-50%) rotateZ(90deg);
        }
    }
}
.opt-wrap{
    max-height: 400px;
    overflow: auto;
    .opt-item{
        cursor: pointer;
    }
}
.y-popper{
    background-color: #fff;
    .custom-tree-node{
      font-size: 14px;
    }
}


.el-tree .is-current .custom-tree-node{
  color: #409eff;
  font-weight: bold;
}
</style>