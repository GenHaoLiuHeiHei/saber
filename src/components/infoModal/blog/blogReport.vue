<template>
  <div id="bookHoard">
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
      @on-load="onLoad"
    ></avue-crud>
  </div>
</template>
<script>
import { getReportList } from "@/api/customer/blog";
import {
  getViolation,
  getUnfriendly
} from "@/api/book/library";
export default {
  name: "blogReport",
  props: {
    formDatas: {
      type: Object,
      required: true
    },
    seachForm: {
      type: Object,
      default () {
        return {}
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
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        menu: false,
        dialogClickModal: false,
        align: "center",
        column: [
          {
            label: "举报人",
            prop: "customerName",
            search: true
          },
          {
            label: "举报原因",
            prop: "centextData"
          }
        ]
      },
      data: [],
      violationList: [],
      unfriendlytList: []
    };
  },
  
  methods: {
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      let this_ = this;
      this.loading = true;
      params.type = 1;
      getReportList(
        page.currentPage,
        page.pageSize,
        this.formDatas.id,
        Object.assign(params, this.query)
      ).then(datas => {
        let data = datas.data.data;
        this_.page.total = data.total;
        this_.loading = false;
        getViolation().then(ress => {
          this_.violationList = ress.data.data;
        }).then(() => {
          return getUnfriendly()
        }).then(res => {
          this_.unfriendlytList = res.data.data;
          data.records.map(i => {
            i.centextList = [];
            if (i.reasons.length) {
              JSON.parse(i.reasons).map(v => {
                v.dictKey = v.dictKey.map(Number);
                this_.violationList.map(s => {
                  if (v.code === "violation") {
                    if (v.dictKey.join(',').indexOf(s.dictKey) > -1) {
                      i.centextList.push(s.dictValue)
                    }
                  }
                })
                this_.unfriendlytList.map(s => {
                  if (v.code === "unfriendly") {
                    if (v.dictKey.join(',').indexOf(s.dictKey) > -1) {
                      i.centextList.push(s.dictValue)
                    }
                  }
                })
              });
              i.centextData = i.centextList.join(',')
            }
          });
          this_.data = data.records;
        });
      });
    }
  }
};
</script>
<style scoped>
#bookHoard /deep/ .avue-crud__menu {
  display: none;
}
</style>