<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop === 'processed'">
      <processed></processed>
    </div>
    <div v-if="tabsType.prop === 'automaticProcessing'">
      <automaticProcessing></automaticProcessing>
    </div>
    <div v-if="tabsType.prop === 'unprocessed'">
      <unprocessed></unprocessed>
    </div>
    <!-- <keep-alive>
        <component :is="tabsType.prop"></component>
    </keep-alive> -->
  </basic-container>
</template>
<script>
import processed from './components/bookReport/processed';
import unprocessed from './components/bookReport/unprocessed';
import automaticProcessing from './components/bookReport/automaticProcessing';
export default {
  components: {
      processed,
      unprocessed,
      automaticProcessing
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
          label: '已处理',
          prop: 'processed',
        },
        {
          label: '自动处罚',
          prop: 'automaticProcessing',
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
