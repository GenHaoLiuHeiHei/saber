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
                    prop: "dynamic"
                    }
                ]
            },
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
            case 'userViolation': 
                this.title = '违规列表'
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
            }
            this.isShowSeach = isShowSeach ? isShowSeach : false;
            this.isOptionTab = isOptionTab ? isOptionTab : false
            this.isShowDialog = true;
        },
        //关闭模态框
        closeDialogAddgsVisible(res) {
            debugger
            this.title = "";
            this.isShowDialog = false;
            if (res) this.onLoad(this.page);
        },
    }
}