<template>
  <div class="p-t0">
    <div class="infinite-list-wrapper" id="blogViolation">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="flex" style="justify-content: space-between;align-items: center;">
            <div class="font-18 color-B05E07">{{item.authorName}}（ID: {{item.customerNumber || '暂无'}}）</div>
            <div>
              <span class="m-r15">管理员 : {{item.handleUserName}}</span>
              <span class="m-r15">
                状态 : 
                <span class="color-red">已屏蔽</span>
                <span class='color-blue m-l05 hand' @click="changeViolationStatus(item)">修改</span>
              </span>
              <span>处理时间 : {{item.handleTime}}</span>
            </div>
          </div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1">{{item.relateComment}}</div>
          <div class="flex" style="justify-content: space-between;align-items: flex-end;">
            <div class="font-16 p-tb05">{{item.relateTime}}</div>
          </div>
        </li>
      </ul>
      <p v-if="loading" class="text-center">加载中...</p>
      <div v-if="noMore" class="text-center">
        <div v-if="data && data.length" class="p-t10">没有更多了</div>
        <div v-else>
          <avue-empty></avue-empty>
        </div>
      </div>
    </div>
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
import { get_violation_blog_list, blogviolation_remove } from "@/api/customer/blog";
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
      loading: false,
      noMore: false,
      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0
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
      return get_violation_blog_list /* 判断是用户列表进入还是书库列表进入*/
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

    // 下拉加载
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
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
    onLoad(page, params = {}) {
      let this_ = this;
      if (this_.loading) return;
      this_.loading = true;
      if (this_.getAjaxData === get_violation_blog_list) {
        params.relateType = 2;
      }
      this_.getAjaxData(
        page.currentPage,
        page.pageSize,
        this_.formDatas.id,
        Object.assign(params, this_.query)
      )
        .then(res => {
          const data = res.data.data;
          this_.page.total = data.total;
          this_.loading = false;
          if (data.records.length !== 0) {
            if (this_.page.currentPage === 1) {
              this_.data = data.records;
              if (this_.data.length < this_.page.pageSize) this_.noMore = true;
            } else {
              this_.data = this_.data.concat(data.records);
            }
            this_.$emit("changeIsSeach", false);
          } else {
            if (data.total === 0) this_.data = [];
            this_.noMore = true;
          }
        })
        .catch(err => {
          console.log(err);
          this_.loading = false;
        });
    }
  }
};
</script>
<style scoped>
#blogViolation {
  max-height: 500px;
  overflow: auto;
}
</style>