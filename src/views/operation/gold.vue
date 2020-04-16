<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop === 'android'">
      <android></android>
    </div>
    <div v-if="tabsType.prop === 'ios'">
      <ios></ios>
    </div>
  </basic-container>
</template>
<script>
import android from './components/gold/android';
import ios from './components/gold/ios';
export default {
  components: {
      android,
      ios
  },
  data () {
    return {
      tabsType:{},
      optionTabs: {
        column: [
         {
            label: '安卓用户',
            prop: 'android',
          },
          {
            label: 'IOS设置',
            prop: 'ios',
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
