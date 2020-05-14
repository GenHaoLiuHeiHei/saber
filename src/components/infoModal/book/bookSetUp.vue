<template>
  <div>
    <el-form
      :model="formData"
      :rules="formDataRules"
      ref="formData"
      id="formData"
      label-width="100px"
      class="demo-formData"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="完结" prop="isOver">
            <el-select v-model="formData.isOver" placeholder="请选择是否完结" class="w100">
              <el-option
                v-for="item in isOverSelect"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="推广" prop="generalizeSort">
            <el-select v-model="formData.generalizeSort" placeholder="请选择是否推广" class="w100">
              <el-option
                v-for="item in promoteSelect"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收益分成" prop="gainShard">
            <el-input v-model="formData.gainShard" placeholder="请输入收益分成"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tabs v-model="addBookTagsName" class="p-lr" style="width:76%;margin:0 auto">
        <el-tab-pane label="收费设置" name="single">
          <el-form-item label="全部" prop="bookChargeType">
            <el-select v-model="formData.bookChargeType" placeholder="请选择收费模式" class="w100">
              <el-option
                v-for="item in tollModeSelect"
                :key="item.dictKey"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="全本" prop="bookMoney" v-if="!isNotForm">
            <el-input v-model="formData.bookMoney" placeholder="请输入全本费用"></el-input>
          </el-form-item>
          <el-form-item label="单章" prop="bookChapterMoney" v-if="!isNotForm">
            <el-input v-model="formData.bookChapterMoney" placeholder="请输入单章费用"></el-input>
          </el-form-item>
          <el-form-item label="免费章节" v-if="!isNotForm">
            <el-input v-model="formData.bookChapterFreeNumber" placeholder="请输入前多少章免费"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <div class="dialog-footer p-t" style="text-align: right;">
        <!-- <el-button @click="closeDialogAddgsVisible">取 消</el-button> -->
        <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  getIsOver,
  getPromote,
  getTollMode,
  bookInstall,
  forceinstall
} from "@/api/book/library";
export default {
  props: {
    formDatas: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    "formData.bookChargeType": {
      handler(newValue) {
        if (newValue === 1) {
          this.isNotForm = true;
        } else {
          this.isNotForm = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      newValue: false,
      isOverSelect: [],
      tollModeSelect: [],
      promoteSelect: [],
      addBookTagsName: "single",
      formData: {},
      formDataRules: {
        isOver: [
          { required: true, message: "请选择是否完结", trigger: "change" }
        ],
        generalizeSort: [
          { required: true, message: "请选择是否推广", trigger: "change" }
        ],
        gainShard: [
          { required: true, message: "请输入收益分成", trigger: "blur" }
        ],
        bookChargeType: [
          { required: true, message: "请选择收费模式", trigger: "change" }
        ],
        bookMoney: [
          { required: true, message: "请输入全本费用", trigger: "blur" }
        ],
        bookChapterMoney: [
          { required: true, message: "请输入单章费用", trigger: "blur" }
        ]
      }
    };
  },

  created() {
    let this_ = this;
    this.formData = this.formDatas;
    // 完结
    getIsOver().then(res => {
      this_.isOverSelect = res.data.data;
    });
    // 推广
    getPromote().then(res => {
      this_.promoteSelect = res.data.data;
    });
    // 收费模式
    getTollMode().then(res => {
      this_.tollModeSelect = res.data.data;
    });
  },

  methods: {
    // 关闭模态框
    closeDialogAddgsVisible() {
      this.$emit("closeDialogAddgsVisible", true);
    },
    confirmClick(data) {
      this.$confirm('该推广位已有书籍，是否覆盖？', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.submitForm("formData", data.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.closeDialogAddgsVisible();
        });
    },
    submitForm(formName, oldGeneralizId) {
      let this_ = this;
      let submitFormData = this.formData;
      if (oldGeneralizId) {
        submitFormData.oldGeneralizId = oldGeneralizId;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (oldGeneralizId) {
            forceinstall(submitFormData);
          } else {
            bookInstall(submitFormData).then(res => {
              if (res) {
                console.log(res);
                if (res.data.msg === '1') {
                  this_.confirmClick(res.data.data);
                  return
                }
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                  this.closeDialogAddgsVisible();
                }
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.moreRulesIn {
  position: relative;
  .el-icon-error {
    position: absolute;
    right: -50px;
    top: 0;
  }
}
</style>

