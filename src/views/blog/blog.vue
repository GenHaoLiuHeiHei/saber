<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop ==='shelves'">
      <Violation :tabsType="tabsType.prop"></Violation>
    </div>
    <div v-if="tabsType.prop ==='takeOff'">
      <Violation :tabsType="tabsType.prop"></Violation>
    </div>
  </basic-container>
</template>
<script>
import Violation from './components/blog/violation';
export default {
  components: {
    Violation
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
          label: '展示中',
          prop: 'shelves',
        }, {
          label: '违规',
          prop: 'takeOff',
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
