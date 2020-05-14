<template>
  <div id="chapterList">
    <avue-crud 
        ref="crud"
        :option="option"
        :table-loading="loading"
        :data="data"
        :page="page"
        v-model="form"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @row-del="rowDel"
        @size-change="sizeChange"
        @current-change="currentChange"
        @selection-change="selectionChange"
        @on-load="onLoad">
        <template slot="menuLeft">
          <el-button type="danger"
                    size="small"
                    icon="el-icon-delete"
                    plain
                    @click="handleDelete">删 除
          </el-button>
        </template>
        <template slot-scope="scope" slot="chapterContentForm">
          <avue-ueditor v-model="scope.row.chapterContent" id='main' :upload="upload" :pasteplain='true'></avue-ueditor>
        </template>
    </avue-crud>
  </div>
</template>

<script>
  import {getChapTerList, chapTerAdd, chapTerUpdate, chapTerRemove} from "@/api/book/library";
  import {baseUrl} from '@/config/env';
  export default {
    props: {
      formDatas: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        saveData: '',
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          tip: false,
          border: true,
          viewBtn: false,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "章节名称",
              prop: "chapterTitle",
              span: 24,
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }],
            },
            {
              label: "收费模式",
              type: "select",
              dicUrl: "/api/blade-system/dict/dictionary?code=bookTollMode",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              prop: "chapterChargeType",
              span: 24,
              rules: [{
                required: true,
                message: "请选择收费模式",
                trigger: "blur"
              }]
            },
            {
              label: "章节内容",
              prop: "chapterContent",
              hide: true,
              span: 24,
              rules: [{
                required: true,
                message: "请输入章节内容",
                trigger: "blur"
              }],
              formslot:true
            }
          ]
        },
        data: [],
        upload: {
          action: baseUrl + 'api/blade-resource/oss/endpoint/put-file',
          props: {
            res: "data",
            url: "link"
          },
          //阿里云oss配置
          ali: {
            region: "oss-cn-chengdu",
            endpoint: "oss-cn-chengdu.aliyuncs.com",
            accessKeyId: "LTAI4FfrH4uVZb8vbFdvQWjB",
            accessKeySecret: "H1txvZR68UMNW7yMc4XmZ52FbBjVBE",
            bucket: "pyh-test"
          }
        }
      };
    },
    computed: {
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      async rowSave(row, loading, done) {
        await this.getImgDe();
        row.bookId = this.formDatas.id;
        row.chapterContent = this.saveData;
        chapTerAdd(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      async rowUpdate(row, index, loading, done) {
        await this.getImgDe();
        // row.id = this.formDatas.id;
        row.chapterContent = this.saveData;
        chapTerUpdate(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return chapTerRemove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return chapTerRemove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getChapTerList(page.currentPage, page.pageSize, this.formDatas.id, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        });
      },
      getImgDe () {
        let this_ = this;
        return new Promise(function (resolve) {
          let imgs = document.getElementById("main").getElementsByTagName("img");
          console.log(imgs.lengt)
          if (imgs && imgs.length) {
            for (let i = 0;i < imgs.length; i++) {
              imgs[i].style.width = imgs[i].width
              imgs[i].setAttribute("style", '')
              imgs[i].setAttribute("data-width", imgs[i].width)
              imgs[i].setAttribute("data-height", imgs[i].height)
            }
          }
          let chapterContent = document.getElementById("main").getElementsByClassName("w-e-text")[0];
          let isNoHeight = chapterContent.getElementsByTagName('p');
          for (let i = 0; i < isNoHeight.length; i++) {
            if (isNoHeight[i].clientHeight <= 0) {
              chapterContent.removeChild(isNoHeight[i])
            }
          }
          this_.form.chapterContent = chapterContent.innerHTML;
          this_.form.chapterContent = document.getElementById("main").getElementsByClassName("w-e-text")[0].innerHTML;
          this_.saveData = this_.form.chapterContent.replace(/<style>[\s\S]*?<\/style>/g,"");
          this_.saveData = this_.saveData.replace(/<\/?(?!(p|img))[a-z]+?[^>]*>/gi,"");
          this_.saveData = this_.saveData.replace(/&nbsp;/g,' ')
          this_.saveData = this_.saveData.replace(/<([\/]?)(p)((:?\s*)(:?[^>]*)(:?\s*))>/g,'\n')
          this_.saveData = this_.saveData.replace(/<!(-*)(.*)(-*)>/g,'');
          // this_.chapterContent = this_.chapterContent.replace(/<!--\[if\s+gte\s+mso\s+9\]>(?:(?!<!\[endif\]-->)[\s\S])*<!\[endif\]-->/gi,"");
          console.log(this_.form);
          resolve();
      })
       
      }
    }
  };
</script>
