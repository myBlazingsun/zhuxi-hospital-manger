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
        v-loading="treeLoading"
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
          <template slot-scope="scope">{{ scope.row.categoryTitle }}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.categorySort }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button v-if="scope.row.level<=2" size="mini" @click="handleAddChild(scope.$index, scope.row)">+子栏目</el-button>
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

    <el-dialog :close-on-click-modal="false" :title="(isEdit ? '编辑': '新增') + '文章'" :visible.sync="dialogVisible" width="900">
     
    
      <el-form :model="detail" ref="form" :rules="formRules" label-width="150px" size="small" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="栏目名称" prop="categoryTitle">
              <el-input v-model="detail.categoryTitle" :style="{width:  '100%'}" :clearable="true"  placeholder="请输入栏目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属栏目" prop="categoryId">
              <y-tree-select
                style="width: 100%"
                v-model="detail.categoryId"
                :disable-branch-nodes="true"
                :props="defaultProps"
                :treeData="cateOptsTree"
                :initialValue="detail.categoryId"
                placeholder="请选择"
              ></y-tree-select>
            </el-form-item>
          </el-col>
        </el-row>
         <el-form-item prop="categoryType" label="栏目类型">
            <el-radio-group v-model="detail.categoryType"
                :style="{width: ''}">
            <el-radio :style="{display: true ? 'inline-block' : 'block'}" :label="item.value"
                      v-for='(item, index) in categoryTypeOptions' :key="item.value + index">
                {{true? item.label : item.value}}
            </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义顺序" prop="categorySort">
            <el-input-number v-model="detail.categorySort" controls-position=""></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getMenuTree } from "@/api/common";
import { walkTree } from '@/utils/common'
import YTreeSelect from '@/components/YTreeSelect'
import {createMenu, updateMenu, delMenu} from '@/api/menu'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 10,
  categoryId: null
};

const defaultDetail = {
  categoryTitle: null,
  categorySort: 0,
  categoryId: null,
  categoryFlag: null,
  categoryType: null,
}

export default {
  name: "Menu",
  components: { YTreeSelect },
  data() {
    return {
      defaultProps: {
        children: "childs",
        key: "id",
        label: "categoryTitle"
      },
      treeData:[
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
      cateOptsTree: [
        {
          categoryTitle: '',
          categoryId: 0,
          id: 0,
          level:1,
          childs: [
            {
              level: 2,
              categoryTitle:'',
              categoryId: null,
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
      multipleSelection: [],
      categoryTypeOptions:  [
        {
          "value": "1",
          "label": "列表"
        },
        {
          "value": "2",
          "label": "图文"
        },
        {
          "value": "3",
          "label": "自定义"
        },
      ],


      isEdit: false,
      detail: Object.assign({}, defaultDetail),
      formRules: {
        categoryTitle:  {required: true, trigger: 'blur', message: '请输入标题'},
        createTime:  {required: true, trigger: 'blur', message: '请输入时间'},
        categoryId: [
          {required: true, message: '请选择栏目', trigger: 'blur'},
        ],
      },
      dialogVisible: false,
    };
  },
  created() {
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
    editorChange(contentHmtl, eventName) {
      this.curDetail.content = contentHmtl;
      console.log(eventName);
    },
    getList: function () {
      this.treeLoading = true;
      getMenuTree().then(res => {
        if (res && res.data.length) {
          walkTree(res.data, 'childs', 1, null, (node, level, parent)=> {
            node.level = level
          })
          this.$set(this, "treeData", res.data);
          let opts = JSON.parse(JSON.stringify(res.data))
          walkTree(opts, 'childs', 1, null, (node, level, parent)=> {
            if(level>2){
              delete node.childs
            }
          })
          opts.unshift({
            categoryTitle: '无上级栏目',
            id: 0,
            categoryId: 0,
          })
          this.$set(this, "cateOptsTree", opts);
          console.log(this.treeData);
          console.log(this.opts);
        }
      }).finally(() => {
        this.treeLoading = false;
      });
    },
    handleAdd(){
      this.dialogVisible = true;
      this.isEdit = false;
      this.detail = Object.assign({}, defaultDetail);
      this.$nextTick(()=> {
        this.$refs.form.clearValidate()
      })
    },
    handleAddChild(index, row) {
      this.dialogVisible = true;
      this.isEdit = false;
      this.detail = Object.assign({}, defaultDetail, {
        categoryId: row.id
      });
      this.$nextTick(()=> {
        this.$refs.form.clearValidate()
      })
    },
    handleUpdate(index, row) {
      this.detail = Object.assign({}, row)
      this.dialogVisible = true;
      this.isEdit = true;
      this.$nextTick(()=> {
        this.$refs.form.clearValidate()
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
        delMenu(row.id).then(res=> {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        })
      });
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
              updateMenu(this.detail.id, this.detail).then(response => {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogVisible = false;
                this.getList();
              })
            } else {
              createMenu(this.detail).then(response => {
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
.app-container {
}
</style>
