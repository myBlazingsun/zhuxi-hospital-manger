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
      <el-form-item label="版权信息：" prop="copyRright">
        <el-input v-model="detail.copyRright"></el-input>
      </el-form-item>
      <el-form-item label="微信公众号：" prop="wxQrCode">
        <single-upload v-model="detail.wxQrCode" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="友情链接：" prop="links">
        <ul class="shop-plats-ul">
          <li v-for="(item, i) in detail.links" :key="i">
            <el-form :disabled="formDisabled" ref="linksForm" :model="item" :rules="linksRules">
              <el-form-item prop="name" :style="{width: formDisabled ? 'calc(50% - 10px)' : 'calc(50% - 60px)'}" :label="i==0 ? '链接名称：' : '' ">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item  prop="url" :style="{width: formDisabled ? 'calc(50% - 10px)' : 'calc(50% - 60px)'}" :label="i==0 ? '链接地址' : ''">
                <el-input v-model="item.url"></el-input>
              </el-form-item>
              <el-button v-if="!formDisabled" @click="detail.links.splice(i,1)" type="primary">删除</el-button>
            </el-form>
          </li>
        </ul>
        <div class="add-plats-bar" v-if="!formDisabled">
          <el-button  @click="detail.links.push({name: '',url: ''})" type="primary">添加</el-button>
        </div>
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
  copyRright: null,
  wxQrCode: null,
  links: [{name: '', url: ''}],
}

export default {
  components: {SingleUpload },
  data(){
    return {
      detail: Object.assign({}, detaultDetail),
      linksRules: {
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
        copyRright: [
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
      let linksFormVailidates = this.$refs.linksForm.map(form=> {
        return form.validate()
      })
      validates = validates.concat(linksFormVailidates);
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

.shop-plats-ul{
  list-style: none;
  padding: 0;
  margin: 0;
  li{
    list-style: none;
    .el-form{
      width: 100%;
      display: flex;
      justify-content: space-between;
      .el-button{
        height: 40px;
      }
      .el-form-item {
        display: inline-block;
      }
    }
    .el-form-item__error{
      display: block;
      position: static;
    }
  }
  li + li{
    margin-top: 15px;
  }
  li:nth-child(1){
    .el-form{
      .el-button{
        margin-top: 32px;
      }
    }
  }
}

.add-plats-bar{
  padding: 10px 0;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}

</style>