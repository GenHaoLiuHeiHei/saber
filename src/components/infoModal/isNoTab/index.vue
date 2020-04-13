<template>
  <div>
    <el-form :inline="true" :model="seachForm"  v-if="hasSearchNotTab" class="demo-form-inline">
      <el-form-item label="共xx条博文">
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="seachForm.region" size="mini" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
         <el-date-picker
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            v-model="seachForm.startTime"
          ></el-date-picker>
      </el-form-item>
      <el-form-item label="至">
         <el-date-picker
            type="datetime"
            placeholder="选择结束时间"
            size="mini"
            v-model="seachForm.endTime"
          ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <component
      :is="modalInfoTypeModel"
      :formDatas="formDatas"
      :isSeach="isSeach"
      @changeIsSeach="changeIsSeach"
      @closeDialogAddgsVisible="closeDialogAddgsVisible"
    ></component>
  </div>
</template>
<script>
// 导入本文件下所有的组件
const path = require("path");
const files = require.context("@/components/infoModal/isNoTab/", true, /\.vue$/); //组件所在的文件夹;
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
    }
  },
  computed: {
    hasSearchNotTab () {
      return this.modalInfoType === 'bookArticle' ? true :false
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
    changeIsSeach() {
      this.isSeach = false;
    },
    onSubmit() {
      this.isSeach = true;
    }
  }
};
</script>
