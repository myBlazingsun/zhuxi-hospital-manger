<template>
    <div class="y-popper" :style="style" ref="popper">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        appendToBody: {
            type: Boolean,
            default: true
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            domReady: false,
            opened: false,
            style: {
                left: 0,
                top: 0
            }
        }
    },
    watch:{
        visible:{
            handler(nVal, oVal){
                if(nVal == true){
                    this.open()
                }else{
                    this.close()
                }
            }

        }
    },
    mounted() {
        this.createdElement();
    },
    methods: {
        createdElement(){
            if (!this.$el) return
            if(!this.domReady){
                this.getPopperStyle();
                if (this.appendToBody) {
                    document.body.appendChild(this.$el)
                }
                this.domReady = true
                this.$emit('popperMounted', this.$el)
            }
        },
        getPopperStyle() {
            let el = this.$parent.$refs.reference && this.$parent.$refs.reference.$el;  //取父级的popper 参考的元素
            if (!el) return
            let fixStyle = el.getBoundingClientRect();
            let elHeight = el.offsetHeight;
            let left = Math.floor(fixStyle.x),
                top = Math.ceil(fixStyle.y) + elHeight,
                width = el.offsetWidth;
            this.style =  {
                left: left ? `${left}px` : 0,
                top: top ? `${top}px` : 0,
                position: 'absolute',
                width: `${el.offsetWidth}px`,
                'transform-origin': 'center top',   //可根据页面位置 优化从上/从下展开
            }
        }
    }
}
</script>

<style lang="scss">
.y-popper {
    z-index: 99;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    // .opt-item {
    //     &:hover {
    //         background-color: $bgColor;
    //         color: #fff;
    //     }
    // }
}
</style>