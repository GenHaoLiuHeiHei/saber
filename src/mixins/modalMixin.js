export const modalMixin = {
    data () {
        return {
            modalInfoType: "",
            title: "",
            isShowDialog: false,
            isShowSeach: false,
            isOptionTab: false,
            formDatas: {},
            optionTabs: {
                column: [
                    {
                    label: "用户",
                    prop: "book"
                    },
                    {
                    label: "动态",
                    prop: "blog"
                    }
                ]
            },
            isShowUserSelectSearch: false,
            userSelectSearchData: ''
        }
    },
    methods: {
        // 列表点开模态框
        showModalInfo(row, type, isShowSeach, isOptionTab) {
            this.formDatas = row;
            this.modalInfoType = type;
            switch (type) {
            case "bookChapterList":
                this.title = "章节列表";
                break;
            case "bookSetUp":
                this.title = "书籍设置";
                break;
            case "bookTakeOff":
                this.title = "书籍下架";
                break;
            case "bookShelves":
                this.title = "书籍上架";
                break;
            case "userHoard":
                this.title = "收藏用户";
                break;
            case 'bookComment': 
                this.title = '评论列表'
                break
            case 'userLike': 
                this.title = '点赞列表'
                break
            case 'bookViolation': 
                this.title = '评论违规列表'
                break
            case 'userRelieve': 
                this.title = '解除停封'
                break
            case 'bookHoard':
                this.title = '收藏列表'
                break
            case 'bookLike': 
                this.title = '点赞列表'
                break
            case 'bookChapter': 
                this.title = '章节列表'
                break
            case 'userNotice': 
                this.title = '通知'
                break
            case 'userSetUpBlogger': 
                this.title = '设置博主'
                break
            case 'userCancelBlogger': 
                this.title = '取消博主'
                break
            case 'userBlocked': 
                this.title = '停封用户'
                break
            case 'userRealGold': 
                this.title = '修改余额'
                break
            case 'bookArticle':
                this.title = '博文列表'
                break
            case "operationBlockComments":
                this.title = "屏蔽";
                break;
            case "operationNotBlockComments":
                this.title = "不违规";
                break;
            case "operationFeedbackReply":
                this.title = "反馈回复";
                break;
            case "operationHaveRead":
                this.title = "标位已读";
                break;
            case "operationWithdraw":
                this.title = "提现";
                break;   
            case "quartzjobLog":
                this.title = "日志";
                break; 
            case "blogComment":
                this.title = "评论列表";
                break;  
            case "blogAllComment":
                this.title = "评论列表";
                break;  
            case "blogViolation":
                this.title = "违规列表";
                break;  
            case "blogAllViolation":
                this.title = "违规列表";
                break;  
            case "blogAllShare":
                this.title = "分享列表";
                break;  
            case "blogAllReport":
                this.title = "举报列表";
                break;
            case "blogAllImgList":
                this.title = "图片列表";
                break;  
            case "blogImgList":
                this.title = "图片列表";
                break;  
            case "blogVideoList":
                this.title = "视频列表";
                break;  
            case "blogAllVideo":
                this.title = "视频预览";
                break;  
            case "blogAllNotBlockComments":
                this.title = "不违规";
                break; 
            case "blogAllBlockComments":
                this.title = "屏蔽";
                break; 
            case "blogAllLike":
                this.title = "博文点赞列表";
                break; 
            case "blogBookList":
                this.title = "书籍列表";
                break; 
            
            }
            this.isShowSeach = isShowSeach ? isShowSeach : false;
            this.isOptionTab = isOptionTab ? isOptionTab : false
            this.isShowDialog = true;
        },
        //关闭模态框
        closeDialogAddgsVisible(res) {
            this.title = "";
            this.isShowDialog = false;
            if (res) this.onLoad(this.page);
        },

        closeDialogSearch(data, formDataName, isSearch) {
           if (isSearch) {
               if (data instanceof Array) {
                //    多选
               } else {
                //    单选
                this.query[formDataName] = data.name;
               }
           }
           this.isShowUserSelectSearch = false;
        },

        handelChangeUserSearch(dataName) {
            this.isShowUserSelectSearch = true;
            this.userSelectSearchData = dataName;
        }
    }
}