<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop ==='shelves'">
      <book :tabsType="tabsType.prop"></book>
    </div>
    <div v-if="tabsType.prop ==='takeOff'">
      <book :tabsType="tabsType.prop"></book>
    </div>
  </basic-container>
</template>
<script>
import book from './components/bookLibrary';
export default {
  components: {
    book
  },
  data () {
    return {
      tabsType:{},
      optionTabs: {
        column: [{
          label: '上架中',
          prop: 'shelves',
        }, {
          label: '下架',
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
