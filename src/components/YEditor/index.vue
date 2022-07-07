<template>
  <div class="editor-wrap" :id="id" ref="editor">
    <div id="editor" class="showContent" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading="uploadProgress" :element-loading-text="`上传中: ${uploadProgress}`">
      <!--回显的内容，库中查出来的放这-->
      <!--可以直接在指定元素内加入文本或者html标签-->
    </div>
    <input type="file" @change="updateImg($event)" accept=".jpg,.png,.jpeg" id="imgData" style="display: none;">
    <input type="file" @change="fileUpload($event)" id="uploadfile" style="display: none;">
    <input type="file" @change="uploadVideo" id="uploadVideo" style="display:none" accept="video/*">
  </div>
</template>

<script>
//照样引入css文件
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";


import Quill from "quill";

var BlockEmbed = Quill.import('blots/block/embed')
//添加image类型blot
class ImageBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    }
  }
}
//注册image类型blot
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot)

//添加video类型blot
class VideoBlot extends BlockEmbed {
  static create (value) {
    let node = super.create()
    node.setAttribute('src', value.url)
    node.setAttribute('controls', value.controls)
    node.setAttribute('width', value.width)
    node.setAttribute('height', value.height)
    node.setAttribute('webkit-playsinline', true)
    node.setAttribute('playsinline', true)
    node.setAttribute('x5-playsinline', true)
    return node;
  }
 
  static value (node) {
    return {
      url: node.getAttribute('src'),
      controls: node.getAttribute('controls'),
      width: node.getAttribute('width'),
      height: node.getAttribute('height')
    };
  }
}
//注册video类型blot
VideoBlot.blotName = 'simpleVideo'
VideoBlot.tagName = 'video'
Quill.register(VideoBlot)

var Link = Quill.import('formats/link')
class FileBlot extends Link {
    static create(value) {
        let node = undefined
        if(value && !value.href) {
            node = super.create(value)
        } else{
            node = super.create(value.href)
            node.innerText = value.innerText
            node.download = value.innerText
        }
        return node
    }
}
FileBlot.blotName = 'link'
FileBlot.tagName = 'A'
Quill.register(FileBlot)

