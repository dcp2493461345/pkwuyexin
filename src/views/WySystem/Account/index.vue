<template>
  <div id="account">
    账号分配11
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Account',
  created() {
    console.log('hahaha121212')
    // location.reload()
    document.addEventListener('keydown', this.aa, false)
    window.event.returnValue = 'sss'
  },
  methods: {
    aa(e) {
      if (e.keyCode === 116) {
        e.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#account {
  width: 98.36%;
  height: 88.07vh;
  margin: 2vh auto;
  .zhanghao {
    width: 100%;
    height: 85.46vh;
    .add {
      width: 4.16vw;
      height: 2.96vh;
      line-height: 0.5vh;
      background: rgba(37, 186, 217, 1);
      border-radius: 5px;
      border: none;
      outline: none;
      font-size: 0.72vw;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      margin-left: 1.56vw;
      margin-top: 2.77vh;
    }
    .el-button--default {
      width: 2.91vw;
      height: 2.96vh;
      background: rgba(37, 186, 217, 1) !important;
      border-radius: 4px;
      font-size: 0.72vw;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    .el-button--mini {
      width: 2.91vw;
      height: 2.96vh;
      background: rgba(191, 191, 191, 1);
      border: none;
      border-radius: 4px;
      font-size: 0.72vw;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>

<style lang='scss'>
.el-tabs--border-card > .el-tabs__header {
  background: #f3f3f3;
}
.el-tabs__item {
  width: 6.6vw;
}
.el-table thead {
  font-size: 0.72vw;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(144, 147, 153, 1);
}
.cell {
  margin-left: 112px;
}
/deep/.el-pagination__editor {
  background-color: #f00 !important;
}
</style>
