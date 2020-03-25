<template>
  <basic-container>
    <avue-form :option="option" v-model="form" @submit="handleSubmit">
      <template slot-scope="scope" slot="menuForm">
          <el-button @click="addRules">添加Banner</el-button>
      </template>
      <template slot-scope="scope" slot="del">
        <div v-if="scope.column.hide">
          <i class="el-icon-delete"  @click="deleteRules(scope)"></i>
        </div>
      </template>
    </avue-form>
  </basic-container>
</template>
<script>
import { baseUrl } from "@/config/env";

export default {
  data(){
    return {
       form:{},
       option:{
          group:[
            {
              column: [
                {
                  label: 'banner链接1',
                  labelWidth: 120,
                  prop: 'linkUrl1',
                  span: 16,
                  rules: [
                    {
                      required: true,
                      message: "请输入",
                      trigger: "blur"
                    }
                  ]
                },{
                  prop: 'del',
                  span: 2,
                  formslot:true,
                  labelslot:true,
                  groupIndex: 0,
                  hide: false
                }, {
                  label: "banner图片1",
                  prop: "imgUrl1",
                  type: "upload",
                  listType: "picture-img",
                  labelWidth: 120,
                  span: 16,
                  propsHttp: {
                    res: "data",
                    url: "link"
                  },
                  canvasOption: {
                    text: "blade",
                    ratio: 0.1
                  },
                  tip: "只能上传jpg/png文件，且不超过500kb",
                  action: baseUrl + "api/blade-resource/oss/endpoint/put-file",
                  rules: [
                    {
                      required: true,
                      message: "请上传封面图片",
                      trigger: "blur"
                    }
                  ]
                }
              ]
            },
          ]
       }
    }
  },
  created(){
    this.option1 = Object.assign(this.deepClone(this.option),{
      card:true
    });
    console.log(this.option1);
  },
  watch: {
    option: {
      handler (newValue) {
        this.mapOption(newValue.group.length);
      },
      immediate: true,
      deep: true
    }
  },
  methods:{
    mapOption (index) {
      this.option.group.map(v => {
        if (index === 1) {
          v.column[1].hide = false
        } else {
          v.column[1].hide = true
        }
      })
    },
    // 点击删除
    deleteRules(item) {
      this.option.group.splice(item.column.groupIndex, 1);
    },
    // 点击添加
    addRules() {
      let groupIndex = this.option.group.length + 1;
      this.option.group.push({
        column: [
            {
              label: 'banner链接' + groupIndex,
              labelWidth: 120,
              prop: 'linkUrl' + groupIndex,
              span: 16,
              rules: [
                {
                  required: true,
                  message: "请输入",
                  trigger: "blur"
                }
              ]
            },{
              prop: 'del',
              span: 2,
              formslot:true,
              labelslot:true,
              groupIndex: (groupIndex - 1)
            },{
                label: "banner图片" + groupIndex,
                prop: "imgUrl" + groupIndex,
                type: "upload",
                listType: "picture-img",
                labelWidth: 120,
                span: 16,
                propsHttp: {
                  res: "data",
                  url: "link"
                },
                canvasOption: {
                  text: "blade",
                  ratio: 0.1
                },
                tip: "只能上传jpg/png文件，且不超过500kb",
                action: baseUrl + "api/blade-resource/oss/endpoint/put-file",
                rules: [
                  {
                    required: true,
                    message: "请上传封面图片",
                    trigger: "blur"
                  }
                ]
              } 
          ]
      });
    },
    handleSubmit(form){
      console.log(form);
      for(let i in form){
        if (i.indexOf('imgUrl') > -1) {
          console.log(i.indexOf('imgUrl'));
          console.log(i.charAt(i.length-1));
        }
      }
       this.$message.success(JSON.stringify(this.form))
    }
  }
}
</script>