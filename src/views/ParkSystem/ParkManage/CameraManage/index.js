import Vue from 'vue';
import plates from './index.vue';

const varps={
    install(Vue,options){
        Vue.component(plates.name, plates);
    }
};

// 新增
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(varps);
}
export default varps