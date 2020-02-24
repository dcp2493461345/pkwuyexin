<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-if="ishowAdd" id="newadd" @click="isShow1">新增权限</span>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="poname" label="职位" min-width="220" />
          <!-- <el-table-column prop="po_notes" label="职位描述" min-width="400" @mouseleave="mouseHandler" /> -->
          <el-table-column prop="po_notes" label="职位描述" min-width="400" class="des-class">
            <template slot-scope="scope">{{ scope.row.po_notes }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="185">
            <template slot-scope="scope">
              <el-button
                v-if="isShowEdit"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button>
              <el-button
                v-if="isShowDelte"
                class="el-btn2"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 分页 -->
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="mypage-calss"></my-pages>
    <p v-if="hongShow" class="hongdian" />
    <!-- 创建/修改职位弹框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="26.04%"
      center
      custom-class="createJobDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="37%"
    >
      <span slot="title">{{ title1 }}职位</span>
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
        <div class="form-item" style="height: 60px;">
          <el-form-item label="职位:" class="zhiwei">
            <input
              v-model="formLabelAlign.name"
              type="text"
              style="width:286px; border:1px solid rgba(210,210,210,1);height:32px; border-radius:4px; color:#333;"
              @keyup.enter="getCheckedKeys"
            />
            <p class="mistack-message">{{ mistakeToast }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height: 60px;">
          <el-form-item label="职位描述:">
            <input
              ref="nameInput"
              v-model="formLabelAlign.region"
              type="text"
              style="width:100%; border:1px solid rgba(210,210,210,1);height:32px; width:200px;
border-radius:4px;"
              @keyup.enter="getCheckedKeys"
            />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getCheckedKeys">下一步</el-button>
      </span>
    </el-dialog>

    <!--XXXX 权限设置遮罩层 （树形控件）-->
    <el-dialog
      :visible.sync="centerDialogVisible1"
      width="24.43%"
      top="37%"
      :append-to-body="true"
      :close-on-click-modal="false"
      class="tree-content1"
    >
      <span slot="title" class="dialog-footer">{{ formLabelAlign.name }}权限设置</span>
      <el-tree
        ref="tree"
        empty-text="暂无数据"
        :auto-expand-parent="false"
        :data="treeData"
        class="tree-content"
        show-checkbox
        check-on-click-node
        get-current-node
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="[1,47]"
        :props="defaultProps"
        disabled="true"
        :highlight-current="false"
        @keyup.enter="successAddTo"
        @node-click="nodeClick"
        v-loading="loadingTree"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="successAddTo"
          v-loading="loading2"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >完成</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹框 -->
    <dialog-card
      content="是否删除该职位?"
      :centerDialogVisible="centerDialogVisible3"
      @ensureHandler="delteHandler"
      @cancelHandler="cancelHandler1"
      @beforeClose="cancelHandler1"
      :loading="loading1"
    ></dialog-card>
    <!--修改时XXXX 权限设置遮罩层 -->
    <el-dialog
      :visible.sync="centerDialogVisible2"
      width="24.43%"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      class="tree-content1"
    >
      <span slot="title" class="dialog-footer">{{ formLabelAlign.name }}权限设置</span>
      <el-tree
        ref="tree1"
        :check-strictly="true"
        empty-text="暂无数据"
        :auto-expand-parent="false"
        :data="treeData1"
        class="tree-content"
        show-checkbox
        check-on-click-node
        get-current-node
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        disabled="true"
        :highlight-current="false"
        @keyup.enter="successAddTo"
        @node-click="nodeClick"
        v-loading="loadingTree1"
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="successModify"
          v-loading="loading3"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { postSelect_button, postSelect_list, postSelect_jurisdiction, postSelect_add, postSelect_add_list, postDelete_list, postUpdete_add_list, postUpdete_list, postToexamine_list } from '@/api/Jurisdiction'
export default {
  components: {},
  //data数据
  data () {
    return {
      hongShow: false,
      ishowAdd: false,//控制新增权限按钮显示
      isShowDelte: false,//控制删除按钮显示
      isShowEdit: false,//控制修改按钮显示
      tableData: [], // 后端返回的总的表格数据
      tableList: [], // 点击分页时渲染表格的数据
      centerDialogVisible: false,//创建职位弹框
      centerDialogVisible1: false,//权限设置弹框
      centerDialogVisible2: false,//修改设置弹框
      centerDialogVisible3: false, // 删除弹框
      labelPosition: 'right',
      formLabelAlign: {
        name: '',//职位
        region: '',//职位描述
        type: ''
      },
      treeData: [],//添加时的权限组
      treeData1: [],//修改时的权限组
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      value: true,
      mistakeToast: '',//职位错误提示
      userInfo: {},
      title1: '创建',
      defaultCheckedKeys: null,
      defaultCheckedKeysData: [],
      updataQuerys: {},//修改需要的参数
      poid: '', // 调用修改接口时的参数poid

      delePoid: null,//每条数据的poid
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      loading: false,//添加权限点击下一步的加载中状态控制
      loading1: false,//删除的加载中状态控制
      loading2: false,//添加权限点击完成的加载中状态控制
      loading3: false,//修改权限点击完成的加载中状态控制
      loadingTree: false,//
      loadingTree1: false,
      menu_id: [],//添加时传给后端的menu_id
      menu_id1: [],//修改时传给后端的menu_id
    }
  },
  computed: {
    ...mapState(['secondRouterLists'])
  },
  created () {
    // 拉取用户信息
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    //判定红点是否存在
    postToexamine_list({ Communityid, uid }).then(resp => {
      if (resp.msg.data.length) {
        if (this.secondRouterLists.children) {
          this.secondRouterLists.children.forEach(item => {
            if (item.meta.title === '帐号审核') {
              this.hongShow = true
            } else {
              this.hongShow = false
            }
          })
        }
      }
    })
    //按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '删除') {
            this.isShowDelte = true
          }
          if (list.auth_name === '修改') {
            this.isShowEdit = true
          }
          if (list.auth_name === '新增权限') {
            this.ishowAdd = true
          }
        })
      }
    })
    // 请求表格中的数据
    this.getTableLists()
  },
  methods: {
    // 查询权限列表数据
    getTableLists () {
      const { Communityid, uid } = this.userInfo
      const page = this.pageInfo.page
      postSelect_list({ Communityid, uid, page }).then(resp => {
        // console.log(resp, '查询列表数据')
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
        if (resp.msg.data.length === 0) {
          this.pageInfo.page = resp.msg.page - 1
          this.getTableLists()
        }
      })
    },
    //树形控件效果设置
    nodeClick (data, node) {
      if (data.label !== '首页') {
        this.childNodesChange(node)
        this.parentNodesChange(node)
      }
    },
    childNodesChange (node) {
      let len = node.childNodes.length
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false;
        this.childNodesChange(node.childNodes[i]);
      }
    },
    parentNodesChange (node) {

      if (node.parent) {
        for (let key in node) {
          if (key == "parent") {
            node[key].checked = true;
            this.parentNodesChange(node[key]);
          } else {
            // console.log(node.parent,'hahahh')
          }
        }
      }
    },
    handleEdit (index, row) {
      this.title1 = '修改'
      this.mistakeToast = ''
      this.loading = false
      this.formLabelAlign.name = row.poname
      this.formLabelAlign.region = row.po_notes
      this.centerDialogVisible = !this.centerDialogVisible
      const { poid, menu_id } = row
      this.defaultCheckedKeys = menu_id.split(',')
      this.poid = poid
      //调用查询权限组接口
      const { Communityid, uid } = this.userInfo
      postSelect_jurisdiction({ Communityid, uid }).then(resp => {
        const allTrees = resp.msg
        //区分首页和其他节点的效果
        allTrees.forEach(item => {
          if (item.label === '首页') {
            // console.log(item, 'item')
            item.disabled = true
            if (item.children) {
              item.children.forEach(list => {
                if (list.label === "仅查看首页") {
                  list.disabled = true
                }
              })
            }
          } else {
            item.disabled = false
          }
        })
        //处理过后的数据渲染
        this.treeData1 = allTrees
        console.log(allTrees, 'allTreesallTrees')
        this.loadingTree1 = false
      })
    },
    delteHandler (data) {
      //loading1状态为true
      this.loading1 = data
      const poid = this.delePoid
      postDelete_list({ poid }).then(resp => {
        this.loading1 = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: "success"
          })
          this.centerDialogVisible3 = false
          this.getTableLists()
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          })
          this.centerDialogVisible3 = false
        }
      })
    },
    handleDelete (index, row) {
      this.loading1 = false
      this.centerDialogVisible3 = true
      this.delePoid = row.poid
    },
    //删除弹框点击取消
    cancelHandler1 () {
      this.centerDialogVisible3 = false
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getTableLists()
    },
    // 点击新增权限
    isShow1 () {
      this.centerDialogVisible = !this.centerDialogVisible
      this.formLabelAlign.name = ''
      this.formLabelAlign.region = ''
      this.mistakeToast = ''
      this.loading = false
      this.title1 = '创建'
      const { Communityid, uid } = this.userInfo
      //调用查询权限组接口
      postSelect_jurisdiction({ Communityid, uid }).then(resp => {
        // console.log(resp, 'ffffffffffffff')
        this.defaultCheckedKeys = []
        const allTrees = resp.msg
        //区分首页和其他节点的效果
        allTrees.forEach(item => {
          if (item.label === '首页') {
            // console.log(item, 'item')
            item.disabled = true
            if (item.children) {
              item.children.forEach(list => {
                if (list.label === "仅查看首页") {
                  list.disabled = true
                }
              })
            }
          } else {
            item.disabled = false
          }
        })
        this.treeData = allTrees
      })
    },
    // （点击下一步）
    getCheckedKeys () {
      this.loading = true
      this.loading2 = false
      this.loading3 = false
      const { Communityid, uid } = this.userInfo
      if (this.title1 === '创建') {
        const poname = this.formLabelAlign.name
        postSelect_add_list({ Communityid, poname }).then(resp => {
          this.loading = false
          if (resp.code === 401) {
            this.mistakeToast = resp.msg
            setTimeout(() => {
              this.mistakeToast = ''
            }, 2000)
          } else if (resp.code === 200) {
            //清空被选中的选择框
            this.defaultCheckedKeys = null
            //创建职位弹框消失
            this.centerDialogVisible = false
            //树形控件弹框出现
            this.centerDialogVisible1 = true
          }
        })
      } else {
        //如果为修改
        const poname = this.formLabelAlign.name
        const poid = this.poid
        postUpdete_add_list({ Communityid, poname, poid }).then(resp => {
          this.loading = false
          if (resp.code === 401) {
            this.mistakeToast = resp.msg
            setTimeout(() => {
              this.mistakeToast = ''
            }, 2000)
          } else if (resp.code === 200) {
            //创建职位弹框消失
            this.centerDialogVisible = false
            //修改树形控件弹框出现
            this.centerDialogVisible2 = true
            //调用查询权限组接口
            postSelect_jurisdiction({ Communityid, uid }).then(resp => {
              const allTrees = resp.msg
              //区分首页和其他节点的效果
              allTrees.forEach(item => {
                if (item.label === '首页') {
                  // console.log(item, 'item')
                  item.disabled = true
                  if (item.children) {
                    item.children.forEach(list => {
                      if (list.label === "仅查看首页") {
                        list.disabled = true
                      }
                    })
                  }
                } else {
                  item.disabled = false
                }
              })
              //处理过后的数据渲染
              this.treeData1 = allTrees
            })
          }
        })
      }
    },
    // 点击完成
    successAddTo () {
      this.loading2 = true
      // 获取选中节点的keys数组
      var menu2 = this.$refs.tree.getCheckedKeys()
      const miid = this.$refs.tree.getCheckedKeys()
      const checkrdNodes = this.$refs.tree.getCheckedNodes()
      //对树中被选中的节点循环判断
      const newNodeArr = []
      checkrdNodes.forEach(item => {
        if (item.parent === 0) {
          const parentId = item.id
          if (item.children) {
            var childrenId = []
            item.children.forEach(item => {
              const id = item.id
              childrenId.push(id)
            })
          }
          const isPush = childrenId.find(items => miid.includes(items))
          if (isPush) {
            return
          } else {
            newNodeArr.push(parentId)
          }
        }
      })
      //筛选过后的数组（剔除没有子节点的父级节点）
      menu2 = menu2.filter(item => !newNodeArr.some(aaaItem => aaaItem === item))
      const { Communityid, uid } = this.userInfo
      const po_notes = this.formLabelAlign.region
      const poname = this.formLabelAlign.name
      const auth_id = menu2.join(',')
      const menu_id = this.$refs.tree.getCheckedKeys().join(',')
      // console.log(auth_id, menu_id, 'auth_id, menu_id')
      postSelect_add({ Communityid, uid, po_notes, poname, auth_id, menu_id }).then(resp => {
        this.loading2 = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: "success"
          })
          this.centerDialogVisible1 = false
          // 添加数据前的分页设置
          const nume = Number(this.pageInfo.total) / Number(10)
          if (Math.round(nume) === nume) {
            // num是整数
            var shu = Number(nume) + Number(1)
          } else {
            var shu = Math.ceil(nume)
          }
          //背景色跳到对应页数
          this.pageInfo.page = shu
          // 请求对应页数的数据
          this.handleCurrentChange(shu)
        } else {
          //添加失败
          this.$message({
            message: resp.msg,
            type: "warning"
          })
          this.centerDialogVisible1 = false
        }
      })
    },
    //修改时点击完成
    successModify () {
      this.loading3 = true
      // 获取修改选中节点的keys数组
      var menu1 = this.$refs.tree1.getCheckedKeys()
      //对树中被选中的节点循环判断
      const miid1 = this.$refs.tree1.getCheckedKeys()
      const checkrdNodes1 = this.$refs.tree1.getCheckedNodes()
      //对树中被选中的节点循环判断
      const newNodeArr1 = []
      checkrdNodes1.forEach(item => {
        if (item.parent === 0) {
          const parentId = item.id
          if (item.children) {
            var childrenId = []
            item.children.forEach(item => {
              const id = item.id
              childrenId.push(id)
            })
          }
          const isPush = childrenId.find(items => miid1.includes(items))
          if (isPush) {
            return
          } else {
            newNodeArr1.push(parentId)
          }
        }
      })
      //筛选过后的数组（剔除没有子节点的父级节点）
      menu1 = menu1.filter(item => !newNodeArr1.some(aaaItem => aaaItem === item))
      // console.log(menu1, 'menu1')
      const poid = this.poid
      const po_notes = this.formLabelAlign.region
      const poname = this.formLabelAlign.name
      const auth_id = menu1.join(',')
      const menu_id = this.$refs.tree1.getCheckedKeys().join(',')
      postUpdete_list({ poid, po_notes, poname, auth_id, menu_id }).then(resp => {
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.centerDialogVisible2 = false
          this.getTableLists()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisible2 = false
        }
      })
    },

  }
}
</script>
<style lang='scss' scoped>
//卡片的样式
/deep/.createJobDialog .el-dialog .el-dialog--center {
  background-color: #f44 !important;
}
/deep/.createJobDialog {
  /deep/.el-dialog__body {
    overflow: hidden;
    padding: 20px 50px 6px 48px !important;
    .form-item {
      height: 60px;
      .zhiwei {
        margin-bottom: 0px;
        .el-form-item__label {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 0 0 21px !important;
          white-space: nowrap;
          color: rgba(102, 102, 102, 1);
          text-align: left !important;
        }
        .el-form-item__content {
          input {
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 0px;
        margin-top: 1px;
        text-align: center;
        &__label {
          height: 30px;
          display: inline-block;
          font-size: 14px;
          padding: 0 !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        &__content {
          input {
            position: relative;
            height: 30px;
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }

      .mistack-message {
        position: relative;
        top: -13px;
        text-align: left;
        margin-left: 5px;
        box-sizing: border-box;
        font-size: 14px;
        transform: scale(0.9);
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
      }
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  min-height: 785px;
  position: relative;
  width: 100%;
  min-width: 862px;
  box-shadow: none;
  border: none;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    padding: 20px !important;

    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5 !important;
    }
    .el-table thead {
      color: #909399 !important;
    }
    .el-table td {
      padding: 15px 0 !important;
      z-index: 222;
    }
    .el-table th {
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
    .el-table .cell {
      text-overflow: ellipsis !important;
      overflow: hidden !important;
      white-space: nowrap;
      cursor: default;
      width: 400px;
      height: 30px !important;
      line-height: 30px;
      font-size: 14px;
      padding: 0 0 0 65px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      span {
        width: 100%;
        p {
          text-overflow: ellipsis !important;
          overflow: hidden !important;
          white-space: nowrap;
        }
      }
      .el-button--mini {
        width: 52px;
        height: 30px;
        background: rgba(37, 186, 217, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        padding: 0px;
        line-height: 30px;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .el-btn2 {
        background-color: #bfbfbf;
      }
    }
  }
}
//表格行样式
.tableRowStyle {
  color: #f00 !important;
  background: #f00 !important;
}

/deep/ .el-dialog {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  min-width: 380px;
  border-radius: 5px;
  .el-dialog__wrapper {
    overflow: hidden;
  }
  .el-dialog__header {
    padding: 12px 0 10px 16px;
    text-align: left;
    border-bottom: 1px solid #eff2f5;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    .el-dialog__title {
      text-align: left;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    button {
      position: absolute;
      top: 14px;
    }
  }
  /deep/.el-dialog__body {
    overflow: hidden;
    // padding: 20px 50px 6px 48px !important;
    .form-item {
      height: 60px;
      .zhiwei {
        margin-bottom: 0px;
        .el-form-item__label {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 0 0 21px !important;
          white-space: nowrap;
          color: rgba(102, 102, 102, 1);
          text-align: left !important;
        }
        .el-form-item__content {
          input {
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 0px;
        margin-top: 1px;
        text-align: center;
        &__label {
          height: 30px;
          display: inline-block;
          font-size: 14px;
          padding: 0 !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        &__content {
          input {
            position: relative;
            height: 30px;
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }

      .mistack-message {
        position: relative;
        top: -13px;
        text-align: left;
        margin-left: 5px;
        box-sizing: border-box;
        font-size: 14px;
        transform: scale(0.9);
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
      }
    }
  }
  .el-dialog__footer {
    padding-top: 0px;
    button {
      width: 62px;
      height: 30px;
      line-height: 0;
      outline: none;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      background: rgba(248, 172, 89, 1);
      border-radius: 3px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 254, 254, 1);
      margin-bottom: 4px;
    }
  }
}
.hongdian {
  width: 6px;
  height: 6px;
  background-color: #f00;
  border-radius: 5px;
  position: absolute;
  top: 26px;
  left: 240px;
}
/deep/.el-tree-node {
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(108, 108, 108, 1);
  .el-tree-node__label {
    font-size: 14px !important;
  }
  .el-tree-node__content {
    height: 30px !important;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff !important;
    cursor: default !important;
    &::after {
      color: #fff !important;
      cursor: default !important;
    }
  }
}
/deep/.el-checkbox__inner::after {
  height: 10px;
  left: 6px;
  top: 2px;
  width: 4px;
}
/deep/.el-pagination.is-background .btn-next:disabled {
  cursor: default;
}
/deep/.el-pagination.is-background .btn-prev:disabled {
  cursor: default;
}

.total-class {
  position: relative;

  .div-class {
    width: 100px;
    height: 100px;
    position: absolute;
    background: green !important;
    top: -10px;
    z-index: 25633333334444444444655555555555555555555566666666666612789;
  }
}
/deep/.el-popover {
  top: 0px !important;
  left: 10px !important;
  z-index: 56789356345554555;
}

#newadd {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 72px;
  height: 30px;
  line-height: 30px;
  background: rgba(37, 186, 217, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
}
/deep/.el-tree-node__label {
  position: relative;
}
/deep/.el-tree-node__label:before {
  content: "";
  width: 20px;
  height: 20px;
  display: block;
  position: absolute;
  top: 0px;
  left: -24px;
  z-index: 999;
}
/deep/.el-checkbox__inner {
  top: 0;
}
.tree-content1 {
  /deep/.el-dialog {
    /deep/.el-dialog__body {
      overflow: auto;
      height: 400px;
      padding: 12px 38px 24px 43px !important;
    }
    .el-dialog__footer {
      margin-top: 20px;
    }
  }
}
/deep/.el-loading-spinner {
  top: 100%;
}
/deep/.mypage-calss {
  top: 37px !important;
  .record-data {
    box-sizing: border-box;
    margin-left: 20px;
    bottom: 32px;
  }
  .el-pagination {
    bottom: 25px;
    right: 109px;
  }
}
/deep/.el-table {
  min-width: 860px;
}
</style>
