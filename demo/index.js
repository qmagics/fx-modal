import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
    },
    mutations: {

    },
    actions: {
    },
    modules: {
    }
})

import FxModal from "../src";
Vue.use(FxModal, { store });

new Vue({
    store,
    render: r => r(App)
}).$mount('#app');