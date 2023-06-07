import vuefw from "boardware-vue-framework";
import variables from "@/styles/variables.scss";
import pageCon from "@/views/pageCon";
const { errorMsg, successMsg } = vuefw.Message;
import TabTableList from '../components/list.vue'
import QueryTools from '../components/query.vue'
import EditForm from '../components/form.vue'
import ToolPanel from '../components/tools.vue'
// import LimitDate from '../components/limitDate.vue'
import {getOptionDatas,optionDatas,loadRelationOptions,emptyAllOptionData,emptyOptionData} from '@/views/system/components/optionCtrl'
import { initSortInfo,setSortInfo } from '@/utils/index';
import { taxInfos } from '@/config/common.config';
import {downloadFile} from '@/utils/index'
const taxerDatas = taxInfos();
import _ from 'lodash'
export default {
  name: "CoverSearch",
  components: {
    pageCon,
    TabTableList,
    QueryTools,
    EditForm,
    ToolPanel,
    // LimitDate
  },
  // mixins: [customtableMix],
  data() {
    return {
      
      isShowDialog:false,
      vmIns:this,
      activeName: '',
      pageCode: "COUDIND010",
      variables,
      listConfigs: {
        columnsConfig: [
          
        ],
        tableDatas: [],
        pageInfo: (this.getPageInsInfo()),
        sortInfo: {},
        isShowDialog: false,
        dialogTitle: 'setting_set_cover',
        rowData: null,
        putUrl: this.apiConfig.cover_rep_save_cover,
        postUrl: this.apiConfig.cover_rep_save_cover,
      },
      formData: {
        roleName: "",
      },

      selectedGroups: [],
      groups: [],
    };
  },
  created() {

    
    this.listConfigs.columnsConfig = [
      {
        headerName: 'letter.letterBusiness',
        field: 'ddptmec',
        elementName: 'el-select',
        type: 'IND001',
        allowCreate:true,
        name:'ddptmec',
        label: 'letter.letterBusiness',
        style:'width:100%',
        rules: 'required',
        value: '',
        isList:true,
        isQuery: true,
        isEdit: true,
        queryValue: '',
        event: {
          change(e,item,configs,listConfigs) { 
            let cover_rep_config_list = optionDatas['closed_letter_list'];
            let listData = cover_rep_config_list.data;
            let finded = listData.find(data => data.value === e);
            let ddptmep = listConfigs.columnsConfig.find(item => item.field === 'ddptmep');
            
            if (ddptmep) {
              ddptmep.isEdit = false;
              
            }
            if (!finded) {
              ddptmep.isEdit = true;
              ddptmep.headerName = 'letter.letterBusiness_pt';
            }
          }
        },
        listRender(scope, item, colmuns, tableData, cellConfig) { 
          let res = optionDatas['closed_letter_list'];
          if (scope && scope.row) {
            return this.transLabel(scope.row.ddptmec,scope.row.ddptmep);
          }
          
        },
        children: [
          {
            elementName: 'el-option',
            isOptionList: true,
            className:'normal-text-inline-block',
            repeatDatas: optionDatas['closed_letter_list'],
            getDataTag: 'closed_letter_list',
            apiName:'closed_letter_list',
            queryData(datas) { 
              return datas;
            },
            dataFilter(datas) { 
              return datas.map(item => {
                item.value = item.dptno+'';
                item.label = item.dptmec;
                item.langc = item.dptmec;
                item.langp = item.dptmep;
                return item;
              })
            }
          }
        ]
      },
      {
        headerName: 'letterBusiness_pt',
        field: 'ddptmep',
        elementName: 'el-input',
        type: 'text',
        allowCreate: true,
        name: 'ddptmep',
        label: 'letterBusiness_pt',
        style: 'width:100%',
        rules: '',
        value: '',
        isEdit: false,
        queryValue: '',
      },
      {
        headerName: 'letter.reLetterCode',
        field:'paggod',
        elementName: 'el-input',
        type: 'text',
        name:'paggod',
        label: 'letter.reLetterCode',
        style:'width:100%',
        maxLength:'8',
        rules: 'required',
        valueFormat: 'yyyyMMdd',
        format: 'dd/MM/yyyy',
        isEdit: true,
        queryValue: '',
        value:'',
      },
      {
        headerName: 'main_purport',
        field:'pagsub',
        elementName: 'el-input',
        type: 'text',
        name:'pagsub',
        label: 'main_purport',
        style:'width:100%',
        maxLength:'8',
        rules: 'required',
        valueFormat: 'yyyyMMdd',
        format:'dd/MM/yyyy',
        isEdit: true,
        queryValue: [],
        value:'',
      },
      {
        headerName: 'cover_query_target',
        field: 'pagobj',
        elementName: 'el-select',
        type: 'IND001',
        allowCreate:true,
        name:'pagobj',
        label: 'letter.letterBusiness',
        style:'width:100%',
        maxLength:'8',
        rules: 'required', value: '',
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue: '',
        children: [
          {
            elementName: 'el-option',
            isOptionList:true,
            repeatDatas: optionDatas['cover_rep_config_list'],
            getDataTag: 'cover_rep_config_list',
            apiName:'cover_rep_config_list',
            queryData(datas) { 
              return datas;
            },
            dataFilter(datas) { 
              return datas.object_list.map(item => {
                item.value = item.figno+'';
                item.label = item.figmsg1;
                item.langc = item.figmsg1;
                item.langp = item.figmsg2;
                return item;
              })
            }
          }
        ]
      },
      {
        headerName: 'department_infos',
        field: 'pagdpt',
        elementName: 'el-select',
        type: 'IND001',
        allowCreate:true,
        name:'pagdpt',
        label: 'letter.letterBusiness',
        style:'width:100%',
        maxLength:'8',
        rules: 'required', value: '',
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue: '',
        children: [
          {
            elementName: 'el-option',
            isOptionList:true,
            repeatDatas: optionDatas['cover_rep_config_list'],
            getDataTag: 'cover_rep_config_list',
            apiName:'cover_rep_config_list',
            queryData(datas) { 
              return datas;
            },
            dataFilter(datas) { 
              return datas.dpt_list.map(item => {
                item.value = item.dptno+'';
                item.label = item.dptmec;
                item.langc = item.dptmec;
                item.langp = item.dptmep;
                return item;
              })
            }
          }
        ]
      },
      {
        headerName: 'cover_signin_er',
        field: 'pagsig',
        elementName: 'el-select',
        type: 'IND001',
        allowCreate:true,
        name:'pagsig',
        label: 'letter.letterBusiness',
        style:'width:100%',
        maxLength:'8',
        rules: 'required', value: '',
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue: '',
        event: {
          change(e,item,configs,listConfigs) { 
            let cover_rep_config_list = optionDatas['cover_rep_config_list'];
            let listData = cover_rep_config_list.data.sign_list;
            let finded = listData.find(data => data.value === e);
            let pagsig = listConfigs.columnsConfig.find(item => item.field === 'pagsig');
            let pagsig2 = listConfigs.columnsConfig.find(item => item.field === 'pagsig2');
            if (pagsig) {
              
              pagsig.headerName = 'cover_signin_er';
            }
            if (pagsig2) {
              pagsig2.isEdit = false;
              pagsig2.headerName = '';
            }
            if (!finded) {
              pagsig2.isEdit = true;
              pagsig.headerName = 'system_cover_title';
              pagsig2.headerName = 'selTax.name';
            }
          }
        },
        children: [
          {
            elementName: 'el-option',
            isOptionList:true,
            repeatDatas: optionDatas['cover_rep_config_list'],
            getDataTag: 'cover_rep_config_list',
            apiName:'cover_rep_config_list',
            queryData(datas) { 
              return datas;
            },
            dataFilter(datas) { 
              return datas.sign_list.map(item => {
                item.value = item.figno+'';
                item.label = item.figmsg1;
                item.langc = item.figmsg1;
                item.langp = item.figmsg1;
                item.figmsg2 = item.figmsg2;
                item.itemData = item;
                return item;
              })
            }
          }
        ]
      },
      {
        headerName: '',
        field: 'pagsig2',
        elementName: 'el-input',
        type: 'IND001',
        allowCreate:true,
        name:'pagsig2',
        label: '',
        style:'width:100%',
        maxLength:'8',
        rules: 'required',
        value: '',
        // isList:true,
        // isQuery: true,
        isEdit: false,
        queryValue: '',
      },
      {
        headerName: 'cover_to_user',
        field:'user_name_c',
        elementName: 'el-input',
        type: 'date',
        name:'user_name_c',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: '',
        disabled:true,
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue:'',
        value:'',
      },
      {
        headerName: 'department_abbr_name',
        field:'dept_name',
        elementName: 'el-input',
        type: 'date',
        name:'dept_name',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: '',
        disabled:true,
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue:'',
        value:'',
      },
      {
        headerName: 'contact_user_to',
        field:'dept_alias',
        elementName: 'el-input',
        type: 'date',
        name:'dept_alias',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: '',
        disabled:true,
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue:'',
        value:'',
      },
      {
        headerName: 'occupationalTax.telPhone',
        field:'tel',
        elementName: 'el-input',
        type: 'date',
        name:'tel',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: '',
        disabled:true,
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue:'',
        value:'',
      },
      {
        headerName: 'abbr_info',
        field:'short_name',
        elementName: 'el-input',
        type: 'date',
        name:'short_name',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: '',
        disabled:true,
        // isList:true,
        // isQuery: true,
        isEdit: true,
        queryValue:'',
        value:'',
      },
      {
        headerName: 'letter.letterDate',
        field:'ddmdat',
        elementName: 'LimitDate',
        type: 'date',
        name:'ddmdat',
        label: 'letter.letterDate',
        style:'width:100%',
        maxLength:'8',
        rules: 'required',
        valueFormat: 'yyyyMMdd',
        format: 'dd/MM/yyyy',
        fixedWidth:'150px',
        isList:true,
        isQuery: true,
        isEdit: false,
        notPostData:true,
        queryValue: [],
        value: [],
        listRender(scope, item, colmuns, tableData, cellConfig) { 
          return this.formatDate(scope.row.ddmdat);
        },
      },
      {
        headerName: 'letter.letterCode',
        field:'ddmccod',
        elementName: 'el-input',
        type: 'IND001',
        name:'ddmccod',
        label: 'letter.letterCode',
        style:'width:100%',
        maxLength:'8',
        fixedWidth:'150px',
        rules: 'required',value:'',
        isList:true,
        isQuery: true,
        isEdit: false,
        queryValue:'',
      },
      {
       headerName: 'letter.GCO_code',
       field:'ddmgcod',
       elementName: 'el-input',
       type: 'IND001',
       name:'ddmgcod',
       label: 'letter.GCO_code',
       style:'width:100%',
       fixedWidth:'350px',
       maxLength:'8',
       rules: 'required',value:'',
       isList:true,
       isQuery: true,
       isEdit: false,
        queryValue: '',
        
        listRender(scope, item, colmuns, tableData, cellConfig) { 
          let rowData = scope.row;
          let gcos = rowData['odm_list'];
          // console.log('this.$createElement', );
          if (gcos) {
            let className = gcos.length > 1?'mt-1':'';
            let childs = gcos.map(gitem => {
              return this.$createElement('div', { props: { type: 'success',size:'mini' }, class: className },[gitem.ddmgcod]);
            });
            let tags = this.$createElement('div',childs)
            return tags;
          }
          
        },
      },
      {
        headerName: 'list_taxer_type',
        field: 'odmList',
        elementName: 'el-input',
        type: 'IND001',
        name:'odmList',
        label: 'list_taxer_type',
        style:'width:100%',
        maxLength:'8',
        rules: 'required', value: '',
        
        isList: true,
        listRender(scope, item, colmuns, tableData, cellConfig) { 
          let rowData = scope.row;
          //設置是否完成
          let odmMap = {
            'R': `<span class="text-success"> (${this.$t('oletter_cover_done')})</span>`
            ,
            'D': `<span class="text-danger"> (${this.$t('oletter_cover_undone')})</span>`
            ,
          }
          
          let odm_list = rowData['odm_list'];
          if (odm_list) {
            let className = odm_list.length > 1?'mt-1':'';
            let datas = odm_list.map(oitem => {
              let taxer = taxerDatas.find(item => item.value * 1 == oitem.ddmtax * 1);
              if (taxer) {
                //接口更改后，使用 ddmsta
                let status = odmMap[oitem.ddmsta];
                return `<div class="${className}"><span>${this.$t(taxer.label)}</span>${status}</div>`
              }
              
            });
            return datas.join('')
          }
        },
      },
      {
        headerName: 'base.operation',
        field:'customOperation',
        isList: true,
        notRender:true,
      }  
   ]
  },
  activated() {
    this.resetScroll();
    if (this.$route.query && this.$route.query.tabid) {
      this.activeName = this.$route.query.tabid;
      this.getDatas()
    } else {
      this.getDatas()
    }
    emptyAllOptionData();
    loadRelationOptions(this.listConfigs.columnsConfig);
   
  },
  methods: {
    //實現鈎子函數，提交前，處理需要提交的數據
    preSubmit(postData) { 
      let clonePostData = this.loadash.cloneDeep(postData);
      
      let keyMaps = {
        'pagdpt':'dpt_list',
        'pagobj':'object_list',
        'pagsig':'sign_list',
      }
      let cover_rep_config_list = optionDatas['cover_rep_config_list'];//復函内容的數據
      let closed_letter_list = optionDatas['closed_letter_list'];//復函部門的數據
      
      let dpt = closed_letter_list.data.find(item => item.value === clonePostData.ddptmec);
      if (dpt) {
        postData['ddptmec'] = dpt['langc'];
        postData['ddptmep'] = dpt['langp'];
      }
      Object.keys(postData).forEach(key => {
        if (keyMaps[key]) {
          let finded = cover_rep_config_list.data[keyMaps[key]].find(item => item.value === clonePostData[key]);
          if (finded) {
            postData[key] = finded['langc'];
            if (key === 'pagsig') {
              postData['pagsig2'] = finded['pagsig2'];
            }
          }
        }
      });
      delete postData.odmList;
      delete postData.odm_list;
      let res = {
        cover_info:postData
      }
      return res;
    },
    downloadFile(type, rowData, scope) {
      console.log(type, scope.rowData, scope)
      type = type || 'PDF' //'DOC'
      downloadFile(this.$axios, this.apiConfig.cover_rep_download, scope.rowData.ddmccod, {
            tid: scope.rowData.ddmccod,
            type: type
          })
    },
    pageChange(tabData, listConfigs) { 
      return (val,listVm) => {
        // console.log(tabData, listConfigs, val);
        this.getDatas(tabData, () => {
        });
        // this.$refs['tableList_'.tabData.key]
      }
      
    },
    getQueryHandler(tabData) { 
      return (queryConfig) => {
        this.getDatas(tabData,queryConfig)
      }
    },
    getClearHandler(tabData) { 
      return (queryConfig) => {
        queryConfig.forEach(item => {
          if (Array.isArray(item.queryValue)) {
            if (item.queryValue.length > 1) {
              item.queryValue = ['',''];
            } else {
              item.queryValue = [];
            }
            
          } else {
            item.queryValue = '';
          }
        })
        this.getDatas(tabData,queryConfig)
      }
    },
    editListHandler(rowData, configData,index, scope,tabData) { 
      // console.log(rowData, configData,index, scope,tabData)
      this.axiosRequest.queryData({
        url: this.apiConfig.cover_rep_get_cover,
        datas: {
          pagcod:scope.rowData.ddmccod
        }
      }).then(res => {
        if (res && res.status === 200) {
          this.listConfigs.rowData = Object.assign(scope.rowData,res.data);
          let temp = configData.columnsConfig;
          configData.columnsConfig = null;
          temp.forEach(item => { 
            Object.keys(this.listConfigs.rowData).forEach(key => {
              if (item.field === key) {
                if (item.isEdit) {
                  if (Array.isArray(this.listConfigs.rowData[key])) {
                    item.value = this.listConfigs.rowData[key].join(',');
                  } else {
                    item.value = this.listConfigs.rowData[key] || ''
                  }
                  console.log(item.field, item.value)
                  this.setExtInfo(key, temp);
                }
              }
              
            })
          });
          configData.columnsConfig = temp;
          configData.isShowDialog = true;
          
        }
      })
      
    },
    //設置 部門葡文， 簽署人 昵稱，名稱
    setExtInfo(key, temp) { 
      let keymaps = {
        'ddptmec': {
          listKey: 'closed_letter_list',
          extKey:'ddptmep'
        },
        'pagsig': {
          listKey: 'cover_rep_config_list',
          innerKey: 'sign_list',
          extKey:'pagsig2'
        }
      }
      if (keymaps[key]) {
        let configList = optionDatas[keymaps[key].listKey];
        if (keymaps[key].innerKey) {
          configList = configList[keymaps[key].innerKey];
        }
        let listData = configList.data;
        let val = this.listConfigs.rowData[key];
        let extField = temp.find(item => item.field === keymaps[key].extKey);
        let finded = listData.find(data => data.value === val);
        if (!finded) {
          extField.isEdit = true;
          extField.headerName = 'letter.letterBusiness_pt';
          extField.value = this.listConfigs.rowData[keymaps[key].extKey]
        }
      }
    },
    deleteListHandler(rowData, configData, index, scope, tabData) { 
      this.$confirm(this.$t('tips_confirm_delete_record')+'?', this.$t('button.delete'), {
        confirmButtonText:this.$t('button.confirm'),
        cancelButtonText: this.$t('button.back'),
        customClass:'panel-dialog-box'
      }).then(res => {
        // configData.listConfigs.tableDatas.splice(index, 1);
        this.getDatas();
      })
     
      console.log(rowData, configData,index, scope)
    },
    triggerHandler(target, val) { 
      // console.log('triggerhandler',target,val)
      return target.renderData.call(this, (val+''));
    },
    handleTabClick(panel, ev) { 
      let finded = this.tabDatas.find(item => item.key == panel.name);
      this.getDatas(finded);
      this.$router.push({
        query: {
          tabid:panel.name
        }
      })
      // console.log(panel, ev,finded);
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val;
      this.submitForm(2);
    },
    getDatas() { 
      let submits = [];
      submits.push(this.$validator.validateAll()); //自己新增的表单元素的验证，

      return Promise.all(submits).then((results) => {
        if (results.indexOf(false) > -1) {
          return;
        }
        const getData = this.listConfigs;
        // 校验全部通过处理
        let postData = _.cloneDeep({});
        getData.columnsConfig.forEach((item) => {
          if (item.isQuery) {
            let val = item['queryValue'];
            if (Array.isArray(val)) {
              val = val.join(',');
            }
            postData["filter." + item.field] = val
          }
        });
        postData["page.size"] = getData.pageInfo.pageSize;
        postData["page.num"] = getData.pageInfo.pageNum || 1;
        setSortInfo(postData, getData.sortInfo);
        console.log(postData);
        this.axiosRequest
          .queryData({
            url: this.apiConfig.cover_rep_list,
            datas: postData,
          })
          .then((res) => {
            if (res.status === 200 && res.data) {
              this.isShow = true;
              getData.tableDatas = res.data;
              this.setResponsePageInfo(getData.pageInfo, res.page);
              // this.$refs.tableList.doLayout();
            }
            // callback && callback();
            
          });
      }).then(e => {
        console.log('-------------error')
        console.log(e);
      });
    },
    submitForm(type) {
      
    },

    deleteItem(rowData, index) {
      this.$confirm(this.$t("tips.confirmDeleteUser",{username:rowData.cgpmec}), this.$t("tips.tip"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning",
      })
        .then(() => {
          this.axiosRequest
            .postData({
              url: this.apiConfig.delete_role_by_role_code,
              datas: {
                role_code: rowData.cgpno,
              },
            })
            .then((res) => {
              if (res.status == 200) {
                this.submitForm(2);
              }
            });
        })
        .catch(() => {});
    },

    goDetail(scope) {
      this.showDetailPage(scope.scope.row.rolename);
    },
  
    resetForm() {
      
      this.submitForm();
    },
  },
  watch: {},
};