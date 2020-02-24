<template>
  <!-- 分页 -->
  <div class="block">
    <p
      class="record-data"
    >共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页&nbsp;共{{ pageInfo.total }}条</p>
    <el-pagination
      background
      :page-size="pageInfo.listRows"
      layout="prev, pager, next, jumper"
      :total="pageInfo.total"
      :current-page="pageInfo.page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @next-click="nextClickHandler"
    />
  </div>
</template>

<script>
export default {
  name: "Pages",
  props: ['pageInfo'],
  data () {
    return {

    }
  },
  //     watch: {
  //       'pageInfo.total':{
  //         handler: function(){
  //           console.log('uhhuhuhuhuh')
  //         },
  //         deep: true
  // 　

  // 　　　　
  //       },
  //     },

  created () {
    // alert(this.pageInfo.total)
  },
  methods: {
    handleSizeChange () {
      this.$emit("handleSizeChange")
    },
    handleCurrentChange () {
      this.$emit("handleCurrentChange")
    },
    nextClickHandler () {
      this.$emit("nextClickHandler")
    }
  }
}
</script>

<style lang="scss" scoped>
//分页器的样式
.block {
  .record-data {
    cursor: default;
    display: inline-block;
    line-height: 18px;
    margin-top: 17px;
    position: absolute;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  position: absolute;
  // bottom: 3px;
  top: 720px;
  height: 40px;
  width: 100%;
  .el-pagination {
    position: absolute;
    top: 13px;
    right: -9px;
    width: 235px;
    /deep/button {
      min-width: 24px !important;
      height: 24px;
      cursor: default;
    }
    /deep/.el-pagination__jump {
      position: relative;
      margin-left: 5px;
      background: #5fafe4;
      height: 24px;
      border-radius: 3px;
      color: #fff;
      font-size: 0px;
      //input和ul是否居中
      margin-top: 0px;
      .el-input {
        font-family: Microsoft YaHei;
        font-weight: 400;
        height: 24px;
        width: 38px;
        margin-left: 0px;
        border-radius: 3px;
        color: rgba(102, 102, 102, 1);
        outline: none;
        text-align: center;
        /deep/.el-input__inner {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          display: inline-block;
          margin-left: 48px;
          width: 40px;
          height: 24px !important;
          border: 1px solid rgba(239, 242, 245, 1) !important;
          border-radius: 3px;
          outline: none;
        }
        &::before {
          content: "前往";
          color: #fff;
          font-size: 14px;
          display: inline-block;
          position: absolute;
          margin-left: 4px;
          text-align: center;
          margin-top: 3px;
          height: 24px;
        }
        &:after {
          content: "页";
          padding-left: 10px !important;
          font-size: 14px;
          position: absolute;
          top: 3px;
        }
      }
    }
    /deep/.el-pager li {
      min-width: 24px;
      height: 24px;
      border-radius: 2px;
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
    }
  }
  /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #5fafe4;
    color: rgba(255, 255, 255, 1);
  }
}
</style>