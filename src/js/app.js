/**
 *
 * @version 1.0
 * @author Thomas Abbondi
 */

import 'babel-polyfill';

import Vue from 'vue';
import App from './App.vue';
import Carousel from './components/Carousel.vue';
import Downloader from './components/Downloader.vue';

import HTTP from './commons/axios.js';
import storage from './commons/storage.js';

import LazyLoadDirective from './directives/LazyLoadDirective';

Vue.config.productionTip = false;

Vue.prototype.$http = HTTP;
Vue.prototype.$storage = storage;
Vue.prototype.$appName = 'Infinite Gallery';

Vue.directive('lazyload', LazyLoadDirective);

new Vue({
  el: '#app',
  render: (h) => h(App)
});

new Vue({
  el: '#carousel',
  render: (h) => h(Carousel)
});

new Vue({
  el: '#downloader',
  render: (h) => h(Downloader)
});
