<template>
  <div class="choice-main">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { Message } from 'element-ui'
export default {
  name: "pay",
  data () {
    return {
    }
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.choice-main {
  width: 820px;
  height: 425px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  padding: 25px 33px 40px 33px;
  background: rgba(255, 255, 255, 1);
  border-radius: 11px;
  .el-col {
    margin-top: 30px;
  }
}
</style>
