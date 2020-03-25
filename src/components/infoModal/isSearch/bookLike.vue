<template>
  <basic-container class="p-t0">
    <div class="infinite-list-wrapper" id="bookLike">
      <ul
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        v-loading.fullscreen.lock="loading"
      >
        <li v-for="(item, index) in dataList" :key="index" class="list-item p-b15">
          <div class="font-18 color-B05E07">你的名字（ID: 10086）</div>
          <div class="p-tb05">评论的内容</div>
          <div class="bg-e1 p-tb10 p-lr10">我是内容我是内容</div>
        </li>
      </ul>
      <p v-if="loading" class="text-center">加载中...</p>
      <p v-if="noMore" class="text-center">没有更多了</p>
    </div>
  </basic-container>
</template>
<script>
// 收藏
import { getChapTerList } from "@/api/book/library";
export default {
  name: "bookLike",
  props: {
    formDatas: {
      type: Object,
      required: true
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
        console.log(newValue);
        if (newValue) {
          this.onLoad(this.page);
        }
      }
    }
  },
  data() {
    return {
      query: {},
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 30
      },
      dataList: [
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        },
        {
          title: "1111"
        }
      ]
    };
  },
  computed: {
    noMore() {
      return this.dataList.length >= this.page.total;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.dataList.push({
          title: "222"
        });
        this.loading = false;
      }, 2000);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      console.log("点赞");
      getChapTerList(
        page.currentPage,
        page.pageSize,
        this.formDatas.id,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.$emit("changeIsSeach", false);
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