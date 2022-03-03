<template>
  <div class="app-container">
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
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <!-- color: '#dcdfe6' -->
            <span :style="{}" :title="data.name">{{ data.name }}</span>
          </span>
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
            <el-form-item label="输入搜索：">
              <el-input
                style="width: 203px"
                @keydown.native.enter="handleSearchList"
                v-model="listQuery.keyword"
                placeholder="文章标题"
              ></el-input>
            </el-form-item>
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
          <el-table-column label="商品图片" width="120" align="center">
            <template slot-scope="scope">
              <img style="height: 80px" :src="scope.row.pic" />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="商品分类" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.productCategoryName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="标签" width="140" align="center">
            <template slot-scope="scope">
              <p>
                推荐：
                <el-switch
                  @change="handleRecommendStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.recommandStatus"
                ></el-switch>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.sort }}</template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <p>
                <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑</el-button>
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
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="detail.title" :clearable="true" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="封面图片：" prop="coverImg" :class="[]">
          <single-upload v-model="detail.coverImg" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
        </el-form-item>
        <el-form-item label="所属栏目" prop="cateId">
          <y-tree-select
            v-model="detail.cateId"
            :disable-branch-nodes="true"
            :props="defaultProps"
            :treeData="treeData"
            :initialValue="detail.cateId"
            placeholder="请选择"
          ></y-tree-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="createTime">
          <el-date-picker
            v-model="detail.createTime"
            placeholder="请选择发布时间"
            start-placeholder
            end-placeholder
            :clearable="true"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="文章简介" prop="intro">
          <el-input v-model="detail.intro" :clearable="true" placeholder="请输入文章标题"></el-input>
        </el-form-item>
         <el-form-item label="详情：" prop="content">
          <YEditor :initalValue="detail.initalContent"  v-model="detail.content"  @input="editorChange"></YEditor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addToNewsCarousel()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchArticlesList, getArticlesById } from "@/api/articles";
import { getMenuTree } from "@/api/common";
import SingleUpload from '@/components/Upload/singleUpload'
import YEditor from '@/components/YEditor'
import YTreeSelect from '@/components/YTreeSelect'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 10,
  cateId: null
};

const defaultDetail = {
  title: null,
  createTime: null,
  cateId: null,
  content: null,
  intro: null,
  coverImg: null
}
export default {
  name: "Articles",
  components: { SingleUpload, YEditor, YTreeSelect },
  data() {
    return {
      defaultProps: {
        children: "childs",
        key: "id",
        label: "name"
      },
      treeData: [],
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
        title:  {required: true, trigger: 'blur', message: '请输入标题'},
        createTime:  {required: true, trigger: 'blur', message: '请输入时间'},
        coverImg: [
          {required: true, message: '请上传封面图片', trigger: 'blur'},
        ],
        cateId: [
          {required: true, message: '请选择栏目', trigger: 'blur'},
        ],
        intro:  [
          {required: true, trigger: 'blur', message: '请输入简介'},
          {min: 2, max: 5000, message: '长度在 2 到 5000 个字符', trigger: 'blur'}
        ],
        content:  [
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
      this.listQuery.cateId = node.id;
      this.getList()
    },
    editorChange(contentHmtl, eventName) {
      this.curDetail.content = contentHmtl;
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
          initalContent: res.data.content
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
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "/pms/updateProduct", query: { id: row.id } });
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
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      });
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.app-container {
  display: flex;
  justify-content: space-between;
  .left-tree {
    width: 200px;
    margin-right: 20px;
    .custom-tree-node {
      font-size: 14px;
    }
  }
  .rigth-table {
    flex: 1;
  }
}
</style>
