<template>
  <div class="datailDialog">
    datailDialog
    <el-dialog
      title="申请修改详情"
      visible.sync="true"
      class="position:fixed;top:10px;"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form ref="form2" :model="detailData" label-width="380px">
        <div class="row">
          <span>房屋类型1:</span>
          <span>aa</span>
          <span>修改为:</span>
          <span>bb</span>
        </div>
        <div class="row">
          <span>楼栋:</span>
          <span>cc</span>
          <span>修改为:</span>
          <span>dd</span>
        </div>
        <div class="row">
          <span>单元:</span>
          <span>cc</span>
          <span>修改为:</span>
          <span>cc</span>
        </div>
        <div class="row">
          <span>门牌号:</span>
          <span>cc</span>
          <span>修改为:</span>
          <span>cc</span>
        </div>
        <div class="row">
          <span>房屋面积:</span>
          <span>cc</span>
          <span>修改为:</span>
          <span>cc</span>
        </div>
        <div class="row">
          <span>物业费单价:</span>
          <span>cc</span>
          <span>修改为:</span>
          <span>cc</span>
        </div>

        <div class="row" style="position:relative; height:100px;">
          <span style="position:absolute;left:0">*申请理由:</span>
          <textarea
            rows="1"
            cols="40"
            style="position:absolute;left:85px;resize:none;max-height:100px;padding:5px;overflow:scroll;overflow-y:hidden;overflow-x:hidden"
            onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
            onblur="clearInterval(this.clock);"
          />
        </div>
        <div class="addNow" style="cursor:pointer" @click="agreen">同意</div>
        <div class="addNow" style="cursor:pointer" @click="refuse">拒绝</div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DetailDialog",
  props: ['detailData'],
  data () {
    return {

    }
  },
  methods: {
    agreen () {
      this.$emit("agreen")
    },
    refuse () {
      this.$emit("refuse")
    }
  }

}
</script>

<style>
</style>