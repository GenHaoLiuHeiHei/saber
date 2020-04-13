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
import { getBanner, add} from '@/api/report/advertisement'
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
                  prop: 'pictureLink1',
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
                  prop: "pictureUrl1",
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
       },
       page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        params: {},
        query: {},
        dataList: []
    }
  },
  created(){
    let this_ = this;
    this.option1 = Object.assign(this.deepClone(this.option),{
      card:true
    });
    getBanner().then(res => {
      this_.dataList = res.data.data;
      if (this_.dataList.length === 0) return
      this_.mapDataList();
    });
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
    mapDataList () {
      let this_ = this;
      this_.dataList.map((v, s) => {
         for(let i in v){
           if (i === 'pictureLink' || i === 'pictureUrl') {
              this_.form[i + (s + 1)] = v[i];
           }
         }
         this_.$set(this_.option.group, s,{
            column: [
                {
                  label: 'banner链接' + (s + 1),
                  labelWidth: 120,
                  prop: 'pictureLink' + (s + 1),
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
                  groupIndex: s
                },{
                    label: "banner图片" + (s + 1),
                    prop: "pictureUrl" + (s + 1),
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
          })
      });
    },
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
      let this_ = this;
      this_.dataList.splice(item.column.groupIndex, 1);
      this_.form = {};
      this_.option.group = [];
      this_.mapDataList();
    },
    // 点击添加
    addRules() {
      let groupIndex = this.option.group.length + 1;
      this.option.group.push({
        column: [
            {
              label: 'banner链接' + groupIndex,
              labelWidth: 120,
              prop: 'pictureLink' + groupIndex,
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
                prop: "pictureUrl" + groupIndex,
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
      this.dataList.push({
        pictureLink: "",
        pictureType: ''
      });
    },
    handleSubmit(form){
      let self = form;
      delete self.del;
      let arr = []
      this.option.group.map((v, s) => {
        let o = {};
        for(let i in self){
          let subIndex = i.charAt(i.length-1);
          if (+subIndex === (s + 1)) {
            if (i.indexOf('pictureUrl') > -1) {
              o.pictureUrl = self[i];
            } else {
              o.pictureLink = self[i];
            }
              arr[s] = o;
          }
        }
        })

      let formData = {};
      formData.pictureType = 2;
      formData.listAdvertisement = arr; 
      console.log(formData);
      add(formData).then(res => {
        if (res) {
          console.log(res);
        }
      });
    }
  }
}
</script>