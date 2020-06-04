<template>
  <div class="p-t0">
    <div class="infinite-list-wrapper" id="bookLike">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="font-18 color-B05E07 m-b05" v-if="item.action === 1">你点赞了{{item.customerNickName}}（ID: {{item.customerNumber}}）的博文</div>
          <div class="font-18 color-blue m-b05" v-else-if="item.action === 2">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了你的博文</div>
          <div class="font-18 color-B05E07 m-b05" v-else-if="item.action === 3">你点赞了{{item.customerNickName}}（ID: {{item.customerNumber}}）的评论</div>
          <div class="font-18 color-blue m-b05" v-else-if="item.action === 4">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了你的评论</div>
          <div class="font-18 color-B05E07 m-b05" v-else-if="item.action === 5">你点赞了{{item.customerNickName}}（ID: {{item.customerNumber}}）的回复</div>
          <div class="font-18 color-blue m-b05" v-else-if="item.action === 6">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了你的回复</div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1" v-if="item.contentType !== 3">{{item.content}}</div>
          <div class="p-tb05 p-tb05 p-lr10 bg-e1" v-else>{{item.blogTitle}}</div>
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
import { getUserLikeList } from "@/api/customer/customer";
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
      data: []
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    getAjaxData () {
      /*
      从用户信息列表点赞---动态进入  需要用户ID
      */
      return getUserLikeList

    },
  },
  methods: {
    load() {
      if (this.disabled) return;
      this.page.currentPage++;
      this.onLoad(this.page);
    },
    onLoad(page, params = {}) {
      let this_ = this;
      if (this_.loading) return;
      this_.loading = true;
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
#bookLike {
  max-height: 500px;
  overflow: auto;
}
</style>