<template>
  <div class="p-t0" id="bookComment">
    <div class="infinite-list-wrapper" calss="bookComment">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-t10 p-b15 ub-pre">
          <el-button
            size="mini"
            type="primary"
            class="ub-pab"
            @click="commentManagement(item)"
            style="right:0;top:10px;"
          >管理</el-button>
          <div class="font-18 color-B05E07" v-if="item.contentType === 2">{{item.customerNickName}}（ID: {{item.customerNumber}}）评论了你</div>
          <div class="font-18 color-blue" v-else>{{item.customerNickName}}（ID: {{item.customerNumber}}）回复了你</div>
          <div class="p-tb05">评论的内容</div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1">{{item.content}}</div>
          <div class="flex" style="justify-content: space-between;align-items: flex-end;">
            <div class="font-16 p-tb05">{{item.createTime}}</div>
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
      title="评论管理"
      :visible.sync="isShowComment"
      class="dialogComment"
      :modal-append-to-body="false"
      @close="closeIsShowComment"
    >
      <div v-if="isShowComment">
        <el-form
          :model="commentFormData"
          ref="commentFormData"
          :rules="commentFormDataRules"
          id="commentFormData"
          label-width="100px"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item label="违规">
                <el-checkbox-group v-model="commentFormData.violation" >
                  <el-checkbox :label="item.dictKey" v-for="(item, index) in violationList" :checked="checked" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="不友善">
                <el-checkbox-group v-model="commentFormData.unfriendly" >
                  <el-checkbox :label="item.dictKey" v-for="(item, index) in unfriendlytList" :checked="checked" @change="checked=!checked" :key="index">{{item.dictValue}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="管理员密码" prop="password">
                <el-input v-model="commentFormData.password" placeholder="请输入管理员密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer p-t text-center">
            <el-button @click="closeIsShowComment">取 消</el-button>
            <el-button type="primary" @click="submitForm('commentFormData')">确 定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 博文评论
import { getCommentList, update_blogLost_comment } from "@/api/customer/blog";
import {
  getViolation,
  getUnfriendly
} from "@/api/book/library";
export default {
  name: "bookComment",
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
      checked: false,
      listItem: {},
      violationList:[],
      unfriendlytList: [],
      query: {},
      loading: false,
      noMore: false,
      isShowComment: false,
      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0
      },
      data: [],
      commentFormData: {
        violation: [],
        unfriendly: []
      },
      commentFormDataRules: {
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
      return getCommentList
    },
    updateAjax () {
      return update_blogLost_comment
    }
  },
  created () {
    let this_ = this;
    getViolation().then(res => {
      this_.violationList = res.data.data;
    });
    getUnfriendly().then(res => {
      this_.unfriendlytList = res.data.data;
    });
  },
  methods: {
    closeIsShowComment() {
      this.isShowComment = false;
      this.commentFormData = {
        violation: [],
        unfriendly: []
      }
    },
    commentManagement(item) {
      this.listItem = item;
      this.isShowComment = true;
    },
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
    },
    submitForm (formName) {
      let obj = {}, this_ = this;
      obj.status = 2;
      if (this_.listItem.id) {
        obj.id = this_.listItem.id;
        obj.contentType = this_.listItem.contentType;
      } else {
        obj.id = this_.formDatas.id;
        obj.contentType = this_.formDatas.contentType;
      }
      
      obj.violation = this_.commentFormData.violation.join(',');
      obj.unfriendly = this_.commentFormData.unfriendly.join(',');
      obj.password = this_.commentFormData.password;
      if (this.commentFormData.violation.length === 0 && this.commentFormData.unfriendly.length === 0) {
        this_.$message.error('请选择违规或者不友善原因');
        return
      }
      this_.$refs[formName].validate(valid => {
        if (valid) {
         this_.updateAjax(obj).then(res => {
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
    onLoad(page, params = {}) {
      let this_ = this;
      if (this_.loading) return;
      this_.loading = true;
      // params.relateType = 2;
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
.bookComment {
  max-height: 500px;
  overflow: auto;
  padding: 0 20px;
}
#bookComment .dialogComment {
  z-index: 3000 !important;
}

.list-item {
  border-bottom: 1px solid #ccc;
}
</style>