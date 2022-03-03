<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAdd()" size="mini">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="table"
        :data="treeData"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'childs', hasChildren: 'hasChildren'}">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="栏目名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleAddChild(scope.$index, scope.row)">+子栏目</el-button>
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

    <el-dialog :close-on-click-modal="false" :title="(isEdit ? '编辑': '新增') + '文章'" :visible.sync="dialogVisible" width="900">
      <el-form :model="detail" ref="form" :rules="formRules" label-width="150px" size="small" >
        <el-form-item label="栏目名称" prop="title">
          <el-input v-model="detail.title" :style="{width:  '100%'}" :clearable="true"  placeholder="请输入栏目名称"></el-input>
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
         <el-form-item prop="type" label="栏目类型">
            <el-radio-group v-model="detail.type"
                :style="{width: ''}">
            <el-radio :style="{display: true ? 'inline-block' : 'block'}" :label="item.value"
                      v-for='(item, index) in categoryTypeOptions' :key="item.value + index">
                {{true? item.label : item.value}}
            </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义顺序" prop="sort">
            <el-input-number v-model="detail.categorySort" controls-position=""></el-input-number>
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
import { walkTree } from '@/utils/common'
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
  sort: null,
  cateId: null,
  type: null,
}

export default {
  name: "Menu",
  components: { SingleUpload, YEditor, YTreeSelect },
  data() {
    return {
      defaultProps: {
        children: "childs",
        key: "id",
        label: "name"
      },
      treeData:[
        {
          name: '1',
          id: 1,
          childs: [
            {
              name:'xxx',
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
      categoryTypeOptions:  [
        {
          "value": "1",
          "label": "列表"
        },
        {
          "value": "2",
          "label": "图文"
        }
      ],


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
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
    },
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
            console.log(JSON.stringify(res.data));
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
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
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
  }
};
</script>

<style lang="scss">
.app-container {
}
</style>
