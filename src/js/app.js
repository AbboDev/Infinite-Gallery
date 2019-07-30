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
Vue.prototype.$http = HTTP;

import storage from './commons/storage.js';
Vue.prototype.$storage = storage;

import LazyLoadDirective from './directives/LazyLoadDirective';
Vue.config.productionTip = false;

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
