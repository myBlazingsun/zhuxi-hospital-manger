<template>
  <!-- 通用设置 -->
  <div class="app-container">
    <el-form class="setting-form" :model="detail" :rules="rules" ref="settingForm" :disabled="formDisabled" label-width="180px" style="width: 600px" size="small">
      <el-form-item label="logo：" prop="logo" :class="[formDisabled ? 'form-item-logo-disabled' : 'form-item-logo']">
        <single-upload v-model="detail.logo" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="公司名称：" prop="companyName">
        <el-input v-model="detail.companyName"></el-input>
      </el-form-item>
      <el-form-item label="备案号：" prop="beianCode">
        <el-input v-model="detail.beianCode"></el-input>
      </el-form-item>
      <el-form-item label="品牌介绍背景图路径：" prop="brandIntroImg">
        <single-upload v-model="detail.brandIntroImg" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="团队定制信息：" prop="teamOrderInfo">
        <el-input v-model="detail.teamOrderInfo"></el-input>
      </el-form-item>
      <!-- <el-form-item label="QQ客服：" prop="qq">
        <el-input v-model="detail.qq"></el-input>
      </el-form-item> -->
      <el-form-item label="邮编：" prop="zipCode">
        <el-input v-model="detail.zipCode"></el-input>
      </el-form-item>
      <el-form-item label="工作时间：" prop="workingTime">
        <el-input v-model="detail.workingTime"></el-input>
      </el-form-item>
      <el-form-item label="全国服务热线：" prop="telephone">
        <el-input v-model="detail.telephone"></el-input>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="detail.address"></el-input>
      </el-form-item>
      <el-form-item label="校园招聘：" prop="campusHire">
        <el-input v-model="detail.campusHire"></el-input>
      </el-form-item>
      <el-form-item label="购物平台：" prop="shoppingPlatforms">
        <ul class="shop-plats-ul">
          <li v-for="(item, i) in detail.shoppingPlatforms" :key="i">
            <el-form :disabled="formDisabled" ref="platForm" :model="item" :rules="shopPlatRule">
              <el-form-item prop="name" :style="{width: formDisabled ? 'calc(50% - 10px)' : 'calc(50% - 60px)'}" :label="i==0 ? '平台名称：' : '' ">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item  prop="url" :style="{width: formDisabled ? 'calc(50% - 10px)' : 'calc(50% - 60px)'}" :label="i==0 ? '平台链接' : ''">
                <el-input v-model="item.url"></el-input>
              </el-form-item>
              <el-button v-if="!formDisabled" @click="detail.shoppingPlatforms.splice(i,1)" type="primary">删除</el-button>
            </el-form>
          </li>
        </ul>
        <div class="add-plats-bar" v-if="!formDisabled">
          <el-button  @click="detail.shoppingPlatforms.push({name: '',url: ''})" type="primary">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="微博链接：" prop="weiboLink">
        <el-input v-model="detail.weiboLink"></el-input>
      </el-form-item>
      <el-form-item label="微信二维码：" prop="wechatQr">
        <!-- <el-input v-model="detail.wechatQr"></el-input> -->
        <single-upload v-model="detail.wechatQr" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        <!-- <el-input v-model="detail.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span> -->
      </el-form-item>
      <el-form-item label="抖音二维码：" prop="douyinQr" :class="[]">
        <single-upload v-model="detail.douyinQr" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="快手二维码：" prop="kuaishouQr" :class="[]">
        <single-upload v-model="detail.kuaishouQr" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="商品统一宣传视频：" prop="goodsVideo" :class="[]">
        <single-upload v-model="detail.goodsVideo" type="video" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="上传品牌视频：" prop="brandVideo" :class="[]">
        <single-upload v-model="detail.brandVideo" type="video" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
      </el-form-item>
      <el-form-item label="第四导航文案：" prop="fourthNavName">
        <el-input v-model="detail.fourthNavName"></el-input>
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
  teamOrderInfo: null,
  // qq: null,
  zipCode: null,
  workingTime: null,
  telephone: null,
  address: null,
  campusHire: null,
  shoppingPlatforms: [{name: '', value: ''}],
  weiboLink: null,
  wechatQr: null,
  fourthNavName: null,
  goodsVideo: null,
  brandVideo: null,
  douyinQr: null,
  kuaishouQr: null,
  companyName: null,
  beianCode: null,
  brandIntroImg: null,
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
        teamOrderInfo: [
          {required: true, message: '请输入', trigger: 'blur'},
        ],
        // qq: [
        //   {required: true, message: '请输入QQ', trigger: 'blur'},
        //   {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        // ],
        zipCode: [
          {required: true, message: '请输入邮编', trigger: 'blur'},
          { pattern: /[1-9]{1}(\d+){5}/, message: '请输入正确格式的邮编', trigger: 'blur' },
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        workingTime: [
          {required: true, message: '请输入工作时间', trigger: 'blur'},
          {min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        telephone: [
          {required: true, message: '请输入全国服务热线', trigger: 'blur'},
          {min: 2, max:50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
        ],
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'},
          {min: 2, max:200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        campusHire: [
          {required: true, message: '请输入校园招聘', trigger: 'blur'},
          {min: 2, max:200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        shoppingPlatforms: [
          {required: true, message: '请输入购物平台', trigger: 'blur'},
        ],
        weiboLink: [
          {required: true, message: '请输入微博链接', trigger: 'blur'},
          {min: 2, max:200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        wechatQr: [
          {required: true, message: '请输入微信二维码', trigger: 'blur'},
          {min: 2, max:200, message: '长度在 2 到 200 个字符', trigger: 'blur'}
        ],
        companyName: [
          {required: true, message: '请输入公司名称', trigger: 'blur'},
        ],
        beianCode: [
          {required: true, message: '请输入备案号', trigger: 'blur'},
        ],
        brandIntroImg: [
          {required: true, message: '请输入品牌介绍背景图路径', trigger: 'blur'},
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
      let shopPlatFormVailidates = this.$refs.platForm.map(form=> {
        return form.validate()
      })
      validates = validates.concat(shopPlatFormVailidates);
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