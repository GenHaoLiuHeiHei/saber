<template>
  <div>
    <component
      :is="modalInfoTypeModel"
      :formDatas="formDatas"
      @closeDialogAddgsVisible="closeDialogAddgsVisible"
    ></component>
  </div>
</template>
<script>
// 导入本文件下所有的组件
const path = require("path");
const files = require.context("@/components/infoModal/isNoSearch/", false, /\.vue$/); //组件所在的文件夹;
const modules = {};
files.keys().map(e => {
  const name = path.basename(e, ".vue");
  if (name !== "index" && name != 'indexNoSearch') modules[name] = files(e).default || files(e);
});
export default {
  name: "MyinfoModalNoSearch",
  components: modules,
  props: {
    modalInfoType: {
      type: String,
      required: true
    },
    formDatas: {
      type: Object,
      required: true
    },
    toForm: {
      type: String,
      default: 'book'
    }
  },
  data() {
    return {
      modalInfoTypeModel: "",
      tabsType: {},
      loading: true,
      seachForm: {
        startTime: "",
        endTime: ""
      },
      isSeach: false
    };
  },
  created() {
    this.modalInfoTypeModel = this.modalInfoType;
  },
  methods: {
    closeDialogAddgsVisible () {
      this.$emit('closeDialogAddgsVisible', true)
    },
    onSubmit() {
      console.log(0)
    }
  }
};
</script>