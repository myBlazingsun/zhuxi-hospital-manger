<template>
  <div class="app-container articles-content">
    <div class="left-tree">
      <el-scrollbar style="height: 100%;">
        <el-tree
          :indent="5"
          v-loading="treeLoading"
          highlight-current
          :expand-on-click-node="false"
          default-expand-all
          :empty-text="emptyText"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          style="padding: 10px;height: 100%;"
        >
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="rigth-table">
      <el-card class="filter-container" shadow="never">
        <div>
          <i class="el-icon-search"></i>
          <span>筛选搜索</span>
          <el-button
            style="float: right"
            @click="handleSearchList()"
            type="primary"
            size="small"
          >查询结果</el-button>
          <el-button
            style="float: right;margin-right: 15px"
            @click="handleResetSearch()"
            size="small"
          >重置</el-button>
        </div>
        <div style="margin-top: 15px">
          <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
            <!-- <el-form-item label="输入搜索：">
              <el-input v-model="listQuery.keyword" @keydown.native.enter="handleSearchList" class="input-width" placeholder="请输入关键词" clearable></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </el-card>
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
        <el-button class="btn-add" @click="handleAdd()" size="mini">添加</el-button>
      </el-card>
      <div class="table-container">
        <el-table
          ref="productTable"
          :data="list"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="listLoading"
          border
        >
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="栏目名" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.categoryTitle }}</p>
            </template>
          </el-table-column>
          <el-table-column label="作者" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.contentAuthor }}</p>
            </template>
          </el-table-column>
          <el-table-column label="自定义排序" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.contentSort }}</template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <p>
                <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </p>
              <p></p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="handleBatchOperate()"
          type="primary"
          size="small"
        >确定</el-button>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[5, 10, 15]"
          :current-page.sync="listQuery.pageNum"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false" :title="(isEdit ? '编辑': '新增') + '文章'" :visible.sync="dialogVisible" width="900">
      <el-form :model="detail" ref="form" :rules="formRules" label-width="150px" size="small" >
        <el-row>
          <el-col :span="12">
             <el-form-item label="文章标题" prop="contentTitle">
              <el-input v-model="detail.contentTitle" :clearable="true" placeholder="请输入文章标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <el-form-item label="所属栏目" prop="categoryId">
                <y-tree-select
                  style="width: 100%"
                  v-model="detail.categoryId"
                  :disable-branch-nodes="true"
                  :props="defaultProps"
                  :treeData="treeData"
                  :initialValue="detail.categoryId"
                  placeholder="请选择"
                ></y-tree-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发布时间" prop="contentDatetime">
              <el-date-picker
                v-model="detail.contentDatetime"
                placeholder="请选择发布时间"
                start-placeholder
                end-placeholder
                :clearable="true"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键字" prop="contentKeyword">
              <el-input v-model="detail.contentKeyword" :clearable="true" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="自定义顺序" prop="contentSort">
          <el-input-number v-model="detail.contentSort" controls-position=""></el-input-number>
        </el-form-item>
        <el-form-item label="缩略图：" prop="contentImg" :class="[]">
          <single-upload v-model="detail.contentImg" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <el-form-item label="文章描述" prop="contentDescription">
          <el-input v-model="detail.contentDescription" :clearable="true" placeholder="请输入"></el-input>
        </el-form-item>
         <el-form-item label="详情：" prop="contentDetails">
          <YEditor :initalValue="detail.initalContent"  v-model="detail.contentDetails"  @input="editorChange"></YEditor>
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
import { fetchArticlesList, getArticlesById, addArticles, updateArticles, delArticles} from "@/api/articles";
import { getMenuTree } from "@/api/common";
import SingleUpload from '@/components/Upload/singleUpload'
import YEditor from '@/components/YEditor'
import YTreeSelect from '@/components/YTreeSelect'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 10,
  categoryId: null
};

const defaultDetail = {
  contentTitle: null,//标题
  contentDatetime: null,//发布时间
  categoryId: null,
  contentDescription: null,//描述
  contentDetails: null,//内容
  initalContent: '请输入内容',//初始内容值
  contentKeyword: null,//关键字
  contentImg: null,//缩略图
  contentSort: null,
}
export default {
  name: "Articles",
  components: { SingleUpload, YEditor, YTreeSelect },
  data() {
    return {
      defaultProps: {
        children: "childs",
        key: "id",
        label: "categoryTitle"
      },
      treeData: [
        {
          categoryTitle: '',
          categoryId: 0,
          id: 0,
          level:1,
          childs: [
            {
              level: 2,
              categoryId: null,
              categoryTitle:'',
              id: 2
            }
          ],
        }
      ],
      treeLoading: false,
      emptyText: "",
      operates: [
        {
          label: "新增",
          value: "add"
        },
        {
          label: "编辑",
          value: "edit"
        },
        {
          label: "删除",
          value: "del"
        }
      ],
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: [],


      isEdit: false,
      detail: Object.assign({}, defaultDetail),
      formRules: {
        // contentTitle:  {required: true, trigger: 'blur', message: '请输入标题'},
        // contentDatetime:  {required: true, trigger: 'blur', message: '请输入时间'},
        categoryId: [
          {required: true, message: '请选择栏目', trigger: 'blur'},
        ],
        contentDescription: [
          {required: true, message: '请输入文章描述', trigger: 'blur'},
        ],
        contentDetails:  [
          {required: true, trigger: 'blur', message: '请输入详情'},
          {min: 2, max: 5000, message: '长度在 2 到 1000 个字符', trigger: 'blur'}
        ],
      },
      dialogVisible: false,
    };
  },
  created() {
    this.getTreeList();
    this.getList();
  },
  watch: {

  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    }
  },
  methods: {
    handleNodeClick(node){
      this.listQuery.categoryId = node.id;
      this.getList()
    },
    editorChange(contentHmtl, eventName) {
      this.detail.contentDetails = contentHmtl;
      console.log(eventName);
    },
    getTreeList: function () {
      this.treeLoading = true;
      getMenuTree()
        .then(res => {
          if (res && res.data.length) {
            this.$set(this, "treeData", res.data);
          }
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },
    getList() {
      this.listLoading = true;
      fetchArticlesList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.detail = Object.assign({}, defaultDetail);
      this.$nextTick(()=> {
        this.$refs.form.clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      getArticlesById(row.id).then(res=> {
        this.detail = Object.assign({}, {
          ...res.data,
          initalContent: res.data.contentDetails
        });
        this.$nextTick(()=> {
          this.$refs.form.clearValidate()
        })
      })
    },
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
        this.getList();
      });
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    handleRecommendStatusChange(index, row) {
      let data = Object.assign(
        {
          recommandStatus: row.recommandStatus == 0 ? 1 : 0
        },
        row
      );
      updateProduct(data.id, data).then(response => {
        this.$message({
          type: "success",
          message: "更新成功",
          duration: 1000
        });
        this.getList();
      });
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("recommendStatus", recommendStatus);
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      delArticles(params).then(response => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      });
      this.getList();
    },
    handleDialogConfirm() {
      this.$refs.form.validate(valid=> {
        if(valid){
          this.$confirm('是否要确认?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateArticles(this.detail.id, this.detail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              addArticles(this.detail).then(response => {
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
  }
};
</script>

<style lang="scss">
.articles-content {
  display: flex;
  justify-content: space-between;
  .left-tree {
    width: 200px;
    margin-right: 20px;
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
    .custom-tree-node {
      font-size: 14px;
    }
  }
  .rigth-table {
    flex: 1;
  }
}
</style>
