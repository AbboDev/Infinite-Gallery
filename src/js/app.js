/**
 *
 * @version 1.0
 * @author Thomas Abbondi
 */

import 'babel-polyfill';

import Vue from 'vue';
import App from './App.vue';

import HTTP from './commons/axios.js';

Vue.config.productionTip = false;
Vue.prototype.$http = HTTP;

Vue.prototype.$appName = 'Infinite Gallery';

new Vue({
  el: '#app',
  render: (h) => h(App)
});
