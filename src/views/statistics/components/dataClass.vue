<template>
  <div style="color:#666;display: inline-block;" class="p-b15 p-lr15">
     <div class="font-22 color-black">
         {{title}}
     </div>
     <div class="m-tb05">
         {{ formDatas.time }}
     </div>
     <div>
         今日
     </div>
     <div>
         <span class="font-30 color-black">
             {{ formDatas.Sum }}
         </span>
        <span class="font-12">
            次
        </span>
     </div>
     <div class="flex">
         <div class="p-r10">
            环比
            <span class="color-green" v-if="formDatas.HB.indexOf('-') > -1">
                <i class="el-icon-caret-bottom "></i>
                {{ formDatas.HB }}
            </span>
            <span class="color-red" v-else>
                <i class="el-icon-caret-top"></i>
                {{ formDatas.HB }}
             </span>
         </div>
         <div class="p-l10">
             同比
            <span class="color-green" v-if="formDatas.TB.indexOf('-') > -1">
                <i class="el-icon-caret-bottom "></i>
                {{ formDatas.TB }}
            </span>
            <span class="color-red" v-else>
                <i class="el-icon-caret-top"></i>
                {{ formDatas.TB }}
            </span>
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
            default () {
                return {}
            }
        }
    },
    data() {
        return {
        };
    },
    methods: {
        
    }
};
</script>