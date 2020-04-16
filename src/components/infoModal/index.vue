<template>
  <div id="infoModal">
    <avue-tabs :option="optionTabs" @change="handleChange" v-if="isOptionTab"></avue-tabs>
    <slot name="seach"></slot>
    <div class="p-lr20 m-b0" v-if="isShow">
      <el-form :inline="true" :model="seachForm" id="wocao">
          <el-form-item label="开始时间" class="m-b0">
            <el-date-picker
              type="datetime"
              placeholder="选择开始时间"
              size="small"
              v-model="seachForm.startTime"
              value-format="yyyy-MM-dd hh:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" class="m-b0">
            <el-date-picker
              type="datetime"
              placeholder="选择结束时间"
              size="small"
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="seachForm.endTime"
            ></el-date-picker>
          </el-form-item>
        <el-form-item class="m-l15 m-b0">
          <el-button type="primary" size="small" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <component
      :is="modalInfoTypeModel"
      :formDatas="formDatas"
      :seachForm="seachForm"
      :isSeach="isSeach"
      :tofrom="tofrom"
      @closeDialogAddgsVisible="closeDialogAddgsVisible"
      @changeIsSeach="changeIsSeach"
    ></component>
    
  </div>
</template>
<script>
// 导入本文件下所有的组件
const path = require("path");
const files = require.context("@/components/infoModal/", true, /\.vue$/); //组件所在的文件夹;
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
      default () {
        return {}
      }
    },
    /*条件搜索表单*/
    seachForms: {
      type: Object,
      default () {
        return {
          startTime: "",
          endTime: ""
        }
      }
    },
    /*tab的展示数据*/
    optionTabs: {
      type: Object,
      default () {
        return {}
      }
    },
    /*是否时间搜索*/
    isShowSeach: {
      type: Boolean,
      default () {
        return false
      }
    },
    /*是否显示tabs*/
    isOptionTab: {
      type: Boolean,
      default () {
        return false
      }
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
      isSeach: false,
      isShow: false,
      seachForm: {},
      isShowList: ['operationDetails', 'bookLike', 'bookComment', 'userViolation', 'dynamicLike', 'dynamicComment', 'dynamicViolation']
    };
  },
  created() {
    if (this.optionTabs.column) this.tabsType = this.optionTabs.column[0];
    this.modalInfoTypeModel = this.modalInfoType;
    this.seachForm = this.seachForms;
    this.isShow = this.isShowSeach;
  },
  methods: {
    // 切换tabs
    handleChange(column) {
      this.tabsType = column;
      // console.log(this.tabsType.prop)
      if (this.tabsType.prop === "book") {
        // 书籍中的
        this.modalInfoTypeModel = this.modalInfoType;
      } else if (this.tabsType.prop === "operationDetails" || this.tabsType.prop === "operationWithdraw") {
        // 书籍中的
        this.modalInfoTypeModel = this.tabsType.prop;
      } else {
        // 动态中的
        let splitType = '', componentName = '';
        if (this.modalInfoType.indexOf('book') > -1) {
          splitType = 'book';
        } else if (this.modalInfoType.indexOf('user') > -1) {
          splitType = 'user';
        } else if (this.modalInfoType.indexOf('blog') > -1) {
          splitType = 'blog';
        } else if (this.modalInfoType.indexOf('operation') > -1) {
          splitType = 'operation';
        } else if (this.modalInfoType.indexOf('system') > -1) {
          splitType = 'system';
        }
        componentName = this.modalInfoType.split(splitType)[1];
        this.modalInfoTypeModel = this.tabsType.prop + componentName;
      }
      if (this.isShowList.join(',').indexOf(this.modalInfoTypeModel) === -1) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.seachForm = {
        startTime: "",
        endTime: ""
      };
    },
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