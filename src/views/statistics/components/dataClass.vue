<template>
  <div style="color:#666;display: inline-block;box-shadow: 1px 3px 20px -3px #ddd;border-radius:10px" class="p-b15 p-lr15 m-b15 m-r15">
    <div class="flex" style="align-items: flex-end">
      <div>
        <h4 class="color-black m-b0 m-t15">{{title}}</h4>
        <div class="m-tb05" v-if="formDatas.time">{{ formDatas.time }}</div>
        <div
          class="m-tb05"
          v-else
        >{{ formDatas.beginDate }} ~ {{ formDatas.endDate }} | {{formDatas.type === 3 ? '上周' : '今日'}}</div>
        <div>{{formDatas.type === 3 ? formDatas.endDate : '今日'}}</div>
        <div>
          <span class="font-30 color-black">{{ formDatas.countNum }}</span>
          <span class="font-12"><slot name="dataTypeName">次</slot></span>
        </div>
        <div class="flex">
          <div class="p-r10" v-if="formDatas.hb">
            环比
            <span class="color-green" v-if="formDatas.hb.indexOf('-') > -1">
              <i class="el-icon-caret-bottom"></i>
              {{ formDatas.hb }}
            </span>
            <span class="color-red" v-else>
              <i class="el-icon-caret-top"></i>
              {{ formDatas.hb }}
            </span>
          </div>
          <div class="p-l10" v-if="formDatas.tb">
            同比
            <span class="color-green" v-if="formDatas.tb.indexOf('-') > -1">
              <i class="el-icon-caret-bottom"></i>
              {{ formDatas.tb }}
            </span>
            <span class="color-red" v-else>
              <i class="el-icon-caret-top"></i>
              {{ formDatas.tb }}
            </span>
          </div>
        </div>
      </div>
      <div style="margin-left: 50px" class="font-14">
          <slot :formDatas="formDatas" name="footerData"></slot>  
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    formDatas: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>