<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop === 'processed'">
      <processed></processed>
    </div>
    <div v-if="tabsType.prop === 'unprocessed'">
      <unprocessed></unprocessed>
    </div>
  </basic-container>
</template>
<script>
import processed from './components/withdraw/processed';
import unprocessed from './components/withdraw/unprocessed';
export default {
  components: {
      processed,
      unprocessed
  },
  data () {
    return {
      tabsType:{},
      optionTabs: {
        column: [
          {
            label: '未处理',
            prop: 'unprocessed',
          },{
            label: '已提现',
            prop: 'processed',
          }
        ]
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
