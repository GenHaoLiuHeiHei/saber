<template>
  <basic-container class="p-t0">
    <div class="infinite-list-wrapper" id="bookLike">
      <ul
        class="list"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in data" :key="index" class="list-item p-b15">
          <div class="font-18 color-blue m-b05" v-if="item.action == '2' || item.action == '4' || item.action == '6' || tofrom == 'article'">{{item.customerNickName}}（ID: {{item.customerNumber}}）赞了你的{{(item.action == '2' || tofrom == 'article') ? '博文' : item.action == '4' ? '评论' : item.action == '6' ? '回复' : ''}}</div>
          <div class="font-18 color-B05E07 m-b05" v-else>你赞了 {{item.customerNickName}}（ID: {{item.customerNumber}}）的{{item.action == '1' ? '博文' : item.action == '3' ? '评论' : item.action == '5' ? '回复' : ''}}</div>
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
  </basic-container>
</template>
<script>
// 收藏
import { getBlogLikeList } from "@/api/customer/customer";
import { getLikeList } from "@/api/customer/blog";
export default {
  name: "bookLike",
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
        // else {
        //   this.query = {};
        // }
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
      return this.tofrom === 'article' ? getLikeList : getBlogLikeList /* 判断是用户列表进入还是书库列表进入*/
    }
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