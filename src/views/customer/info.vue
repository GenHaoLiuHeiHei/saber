<template>
  <basic-container id="library">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <div v-if="tabsType.prop === 'bloggerMsg'">
      <bloggerMsg></bloggerMsg>
    </div>
    <div v-if="tabsType.prop === 'userMsg'">
      <userMsg></userMsg>
    </div>
    <div v-if="tabsType.prop === 'blacklist'">
      <blacklist></blacklist>
    </div>
    <!-- <keep-alive>
        <component :is="tabsType.prop"></component>
    </keep-alive> -->
  </basic-container>
</template>
<script>
import bloggerMsg from './components/bloggerMsg';
import blacklist from './components/blacklist';
import userMsg from './components/userMsg';
export default {
  components: {
      bloggerMsg,
      blacklist,
      userMsg
  },
  data () {
    return {
      tabsType:{},
      optionTabs: {
        column: [{
          label: '博主信息',
          prop: 'bloggerMsg',
        }, {
          label: '用户信息',
          prop: 'userMsg',
        }, {
          label: '黑名单',
          prop: 'blacklist',
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
