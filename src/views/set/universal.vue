<template>
  <!-- 通用设置 -->
  <div class="app-container">
    <el-form class="setting-form" :model="detail" :rules="rules" ref="settingForm" :disabled="formDisabled" label-width="180px" style="width: 600px" size="small">
      <el-form-item label="logo：" prop="logo" :class="[formDisabled ? 'form-item-logo-disabled' : 'form-item-logo']">
        <single-upload v-model="detail.logo" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="急诊热线：" prop="hotline">
        <el-input v-model="detail.hotline"></el-input>
      </el-form-item>
      <el-form-item label="备案号：" prop="beianCode">
        <el-input v-model="detail.beianCode"></el-input>
      </el-form-item>
      <el-form-item label="版权信息：" prop="copyRight">
        <el-input v-model="detail.copyRight"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号：" prop="wxQrCode">
        <single-upload v-model="detail.wxQrCode" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
    </el-form>
    <div class="opt-btns">
      <el-button v-show="formDisabled" @click.stop="formDisabled = false" type="primary" >编辑</el-button>
      <el-button v-show="!formDisabled" @click.stop="submit" type="primary" >更新</el-button>
    </div>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'
import { getSetting, setSetting } from '../../api/set'
const detaultDetail = {
  logo: null,
  hotline: null,
  beianCode: null,
  copyRight: null,
  wxQrCode: null,
}

export default {
  components: {SingleUpload },
  data(){
    return {
      detail: Object.assign({}, detaultDetail),
      shopPlatRule: {
        name: [
          {required: true, trigger: 'blur', message: '请输入平台名称',},
        ],
        url: [
          {required: true, trigger: 'blur', message: '请输入平台链接',},
        ]
      },
      formDisabled: true,
      rules: {
        logo: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        hotline: [
          {required: true, message: '请输入急诊热线', trigger: 'blur'},
        ],
        beianCode: [
          {required: true, message: '请输入备案号', trigger: 'blur'},
           {min: 2, max:50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        copyRight: [
          {required: true, message: '请输入版权信息', trigger: 'blur'},
          {min: 2, max:50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        wxQrCode: [
          {required: true, message: '请上传微信公众号二维码', trigger: 'blur'},
        ],
      }
    }
  },
  created(){
    this.getDetail()
  },
  mounted(){

  },
  methods: {
    getDetail(){
      getSetting().then(res=> {
        if(res.data && Object.keys(res.data).length){
          this.$set(this, 'detail', Object.assign({}, this.detail, res.data))
        }
      })
    },
    edit(){

    },
    submit(){
      let validates = [this.$refs.settingForm.validate()];
      Promise.all(validates).then(res=> {
        if(res.every(item=> item)){
          console.log(this.detail)
          setSetting(this.detail).then(res=> {
            this.formDisabled = true;
            this.$message.success('更新成功')
          })
        }else{
          this.$message.warn('请检查表单内容！')
        }
      })
      
    }
    
  }
}
</script>

<style lang="scss">
.setting-form{
  margin: 0 auto;
  
}
.opt-btns{
  text-align: center;
}

.form-item-logo-disabled{
  .el-upload.el-upload--picture , .el-upload__tip, .el-upload-list__item.is-success .el-upload-list__item-status-label{
    display: none;
  }
}

</style>