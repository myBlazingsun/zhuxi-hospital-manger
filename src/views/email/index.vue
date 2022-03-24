<template>
  <!-- 品牌历程 -->
  <div class="app-container brand">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="留言者姓名：">
            <el-input v-model="listQuery.name" @keydown.native.stop.enter="handleSearchList" class="input-width" placeholder="请输入留言者关键词" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" @selection-change="handleSelectionChange" border>
        <el-table-column label="姓名" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="留言时间" align="center" width="200" >
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
         <el-table-column label="主题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.subject}}</template>
        </el-table-column>
        <el-table-column label="显示状态" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"><span :style="{color: scope.row.isShow ? '#055ebb':'#ccc'}">{{scope.row.isShow?'展示':'隐藏'}}</span></template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.isShow" size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">审核</el-button>
            <el-button v-else size="mini" type="text" @click="handleUpdate(scope.$index, scope.row, 'edit')">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total">
      </el-pagination>
    </div>

    <el-dialog :close-on-click-modal="false" :title="'信箱审核'" :visible.sync="dialogVisible" width="900">
      <el-form :model="detail" ref="form" disabled :rules="{}" label-width="150px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name">
              <el-input v-model="detail.name" :clearable="true" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-radio-group v-model="detail.sex"
              :style="{width: ''}">
                <el-radio :style="{display: true ? 'inline-block' : 'block'}" :label="item.value"
                          v-for='(item, index) in sexOpts' :key="item.value">
                    {{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
              <el-form-item label="地区：" prop="city">
                <el-input v-model="detail.city" :clearable="true" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地址：" prop="address">
                <el-input v-model="detail.address" :clearable="true" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="detail.phone" :clearable="true" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="detail.email" :clearable="true" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主题" prop="subject">
        <el-input v-model="detail.subject" placeholder="主题"></el-input>
      </el-form-item>
      <el-form-item label="留言内容：" prop="content">
        <el-input type="textarea" class="input-content"  :autosize="{ minRows: 6, maxRows: 6}" v-model="detail.content" style="width: 100%;"></el-input>
      </el-form-item>
      </el-form>

      <el-form :model="replyInfo" ref="replyForm" :rules="replyFormRule" label-width="150px" size="small">
        <el-form-item label="回复：" prop="pic" :class="[]">
           <el-input type="textarea" class="input-content"  :autosize="{ minRows: 6, maxRows: 6}" v-model="replyInfo.reply" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="设为前台展示：">
          <el-switch
            v-model="replyInfo.isShow"
            :active-value="1"
            :active-text="'展示'"
            :inactive-value="0"
            :inactive-text="'隐藏'">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleReply()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getEmailList, updateEmailStatus, getEmailDetail, auditEmail } from '@/api/email'
import { formatDate } from '@/utils/date';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  name: '',
};
const defaultdetail = {
  title: null,
  createTime: null,
  coverImg: null,
  intro: null,
  content: null,
  initalContent: '请输入内容',
  sort: null,
};


const defaultReply = {
  reply: '',
  isShow: 0
}
export default {
  name: 'email',
  components: {},
  data() {
    return {
      sexOpts: [
        {label: '男',value: 1},
        {label: '女',value: 0},
      ],
      multipleSelection: [],
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      dataList: [],
      formDisabled: true,
      detail: Object.assign({}, defaultdetail),
      replyInfo: Object.assign({}, defaultReply),
      carouselDialogVisible: false,
      operates: [
        {
          label: "设为展示",
          value: "showMessage"
        },
      ],
      operateType: '',
      replyFormRule: {
        reply: [
          {
            max: 300, message: '长度小于300 个字符', trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getList();
  },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNews(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleBatchOperate(){
      this[this.operateType] && this[this.operateType]()
    },
    handleUpdate(index, row, edit) {
      this.dialogVisible = true;
      this.isEdit = true;
      getEmailDetail(row.id).then(res=> {
        this.detail = Object.assign({}, {
          ...res.data,
          initalContent: res.data.content
        });
        if(edit){
          this.$set(this, 'replyInfo', {
            isShow: res.data.isShow,
            reply: res.data.reply
          })
        }else{
          this.$set(this, 'replyInfo', Object.assign({}, defaultReply))
        }
        this.$nextTick(()=> {
          this.$refs.form.clearValidate()
          this.$refs.replyForm.clearValidate()
        })
      })
    },
    handleEdit(){

    },
    showMessage(){
      let ids = this.multipleSelection.map(item=> item.id);
      let params = new URLSearchParams();
      params.append('ids', ids);
      params.append('isShow', 1);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
        this.getList();
      });
    },
    handleReply(){
      auditEmail(this.detail.id, this.replyInfo).then(res=> {
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
        this.dialogVisible = false;
        this.getList();
      }).catch(err=> {
        this.dialogVisible = false;
        this.$message({
          message: '审核失败！',
          type: 'error'
        });
      })
    },
    handleDialogConfirm() {
      this.$refs.mainForm.validate(valid=> {
        if(valid){
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateNews(this.detail.id, this.detail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              addNews(this.detail).then(response => {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            }
          })
        }
      })
    },
    editorChange(contentHmtl, eventName) {
      this.detail.content = contentHmtl;
      console.log(eventName);
    },
    getList() {
      this.listLoading = true;
      getEmailList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total
      });
    },
    openCarouselDailog(index, row){
      this.carouselDialogVisible = true;
      this.detail = Object.assign({}, defaultdetail, {
        relationId: row.id,
        pic: row.coverImg
      });
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
  }
}
</script>

<style lang="scss">

</style>