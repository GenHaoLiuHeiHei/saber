<template>
  <div class="p-b20 p-lr20">
    <el-form ref="form" :model="formData" label-width="0">
        <el-form-item v-if="!selectType">
           <el-radio-group v-model="formData.userData">
            <el-radio :label="item.id" v-for="(item, index) in formDataList" :key="index">{{item.name}}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-else>
            <el-checkbox-group v-model="formData.userDataList">
                <el-checkbox 
                    v-for="(item, index) in formDataList" 
                    :label="item.id" 
                    :checked="checked" 
                    :key="index"
                    @change="checked=!checked" 
                    >
                    {{item.name}}
                </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <div class="dialog-footer p-t">
            <el-button type="primary" size="small" @click="submitForm('commentFormData')">确 定</el-button>
        </div>
    </el-form>    
  </div>
</template>
<script>
  export default {
    props:{
      formDataName: {
          type: String,
          required: true
      },
      selectType: {
          type: Boolean,
          default: () => {
              return false
          }
      }
    },
    data() {
      return {
        checked: false,
        formDataList: [
            {
                name:'刘根豪1',
                id: '1'
            },{
                name:'刘根豪2',
                id: '2'
            },{
                name:'刘根豪3',
                id: '3'
            },{
                name:'刘根豪4',
                id: '4'
            },
        ],
        formData: {
            userDataList:[],
            userData: ''
        }
      };
    },

    created () {

    },

    methods: {
     
      // 关闭模态框
      closeDialogSearch (data,isSearch = false) {
        this.$emit('closeDialogSearch', data, this.formDataName, isSearch)
      },

      submitForm() {
          if (!this.selectType) {
            //   单选
            let userDataObj = {};
            this.formDataList.map(v => {
                if (this.formData.userData.indexOf(v.id) > -1) {
                    userDataObj = v;
                }
            })
            this.closeDialogSearch(userDataObj, true)
          } else {
            //   多选
            let userDataList = [];
            this.formDataList.map(v => {
                if (this.formData.userDataList.join(',').indexOf(v.id) > -1) {
                    userDataList.push(v)
                }
            });
            this.closeDialogSearch(userDataList, true)
          }
      },

    }

  };
</script>
<style scoped lang="scss">

</style>