import request from '@/utils/request'
let quill;
const id = 0;
export default {
  name: 'YEditor',
  props: {
    value: {
      type: String
    },
    initalValue: {
      type: String
    }
  },
  data() {
    return {
      id: 'ue-' + this._uid,
      uploadProgress: null,
      history: []
    }
  },
  components: {

  },
  watch: {
    initalValue: {
      handler(nval) {
        this.$nextTick(()=> {
          this.history = [];
          this.setContent()
        })
      },
      immediate: true
    }
  },
  mounted() {
    console.log(this);
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      const self = this;
      /* 编辑器操作条选项 */
      var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'], //开关按钮
        ['blockquote', 'code-block'],
        // [{ 'header': 1 }, { 'header': 2 }], //自定义按钮值
        // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'script': 'sub' }, { 'script': 'super' }], // 上标/下标
        [{ 'indent': '-1' }, { 'indent': '+1' }], // 减少缩进/缩进
        // [{ 'direction': 'rtl' }], // 文本方向
        [{ 'size': ['small', false, 'large', 'huge'] }], // 自定义下拉
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }], //使用主题的默认下拉
        // [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'], //移除格式化
        ["image", "video","link"],
        ['revoke'],//, 'restore'
        // ['formula'] //需要加载cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js
      ];

      /* 实例化编辑器 */
      quill = new Quill('#editor', {
        /*debug: 'info',*/

        modules: {
          //formula: true, //公式；需要加载cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.js
          //syntax: true,  //高亮；需要加载cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
          toolbar: {
              container: toolbarOptions,
              handlers: {
                image(){
                  document.getElementById('imgData').click();
                },
                video(){
                  document.getElementById('uploadVideo').click();
                },
                link(){
                  document.getElementById('uploadfile').click();
                },
                restore: ()=> {
                  let history = self.history[0]
                  self.history = []
                  quill.pasteHTML(history)
                  this.$nextTick(function () {
                    quill.blur()
                  })
                },
                revoke:()=> {
                  if (self.history.length > 1) {
                    let history = self.history.pop()
                    history = self.history.pop()
                    quill.pasteHTML(history)
                    self.$nextTick(function () {
                      quill.blur()
                    })
                  }
                }
              }
          },
        },
        theme: 'snow', //主题，有两种，snow和bubble
        placeholder: '请输入',
        readOnly: false
      });

      //修改样式
      var Align = Quill.import('attributors/style/align');
      Align.whitelist = ['right', 'center', 'justify'];
      Quill.register(Align, true);

      /* 传入布尔值，控制编辑器是否可用 */
      quill.enable();
      //quill.blur(); //失去焦点
      //quill.focus(); //获得焦点



      /* 事件的绑定；注意：text-change这个获取值放这的话是编辑器内容发生改变的时候才能获取到值,如果想每次提交都有值，要放到提交那 */
      quill.on('text-change', (delta, oldDelta, source)=> {
        this.$emit('input', quill.container.firstChild.innerHTML)
        this.history.push(quill.container.firstChild.innerHTML)
        console.log('tc');
      });
      quill.on('editor-change', ()=> {
        console.log('ec');
      })
    },
    //上传图片
    updateImg(e) {
      let fileInput = e.target;
      let file = fileInput.files[0];
      let filterFile = new File([file], file.name.replace(/\s/g, '')); 
      var formData = new FormData();
      formData.append('file', filterFile);        //追加的自定义节点，第一个参数：php用$_FILES接收时的key；第2个参数：当前图片
      console.log(formData.get("avatar"));    //打印当前图片的信息

      request({
        url: '/backstage/minio/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(res=> {
        const range = quill.getSelection();
        if (range) {
          let attrs = {
            with: '100%',
            height: 'auto',
            ...res.data
          }
          quill.insertEmbed(range.index, 'image',
            {
              url: res.data.url,
              controls:'controls',
              width:'100%',
              height:'auto'
            }
          ); //将上传好的图片，插入到富文本的range.index（当前光标处）
          const dt = new DataTransfer();
          fileInput.files = dt.files
        }
      })
    },
    //上传视频
    uploadVideo(e) {
      let fileInput = e.target;
      let file = fileInput.files[0];
      console.log(file.size);
      if(file.size > 1024 * 1024 * 500){
        this.$message.error('上传文件不可大于500M!')
        return
      }
      var formData = new FormData();
       let filterFile = new File([file], file.name.replace(/\s/g, '')); 
      var formData = new FormData();
      formData.append('file', filterFile);        //追加的自定义节点，第一个参数：php用$_FILES接收时的key；第2个参数：当前图片
      const self = this;
      request({
        url: '/backstage/minio/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onUploadProgress(e){
            if(e.lengthComputable){
                self.uploadProgress = ( e.loaded / e.total * 100 + '' ).substr(0, 5) + '%';
                console.log('上传进度',e.loaded / e.total); //已上传的比例
            }
         },
         timeout: 1000 * 60 * 15
      }).then(res=> {
        const range = quill.getSelection();
        if (range) {
          let attrs = {
            with: '100%',
            height: 'auto',
            ...res.data
          }
          quill.insertEmbed(range.index, 'simpleVideo', {
            url: res.data.url,
            controls: 'controls',
            width: '100%',
            height: '100%'
          }) //将上传好的图片，插入到富文本的range.index（当前光标处）
          const dt = new DataTransfer();
          fileInput.files = dt.files;
          self.uploadProgress = '';
        }
      }).catch(err=> {
        self.uploadProgress = '';
      }).finally(()=> {
        self.uploadProgress = '';
      })
    },
    setContent(){
      quill && quill.pasteHTML('')
      setTimeout(()=> {
        quill && quill.pasteHTML(this.initalValue)
      })
    },
    //上传文件
    fileUpload(e){
      let fileInput = e.target;
      let file = fileInput.files[0];
      let filterFile = new File([file], file.name.replace(/\s/g, '')); 
      var formData = new FormData();
      formData.append('file', filterFile);        //追加的自定义节点，第一个参数：php用$_FILES接收时的key；第2个参数：当前图片

      request({
        url: '/backstage/minio/upload',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res=> {
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'link',
            {
              href: res.data.url,
              innerText: res.data.name
            }
          );
          const dt = new DataTransfer();
          fileInput.files = dt.files
        }
      }).catch(err=> {
        this.$message.error(err.toString())
      })
    }
  },
  destroyed() {

  }
}
</script>

<style lang="scss">
.editor-wrap{
  #editor{
    height: 400px;
    
  }
  .ql-toolbar {
      .ql-revoke, .ql-restore{
        font-family: "iconfont";
        font-size: 20px;
        line-height: 14px;
      }
      .ql-revoke::after{
        content: '\e609';
      }
      .ql-restore::before{
        content: '\e657';
      }
    }
}

</style>