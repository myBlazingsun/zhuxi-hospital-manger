<template> 
  <div :class="['s-upload', disabled ? 'disabled' : '']">
    <ElUpload
      :action="useOss?ossUploadUrl:minioUploadUrl"
      :data="useOss?dataObj:null"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :http-request="httpRequest"
      :disabled="disabled"
      :accept="accept"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{acceptSize[type||'video']}}MB</div>
    </ElUpload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <div v-if="fileList.length">
         <img v-if="type=='img'" width="100%" :src="fileList[0].url" alt="">
        <video ref="video" controls v-else="type=='video'" width="100%"  :src="fileList[0].url"></video>
      </div>
     
    </el-dialog>
  </div>
</template>
<script>

  import store from '@/store'
  import { getToken } from '@/utils/auth'


  function getBody(xhr) {
    var text = xhr.responseText || xhr.response;
    if (!text) {
      return text;
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  let baseURL = '/'; //process.env.BASE_API;
  // if(location.pathname.indexOf('admin') > -1 || location.pathname.indexOf('yalu-manager') > -1){
  //   baseURL = '/admin/'
  // }
  export const acceptFileType = {
    img: '.jpg,.png,.jpeg',
    video: '.mp4,.MPEG4',
  }

  export const acceptSize = {
    img: 10,
    video: 500,
  } 

  export default {
    name: 'singleUpload',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: String,
      type: {
        String,
        default: ()=> 'img'
      }
    },
    computed: {
      imageUrl() {
        return this.value;
      },
      imageName() {
        if (this.value != null && this.value !== '') {
          return this.value.substr(this.value.lastIndexOf("/") + 1);
        } else {
          return null;
        }
      },
      fileList() {
        return this.value ? [{
          name: this.imageName,
          url: this.imageUrl
        }] : []
      },
      showFileList: {
        get: function () {
          return this.loading || ( this.value !== null && this.value !== ''&& this.value!==undefined );
        },
        set: function (newValue) {
          
        }
      },
      accept(){
        return this.type ? acceptFileType[this.type] : (acceptFileType.img + ',' +acceptFileType.video)
      },
      fileType(){

      }
    },
    data() {
      return {
        acceptFileType,
        acceptSize,
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: '',
          // callback:'',
        },
        dialogVisible: false,
        loading: false,
        useOss: false, //使用oss->true;使用MinIO->false
        ossUploadUrl: 'http://macro-oss.oss-cn-shenzhen.aliyuncs.com',
        minioUploadUrl: baseURL + 'backstage/minio/upload',
      };
    },
    watch:{
      dialogVisible(nval){
        if(!nval && this.$refs.video){
          this.$refs.video.pause();
        }
      }
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val);
        let parent = this.$parent;
        let validateField;
        while(parent){
          if(parent.$options.componentName == 'ElFormItem'){
            validateField = parent.prop
            console.log(parent.prop);
          }
          if(parent.$options.componentName == 'ElForm' && validateField && parent.rules[validateField]){
            let fileRule = parent.rules[validateField];
            // if(!fileRule.some(item=> item.validator)){//添加空格字符校验   此处可自定义为文件formItem添加校验项
            //   fileRule.push({
            //     validator: (rule, value, callback) => {
            //       if (/\s/.test(value) == true) {
            //         callback(new Error("文件名含有空格，请检查"));
            //       } else {
            //         callback();
            //       }
            //     }
            //   })
            // }
            parent.validateField(validateField)
            return
          }
          parent = parent.$parent
        }
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },

      httpRequest: (option)=>  {
        if (typeof XMLHttpRequest === 'undefined') {
          return;
        }
        var xhr = new XMLHttpRequest();
        var action = option.action;
        let curFile = option.file;
        option.file = new File([curFile], curFile.name.replace(/\s/g, '')); 

        if (xhr.upload) {
          xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
              e.percent = e.loaded / e.total * 100;
            }
            option.onProgress(e);
            console.log(e.percent);
          };
        }

        var formData = new FormData();

        if (option.data) {
          Object.keys(option.data).forEach(function (key) {
            formData.append(key, option.data[key]);
          });
        }

        formData.append(option.filename, option.file);

        xhr.onerror = function error(e) {
          option.onError(e);
        };

        xhr.onload = function onload() {
          if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr));
          }

          option.onSuccess(getBody(xhr));
        };

        xhr.open('post', action, true);

        if (store.getters.token) {
          xhr.setRequestHeader('Authorization', getToken()); //携带token票据
        }

        if (option.withCredentials && 'withCredentials' in xhr) {
          xhr.withCredentials = true;
        }

        var headers = option.headers || {};

        for (var item in headers) {
          if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
          }
        }
        xhr.send(formData);
        return xhr;
      },
      beforeUpload(file) {
        let _self = this;
        // file.name = file.name.replace(/\s/g, '');
        console.log('beforeupload');
        this.loading = true;
        if(!this.useOss){
          //不使用oss不需要获取策略
          return true;
        }
        console.log(file);
      },
      async getVideoCoverImg(url){
        return new Promise((resolve, reject)=> {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          let video = document.createElement('video');
          video.src = url;
          video.addEventListener('loadeddata', function (e) {
            canvas.width = this.videoWidth
            canvas.height = this.videoHeight
            let width = this.videoWidth
            let height = this.videoHeight
            ctx.drawImage(this, 0, 0, width, height);	
            let src = canvas.toDataURL('image/jpeg');
            resolve(src)
          })
        })
      },
      async handleUploadSuccess(res, file) {
        this.fileList.pop();
        let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
        if(!this.useOss){
          //不使用oss直接获取图片路径
          url = res.data.url;
        }
        let videoCoverImg;
        if(this.type == 'video'){
          videoCoverImg = await this.getVideoCoverImg(url)
        }
        this.fileList.push({name: file.name, url: url, videoCoverImg, });
        this.emitInput(this.fileList[0].url);
        this.loading = false;
      }
    }
  }
</script>
<style lang="scss">
.el-upload-list--picture .el-upload-list__item-thumbnail{
  border-radius: 5px;
  width: auto;
  height: auto;
  max-width: 70px;
  max-height: 70px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  top: 50%;
  transform: translateY(-50%);
}

.s-upload.disabled{
  .el-upload,.el-upload__tip{
    display: none;
  }
}

</style>


