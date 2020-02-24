<template>
  <div class="table">
    <el-button
      v-if="isShowDetail"
      type="text"
      size="small"
      class="operateBtn btn-judge"
      @click="back"
      style="width:83px !important;position: absolute;margin-top:-10px;"
    >返回上一级</el-button>
    <div class="table-box">
      <el-table
        v-if="!isShowDetail"
        empty-text="暂无数据"
        :data="tableData"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="name" label="申请人" min-width="300" />
        <el-table-column prop="test" label="申请内容" min-width="300" />
        <el-table-column prop="time" label="申请时间" min-width="300" />
        <el-table-column v-if="!isShowDetail" label="操作" min-width="340px">
          <template slot-scope="scope">
            <el-button
              v-if="!isShowDetail&&ask.judge"
              type="text"
              size="small"
              class="operateBtn btn-judge"
              @click="handleJudgeClick(scope.row)"
              style="width:83px;"
            >审核</el-button>
            <el-button
              v-if="!isShowDetail&&ask.houseDetail "
              type="text"
              size="small"
              class="operateBtn btn-detail"
              @click="handleDetailClick(scope.row)"
            >房屋详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 房屋详情 -->
      <el-table v-if="isShowDetail" empty-text="暂无数据" :data="tableData" class="detail-class">
        <el-table-column prop="data.userHouseBuilding" label="楼栋" min-width="50" />
        <el-table-column prop="data.userHouseUnit" label="单元" min-width="50" />
        <el-table-column prop="data.userHouseNumber" label="门牌号" min-width="80" />
        <el-table-column prop label min-width="1" />

        <el-table-column prop="data.Housingarea" label="房屋面积(m²)" min-width="120" />
        <el-table-column prop="data.typeName" label="房屋类型" min-width="80" />
        <el-table-column prop="data.Price" label="物业费单价(元)" min-width="120" />-->
        <el-table-column label="房屋状态" min-width="90">
          <template slot-scope="scope1">
            <p v-html="Number(scope1.row.data.state)===1?'未交房':'已交房'"></p>
            <p
              :class="Number(scope1.row.data.zx_tapy)===1?'red':''"
              style="font-size:12px;"
              v-html="Number(scope1.row.data.zx_tapy)===1?'(装修未办理)':'(装修已办理)'"
            ></p>
          </template>
        </el-table-column>
        <el-table-column prop="data.checktime" label="交房时间" min-width="120" />
        <el-table-column prop="data.wuye_price" label="物业费到期时间" min-width="130" />
        <el-table-column prop="data.centn" class-name="note" label="房屋备注" min-width="150" />
        <el-table-column v-if="!isShowDetail" label="操作" min-width="340">
          <template slot-scope="scope">
            <el-button
              v-if="!isShowDetail&&ask.judge"
              type="text"
              size="small"
              class="operateBtn btn-judge"
              @click="handleJudgeClick(scope.row)"
              style="width:83px;"
            >审核</el-button>
            <el-button
              v-if="!isShowDetail&&ask.houseDetail "
              type="text"
              size="small"
              class="operateBtn btn-detail"
              @click="handleDetailClick(scope.row)"
            >房屋详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="340">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-judge"
              @click="handleRecordClick(scope.row)"
              style="width:67px !important;background:#cccccc !important;"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'Table',
  props: ['tableData', 'isShowDetail'],
  data () {
    return {
      ask: {
        houseDetail: '',
        judge: '',
        delete: '',
        add: '',
        import: '',
        modify: '',
        houseInfo: '',
        carInfo: '',
        record: '',
        download: ''
      },
      a: 'aa',
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    //获取按钮权限
    this.askRequest()
  },
  methods: {
    //获取按钮权限
    askRequest () {
      const { Communityid, uid } = this.userInfo
      const auth_id = this.$route.meta.auth_id
      postSelect_button({ Communityid, uid, auth_id }).then(res => {
        if (res.code === 200) {
          this.buttonLists = res.data
          var btnList = this.buttonLists
          btnList.forEach(item => {
            if (item.auth_name === '房屋详情') {
              this.ask.houseDetail = true
            }
            if (item.auth_name === '审核') {
              this.ask.judge = true
            }
          })
        }
      })
    },
    toFather () {
      this.$emit('bridge', '我是小二')
    },
    handleDetailClick (v) {
      this.$emit('fun1', v)
    },
    handleJudgeClick (v) {
      this.$emit('fun2', v)
    },
    handleModifyClick (v) {
      this.$emit('fun3', v)
    },
    handleUserClick (v) {
      this.$emit('fun4', v)
    },
    handleCarClick (v) {
      this.$emit('fun5', v)
    },
    handleRecordClick (v) {
      this.$emit('fun6', v)
    },
    back () {
      this.$emit('back')
    }

  }

}
</script>

<style lang='scss' scoped>
/deep/.note {
  position: relative;
  .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/deep/.table-box {
  min-width: 1080px;
  position: absolute;
  top: 20px;
  z-index: 0;
  width: 100%;
}
/deep/.el-table--scrollable-x .el-table__body-wrapper {
  overflow: hidden;
}

.red {
  color: #f44;
}
/deep/.btn-judge {
  width: 52px !important;
  background: #25bad9;
}
/deep/.btn-detail {
  background-color: #1fbba6;
}
/deep/.operateBtn {
  color: #fff;
  display: inline-block;
  border-radius: 4px;
  height: 30px;
  padding: 4px;
  width: 72px;
  font-size: 14px;
}
.detail-class {
  /deep/td {
    padding: 8px 0px !important;
  }
}
</style>