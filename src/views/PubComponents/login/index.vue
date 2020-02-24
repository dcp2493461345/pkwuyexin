/* eslint-disable */
<template>
  <div class="wy-login-container">
    <div class="wy-login-nav">
      <span class="logo">宅-智慧社区</span>
      <ul style="cursor:pointer;">
        <li>关于我们</li>
        <div style="height:12px;border:1px solid white;margin-top:4px" />
        <li>客服服务</li>
        <div style="height:12px;border:1px solid white;margin-top:4px" />
        <li>反馈建议</li>
        <div style="height:12px;border:1px solid white;margin-top:4px" />
        <li>隐私政策</li>
      </ul>
    </div>
    <router-view style="z-index:56878;"></router-view>
    <div class="wy-login-bottom" style="z-index:56877;">
      <div class="wy-bottom" style="margin-left:-12px;">
        <span class="zi">成都同享社圈智慧科技有限公司版权所有</span>
        <span
          style="height:12px;border:1px solid white;margin-top:4px;width:2px;margin-left:277px;display: inline-block;"
        />
        <a
          href="http://www.miibeian.gov.cn/"
          target="_blank"
          style="margin-left:10px; white-space:nowrap;"
        >蜀ICP备19024682号</a>
      </div>
    </div>
    <img src="../../../assets/bg1.png" style="position:absolute;top:16%;left:20%;" />
  </div>
</template>

<script>

</script>

<style lang="scss" scoped >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgba(51, 51, 51, 1);
$btn-height: 4.2vh;
input {
  border: none;
}
.el-input__inner {
  border: none;
  outline: none;
}

.wy-login-container {
  position: relative;
  // min-height: 100%;
  min-height: 100%;
  min-width: 100%;
  background: url("../../../assets/bg.png") no-repeat center;
  background-size: 100% 100%;
  // background-image: url("../../../assets/bg1.png");
  overflow: hidden;
  .wy-login-nav {
    cursor: default;
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: space-between;
    padding: 20px 29px 0 40px;
    font-family: MicrosoftYaHei;
    font-weight: 400;

    span {
      font-size: 18px;
      width: 200px;
      white-space: nowrap !important;
    }
    ul {
      display: flex;
      padding-top: 3px;
      float: right;

      li {
        padding: 0 16px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        white-space: nowrap !important;
      }
    }
  }
}

.wy-login-bottom {
  position: absolute;
  bottom: 12px;
  color: #fff;
  font-size: 14px;
  width: 100%;
  white-space: nowrap !important;
  width: 100%;
  display: flex;
  justify-content: center;
  .zi {
    position: absolute;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    font-family: MicrosoftYaHei;
    font-weight: 400;
    cursor: default;

    white-space: nowrap;
    width: 280px;
  }
}
</style>


<style lang="scss" scoped>
$btn-height: 35px;
.el-form {
  position: absolute;
  top: 18%;
  right: 12%;
  min-width: 350px;
  height: 420px;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 14px;
  padding: 40px 35px !important;
  .el-form-item {
    position: relative;
    width: 100%;
    height: 43px !important;
    margin-bottom: 0px !important;
    margin-top: 12px;
    border-bottom: 1px solid rgba(160, 160, 160, 1);
    .el-input {
      width: 82%;
      border: none;
      font-size: 16px;
      // margin-top: 1vh;
      .el-input__inner {
        border: none;
        outline: none;
        height: 20px !important;
        padding: 0 10px;
        color: #999999;
      }
      .el-input__inner::-webkit-input-placeholder {
        font-size: 0.9vw;
      }
      .el-input__inner::-moz-placeholder {
        font-size: 0.9vw;
      }
    }
  }
  // .wy-form-item {
  //   margin-bottom: 2.2vh !important;
  //   // background-color: #f00;
  // }

  .el-button {
    width: 100%;
    height: 35px;
    background: rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 6px;
    box-sizing: border-box;
  }
}
.ttt {
  width: 500px;
  height: 500px;
  background-color: #f00;
}
</style>
