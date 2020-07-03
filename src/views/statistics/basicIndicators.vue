<template>
  <div class="bg-white p-0">
    <avue-tabs :option="optionTabs" @change="handleChange" class="p-t0"></avue-tabs>
    <User :tabsType="tabsType.prop"  v-if="tabsType.prop ==='user'"></User>
    <Income :tabsType="tabsType.prop"  v-if="tabsType.prop ==='income'"></Income>
  </div>
</template>
<script>
import User from './components/user';
import Income from './components/income';
export default {
  components: {
    User,
    Income
  },
  data () {
    return {
      tabsType:{},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      optionTabs: {
        column: [{
          label: '用户',
          prop: 'user',
        }, {
          label: '收入',
          prop: 'income',
        }]
      }
    }
  },
  created(){
    this.tabsType = this.optionTabs.column[0];
  },
  methods: {
    handleChange(column) {
      this.tabsType = column
    },
  }
}
</script>
<style scoped>
#library /deep/ .avue-tabs{
  padding-top: 0 !important;
}
</style>
