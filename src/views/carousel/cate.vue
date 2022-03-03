<template>
  <!-- 分类轮播管理 -->
  <div class="app-container carousel-index">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <!-- <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button> -->
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="图片" align="center" >
          <template slot-scope="scope"><img height="50px" :src="scope.row.pic" alt=""></template>
        </el-table-column>
        <el-table-column label="上下线状态" align="center" >
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :active-text="'上线'"
              :inactive-value="0"
              :inactive-text="'下线'">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum" :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total">
      </el-pagination>
    </div>


    <el-dialog :close-on-click-modal="false" :title="isEdit?'编辑轮播':'添加轮播'" :visible.sync="dialogVisible" width="900">
      <el-form :model="carouselDetail" ref="mainForm" :rules="formRules" label-width="150px" size="small">
        <el-form-item label="图片：" prop="pic" :class="[]">
          <single-upload :disabled="true" v-model="carouselDetail.pic" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="carouselDetail.sort" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="商品推荐：">
          <el-switch
            v-model="carouselDetail.status"
            :active-value="1"
            :active-text="'上线'"
            :inactive-value="0"
            :inactive-text="'下线'">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleUpload from '@/components/Upload/singleUpload'

import { fetchList, addIndexCarousel, updateIndexCarousel, modifyStatus, delIndexCarousel } from '@/api/carousel'
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultCarouselDetail = {
  pic: null,
  sort: null,
  status: null,
};
export default {
  name: 'adminList',
  components: {SingleUpload},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      isEdit: false,
      dataList: [],
      formDisabled: true,
      carouselDetail: defaultCarouselDetail,
      formRules: {
        pic: [
          {required: true, message: '请上传图片', trigger: 'blur'},
        ],
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
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.carouselDetail = Object.assign({}, defaultCarouselDetail);
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该该轮播图?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delIndexCarousel(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.carouselDetail = Object.assign({}, row);
      this.$nextTick(()=> {
        this.$refs.mainForm.clearValidate()
      })
    },
    validateField(name){
      this.$refs.mainForm && this.$refs.mainForm.validateField(name)
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
              updateIndexCarousel(this.carouselDetail.id, this.carouselDetail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              addIndexCarousel(this.carouselDetail).then(response => {
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

    handleStatusChange(index, row) {
      let params = {
        status: row.status,
      }
      this.listLoading = true;
      modifyStatus(row.id, params).then(response => {
        this.$message({
          type: 'success',
          message: '更新成功',
          duration: 1000
        });
      }).catch(err => {
        this.listLoading = false;
      }).finally(() => {
        this.listLoading = false;
      });
    },
    getList() {
      this.listLoading = true;
      fetchList({...this.listQuery, type: 2}).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total
      });
    },
  }
}
</script>

<style lang="scss">

</style>
