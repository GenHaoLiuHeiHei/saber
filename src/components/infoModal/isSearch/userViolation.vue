<template>
  <basic-container class="p-t0">
    <div class="infinite-list-wrapper" id="userViolation">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="flex" style="justify-content: space-between;align-items: center;">
            <div class="font-18 color-B05E07">{{item.authorName}}（ID: {{item.authorId || '暂无'}}）</div>
            <div>
              <span class="m-r15">管理员 : {{item.updateUser}}</span>

              <span class="m-r15">
                状态 : 
                <span class="color-blue" v-if="item.violationStatus == '0'">未屏蔽</span>
                <span class="color-red" v-else>已屏蔽</span>
                <span class='color-blue m-l05 hand' @click="changeViolationStatus(item)">修改</span>
              </span>
              <span v-if="item.status == '0'">创建时间 : {{item.createTime}}</span>
              <span v-else>处理时间 : {{item.dealTime}}</span>
            </div>
          </div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1">{{item.violationContent}}</div>
          <div class="flex" style="justify-content: space-between;align-items: flex-end;">
            <div class="p-tb05">&lt;&lt;{{item.bookName}}&gt;&gt;</div>
            <div class="font-16 p-tb05">{{item.violationTime}}</div>
          </div>
        </li>
      </ul>
      <p v-if="loading" class="text-center">加载中...</p>
      <div v-if="noMore" class="text-center">
        <div v-if="data && data.length">没有更多了</div>
        <div v-else>
          <avue-empty></avue-empty>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改评论状态"
      :visible.sync="isShowCommentUserViolation"
      class="dialogComment"
      :modal-append-to-body="false"
      @close="closeIsShowCommentUserViolation"
    >
      <basic-container v-if="isShowCommentUserViolation">
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
                <el-input v-model="changeFormData.authorId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="评论编号">
                <el-input v-model="changeFormData.commentId"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="16">
              <el-form-item label="原因">
                <el-input v-model="changeFormData.reason" type="texteara"></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="16">
              <el-form-item label="违规">
                <el-checkbox-group v-model="changeFormData.violation" >
                  <el-checkbox :label="item.dictValue" :name="item.dictValue" v-for="(item, index) in violationList" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="不友善">
                <el-checkbox-group v-model="changeFormData.unfriendlyt" >
                  <el-checkbox :label="item.dictValue" :name="item.dictValue" v-for="(item, index) in unfriendlytList" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="管理员密码" prop="password">
                <el-input v-model="changeFormData.password" placeholder="请输入管理员密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer p-t text-center">
            <el-button @click="closeIsShowCommentUserViolation">取 消</el-button>
            <el-button type="primary" @click="submitForm('changeFormData')">确 定</el-button>
          </div>
        </el-form>
      </basic-container>
    </el-dialog>
  </basic-container>
</template>
<script>
// 收藏
import { get_violation_list, update_comment } from "@/api/customer/customer";
import {
  getViolation,
  getUnfriendly
} from "@/api/book/library";
export default {
  name: "userViolation",
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
    }
  },
  watch: {
    isSeach: {
      handler(newValue) {
        if (newValue) {
          this.page.currentPage = 1;
          Object.assign(this.query, this.seachForm);
          this.onLoad(this.page);
        } else {
          this.query = {};
        }
        this.$emit("changeIsSeach", false);
      }
    }
  },
  data() {
    return {
      violationList:[],
      unfriendlytList: [],
      isShowCommentUserViolation: false,
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
    closeIsShowCommentUserViolation () {
      this.isShowCommentUserViolation = false;

    },
    // 点击屏蔽
    changeViolationStatus (item) {
      this.isShowCommentUserViolation = true;
      this.changeFormData = item;
    },
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
    },
    submitForm (formName) {
      let obj = {}, str = [];
      this.changeFormData.violation.map (v => {
        str.push(v);
      });
      this.changeFormData.unfriendlyt.map (v => {
        str.push(v);
      });
      obj.reason = str.join(',');
      obj.authorId = this.changeFormData.authorId;
      obj.commentId = this.changeFormData.commentId;
      obj.password = this.changeFormData.password;
      obj.reason = this.changeFormData.reason;
      obj.violationStatus = this.changeFormData.violationStatus;
      console.log(obj);
      return
      this.$refs[formName].validate(valid => {
        if (valid) {
          update_comment(item).then(res => {
            console.log(res);
            debugger
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
      get_violation_list(
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
#userViolation {
  max-height: 500px;
  overflow: auto;
}
</style>