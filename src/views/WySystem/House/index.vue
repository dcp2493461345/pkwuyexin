<template>
  <div id="house">
    房屋信息
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'House',
  created() {
    console.log(this.$route)
  }
}
</script>
