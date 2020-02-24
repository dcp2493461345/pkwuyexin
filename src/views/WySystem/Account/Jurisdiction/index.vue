<template>
  <div id="Jurisdiction">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Jurisdiction',
  created() {
    document.addEventListener('keydown', this.aa, false)
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
<style scoped>
/* .box1 {
  position: relative;
  display: block;
  width: 500px;
  height: 600px;
}
.box1 .img1 {
  display: block;
  width: 100%;
  height: 100%;
}
.box1 .box2 {
  position: absolute;
  top: 0px;
  display: none;
}
.box1:hover .box2 {
  display: block;
} */
</style>
