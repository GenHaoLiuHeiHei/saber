<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  watch: {},
  created() {
  },
  methods: {},
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*修改滚动条样式*/
div::-webkit-scrollbar{
  width:6px;
  height:10px;
  /**/
}
div::-webkit-scrollbar-track{
  background: rgb(239, 239, 239);
  border-radius:1px;
}
div::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:6px;
}
div::-webkit-scrollbar-thumb:hover{
  background: #999;
}
div::-webkit-scrollbar-corner{
  background: #179a16;
}
</style>
