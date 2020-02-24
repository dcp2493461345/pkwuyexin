import mypages from './eleComponents/pageNations/pages.vue'
import Dialog from './eleComponents/pageNations/dialog.vue'


export default {
  install: (Vue) => {
    Vue.component('my-pages', mypages)
    Vue.component('dialog-card', Dialog)
  }
}
