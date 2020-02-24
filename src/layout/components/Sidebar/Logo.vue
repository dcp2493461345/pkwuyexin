<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <a v-if="collapse" key="collapse" class="sidebar-logo-link">
        <img v-if="logo" src="../../../images/txsq.png" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </a>
      <a v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" src="../../../images/txsq.png" class="sidebar-logo" />
        <h1 class="sidebar-title" style="cursor:default;">{{ title }}</h1>
      </a>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      title: '宅-物业',
      logo: '../../../images/txsq.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #ffffff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    // background-color: #f00;
    cursor: default;

    & .sidebar-logo {
      width: 35px;
      vertical-align: middle;
      margin-right: 0.3vw;
    }

    & .sidebar-title {
      display: inline-block;
      // height: 50px;
      margin: 0;
      color: rgb(82, 72, 72);
      font-weight: 600;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
