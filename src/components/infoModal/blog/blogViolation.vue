<template>
  <div class="p-t0">
    <avue-crud 
        ref="crud"
        :option="option"
        :table-loading="loading"
        :data="data"
        :page="page"
        v-model="form"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @on-load="onLoad">
        <template slot-scope="scope" slot="menu">
          <el-button
            type="button"
            size="small"
            class="el-button--text"
            icon="el-icon-edit"
            @click="changeViolationStatus(scope.row)"
          >修改</el-button>
        </template>
        <template slot="relateType" slot-scope="scope">
          <div v-if="scope.row.relateType === 1">博文</div>
          <div v-if="scope.row.relateType === 2">评论</div>
          <div v-if="scope.row.relateType === 3">回复</div>
        </template>
    </avue-crud>
    <el-dialog
      title="修改评论状态"
      :visible.sync="isShowComment"
      class="dialogComment"
      :modal-append-to-body="false"
      @close="closeIsShowComment"
    >
      <div v-if="isShowComment">
        <el-form
          :model="changeFormData"
          ref="changeFormData"
          :rules="changeFormDataRules"
          id="changeFormData"
          label-width="100px"
        >
          <el-row>
             <el-col :span="16">
              <el-form-item label="评论人">
                <el-input v-model="changeFormData.authorName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="16">
              <el-form-item label="评论编号">
                <el-input v-model="changeFormData.customerNumber" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="管理员密码" prop="password">
                <el-input v-model="changeFormData.password" placeholder="请输入管理员密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer p-t text-center">
            <el-button @click="closeIsShowComment">取 消</el-button>
            <el-button type="primary" @click="submitForm('changeFormData')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 违规
import { blogviolation_remove } from "@/api/customer/blog";
import { get_blog_violation_list } from "@/api/customer/customer";

export default {
  name: "blogViolation",
  props: {
    formDatas: {
      type: Object,
      required: true
    },
    seachForm: {
      type: Object,
      default() {
        return {};
      }
    },
    isSeach: {
      type: Boolean,
      default() {
        return false;
      }
    },
    tofrom: {
      type: String,
      default: 'user'
    },
  },
  watch: {
    isSeach: {
      handler(newValue) {
        if (newValue) {
          this.page.currentPage = 1;
          Object.assign(this.query, this.seachForm);
          this.onLoad(this.page);
        } 
        this.$emit("changeIsSeach", false);
      }
    }
  },
  data() {
    return {
      isShowComment: false,
      query: {},
      form: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        align: "center",
        tip: false,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        addBtn:false,
        delBtn:false,
        editBtn:false,
        column: [
          {
            label: "昵称",
            prop: "customerName",
          },
          {
            label: "ID",
            prop: "customerNumber",
          },
          {
            label: "违规时间",
            prop: "createTime",
          },
          {
            label: "处理时间",
            prop: "handleTime",
          },
          {
            label: "评论内容",
            prop: "relateComment",
          },
          {
            label: "类型",
            prop: "relateType",
            slot: true
          },
          {
            label: "管理员",
            prop: "handleUserName",
          },
        ]
      },
      data: [],
      changeFormData: {},
      changeFormDataRules: {
        password: [
          { required: true, message: "请输入管理员密码", trigger: "blur" }
        ],
      }
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    getAjaxData () {
      /*
      article  用户信息中的博文管理获取单条博文点赞数量 ---取的是博文ID
      blog     博文管理获取单条博文点赞数量 ---取的是博文ID
      user     用户信息获取用户的博文点赞数量 ---取的是用户ID
      */
      return get_blog_violation_list
    }
  },
  methods: {

    // 关闭模态框
    closeIsShowComment () {
      this.isShowComment = false;
    },

    // 点击屏蔽
    changeViolationStatus (item) {
      this.isShowComment = true;
      this.changeFormData = item;
    },


    // 提交修改评论状态
    submitForm (formName) {
      let this_ = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          blogviolation_remove(this_.changeFormData.id).then(res => {
            if (res.data.code === 200) {
              this_.$message({
                type: "success",
                message: "操作成功!"
              });
              this_.$message({
                message: res.data.msg,
                type: 'success',
                onClose () {
                  this_.closeIsShowComment();
                  this_.page.currentPage = 1;
                  this_.onLoad(this_.page);
                }
              });
            }
          })
        } else {
          return false;
        }
      });
    },

    // 初始化获取数据
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params) {
      this.query = params;
      this.onLoad(this.page, params);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage){
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      this.getAjaxData(page.currentPage, page.pageSize, this.formDatas.id, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>
<style scoped>
#blogViolation {
  max-height: 500px;
  overflow: auto;
  padding: 0 20px;
}
</style>