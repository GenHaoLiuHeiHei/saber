<template>
  <div id="infoModal">
    <avue-tabs :option="optionTabs" @change="handleChange"></avue-tabs>
    <component
      :is="modalInfoTypeModel"
      :formDatas="formDatas"
      :seachForm="seachForm"
      :isSeach="isSeach"
      :tofrom="tofrom"
      @changeIsSeach="changeIsSeach"
    ></component>
    <el-col v-if="this.tabsType.prop !== 'isNotShowSearch'" :xs="15" :sm="18" :md="17" :lg="18" :xl="18" class="time-form-inline m-b0">
      <el-form :inline="true" :model="seachForm" style="float: right;">
        <el-col :xs="6" :sm="6" :md="8" :lg="8" :xl="8" class="m-b0">
          <el-form-item style="width: 100%;" class="m-b0">
            <el-date-picker
              type="datetime"
              placeholder="选择开始时间"
              size="mini"
              v-model="seachForm.startTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          :xs="2"
          :sm="2"
          :md="2"
          :lg="2"
          :xl="2"
          class="text-center"
          style="height: 40px;line-height: 40px;margin: 0;"
        >至</el-col>
        <el-col :xs="6" :sm="6" :md="8" :lg="8" :xl="8" class="m-b0">
          <el-form-item style="width: 100%;" class="m-b0">
            <el-date-picker
              type="datetime"
              placeholder="选择结束时间"
              size="mini"
              v-model="seachForm.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-form-item class="m-l15 m-b0">
          <el-button type="primary" size="mini " @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>
<script>
// 导入本文件下所有的组件
const path = require("path");
const files = require.context("@/components/infoModal/isTab/", true, /\.vue$/); //组件所在的文件夹;
const modules = {};
files.keys().map(e => {
  const name = path.basename(e, ".vue");
  if (name !== "index") modules[name] = files(e).default || files(e);
});

export default {
  name: "MyinfoModal",
  components: modules,
  props: {
    modalInfoType: {
      type: String,
      required: true
    },
    /*表单数据*/
    formDatas: {
      type: Object,
      required: true
    },
    /*tab的展示数据*/
    optionTabs: {
      type: Object,
      require: true
    },
    /*判断是哪个模块点击的*/
    tofrom: {
      type: String,
      default: 'user'
    },
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
      isSeach: false,
    };
  },
  created() {
    this.tabsType = this.optionTabs.column[0];
    this.modalInfoTypeModel = this.modalInfoType;
  },
  methods: {
    handleChange(column) {
      this.tabsType = column;
      if (this.tabsType.prop === "book" || this.tabsType.prop === "isNotShowSearch") {
        this.modalInfoTypeModel = this.modalInfoType;
      } else {
        this.modalInfoTypeModel = this.tabsType.prop;
      }
      this.seachForm = {
        startTime: "",
        endTime: ""
      };
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
<style scoped>
#infoModal {
  position: relative;
}
.time-form-inline {
  position: absolute;
  right: 0;
  top: 0;
}
.time-form-inline /deep/ .el-input__inner {
  border-radius: 30px !important;
}
.time-form-inline /deep/ .el-button {
  border-radius: 30px !important;
}
.time-form-inline /deep/ .el-form-item__content {
  width: 100% !important;
}
#infoModal /deep/ .avue-tabs {
  padding-top: 0 !important;
}
</style>
