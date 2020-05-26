<template>
  <div class="p-t0">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div class="infinite-list-wrapper" id="blogLike">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="font-18 color-B05E07 m-b05" v-if="optionTabIndex === 1">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了{{item.beCustomerNickName}}（ID: {{item.beCustomerNumber}}）的博文</div>
          <div class="font-18 color-blue m-b05" v-else-if="optionTabIndex === 2">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了{{item.beCustomerNickName}}（ID: {{item.beCustomerNumber}}）的评论</div>
          <div class="font-18 color-B05E07 m-b05" v-else-if="optionTabIndex === 3">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了{{item.beCustomerNickName}}（ID: {{item.beCustomerNumber}}）的回复</div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1">{{item.content}}</div>
          <div class="flex" style="justify-content: space-between;align-items: flex-end;">
            <div class="font-16 p-tb05">{{item.optime || item.praiseTime}}</div>
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
  </div>
</template>
<script>
// 博文点赞 
import { getBlogLikeList } from "@/api/customer/customer";
export default {
  name: "blogLike",
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
      query: {},
      loading: false,
      noMore: false,
      page: {
        pageSize: 10,
        currentPage: 0,
        total: 0
      },
      data: [],
      optionTabs: {
        column: [{
          label: '博文点赞',
          prop: 'bloggerMsg',
          index: 1
        }, {
          label: '评论点赞',
          prop: 'userMsg',
          index: 2

        }, {
          label: '回复点赞',
          prop: 'blacklist',
          index: 3
        }]
      },
      optionTabIndex: 1,
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    getAjaxData () {
      /*
      博文管理，用户信息博文管理进入的点赞
      article  用户信息中的博文管理获取单条博文点赞数量 ---取的是博文ID
      blog     博文管理获取单条博文点赞数量 ---取的是博文ID
      user     用户信息获取用户的博文点赞数量 ---取的是用户ID
      */
      return getBlogLikeList

    },
  },
  methods: {
    handleChange(column) {
      if (column.index === this.optionTabIndex) return
      this.optionTabIndex = column.index;
      this.page.currentPage = 0;
      this.data = [];
      this.onLoad(this.page);
    },
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
    },
    onLoad(page, params = {}) {
      let this_ = this;
      if (this_.loading) return;
      this_.loading = true;
      params.type = this_.optionTabIndex;
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
#blogLike {
  max-height: 500px;
  overflow: auto;
  padding: 0 20px;
}
</style>