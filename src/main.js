import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';

Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
