'use strict';

var store = (function() {
  var base = (typeof site_url === 'undefined' || site_url === null)
    ? site_url
    : window.location.origin;

  var obj = {
    debug: true,
    state: {
      baseUrl: site_url,
      readerUrl: "/reader.php",
      imagesUrl: "/images/",
      downloaderSingleUrl: "/downloader-single.php",
      downloaderMultipleUrl: "/downloader-multiple.php",

      slides: [],
      count: 0,
      selected: [],
      currentSlide: 0,
      sliderOpened: false
    },
    toggleValueFromSelected(value) {
      var selected = this.state.selected;

      if (selected.includes(value)) {
        selected.splice(selected.indexOf(value), 1);
      } else {
        selected.push(value);
      }
    },
    changeSlide(index) {
      this.state.currentSlide = index;

      this.state.sliderOpened = true;
    },
    closeSlider() {
      this.state.sliderOpened = false;
    },
    downloadSingleImage(image) {
      var img = encodeURIComponent(image);

      window.open(this.state.downloaderSingleUrl + "?img=" + img);
    },
    downloadMultipleImages(images) {
      var xhr = (window.XMLHttpRequest)
        ? new XMLHttpRequest()
        : new ActiveXObject("Microsoft.XMLHTTP");

      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          window.open(this.responseText);
        }
      };

      xhr.open('POST', this.state.downloaderMultipleUrl, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send("imgs=" + images);
    }
  };

  obj.state.imagesUrl = obj.state.baseUrl + obj.state.imagesUrl;
  obj.state.readerUrl = obj.state.baseUrl + obj.state.readerUrl;
  obj.state.downloaderSingleUrl = obj.state.baseUrl + obj.state.downloaderSingleUrl;
  obj.state.downloaderMultipleUrl = obj.state.baseUrl + obj.state.downloaderMultipleUrl;

  (function(url, callback) {
    var xhr = (window.XMLHttpRequest)
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");

    xhr.open('GET', url, true);
    xhr.send();

    var images = [];

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        try {
          var json = JSON.parse(this.responseText);

          if (json.length) {
            for (var i = json.length - 1; i >= 0; i--) {
              images.unshift(json[i]);
            }
          }
        } catch(e) {}
        callback(images);
      }
    };
  })(obj.state.readerUrl, function(data) {
    obj.state.slides = data;
    // obj.state.loadedSlides = obj.getPartialSlides(obj.state.currentChunk, obj.state.chunkOffset);
  });

  return obj;
})();

/**
 *
 */
Vue.use(VueLazyload, {
  attempt: 1,
  preLoad: 1.3,
  loading: 'assets/loading.gif',
});

// Vue.use(InfiniteLoading);

new Vue({
  el: '#carousel',
  components: {
    'carousel': VueCarousel.Carousel,
    'slide': VueCarousel.Slide
  },
  data: {
    private: {},
    shared: store.state
  },
  methods: {
    closeSlider: function() {
      store.closeSlider();
    }
  },
  template: `
  <div id="carousel" :class="{ 'is-active': shared.sliderOpened }">
    <a href="#" class="c-carousel__closer" @click="closeSlider"></a>
    <div class="c-carousel__handler">
      <carousel
        :navigationEnabled="true"
        :paginationEnabled="false"
        :perPage="1"
        :navigateTo="shared.currentSlide"
      >
        <slide v-for="(slide, index) in shared.slides" :data-index="index">
          <div class="o-slide" v-lazy:background-image="shared.imagesUrl + slide"></div>
        </slide>
      </carousel>
    </div>
  </div>`
});

new Vue({
  el: '#grid',
  data: {
    shared: store.state,
    private: {
      busy: false,
      maxBox: 12,
      currentChunk: 0,
      loadedSlides: store.state.slides.slice(0, 18)
    }
  },
  methods: {
    loadMoreBox: function() {
      var self = this;
      self.private.busy = true;
    },
    downloadSingleImage: function(event) {
      event.preventDefault();

      var self = event.target;
      var thumb = self.parentElement;

      store.downloadSingleImage(thumb.dataset.image);
    },
    toggleSelectedImage: function(event) {
      event.preventDefault();

      var self = event.target;
      var thumb = self.parentElement;
      var thumbImage = thumb.dataset.image;

      store.toggleValueFromSelected(thumbImage);
    },
    openAndScrollCarousel: function(event) {
      event.preventDefault();

      var self = event.target;
      var thumb = self.parentElement;
      var thumbIndex = thumb.dataset.index;

      store.changeSlide(thumbIndex);
    }
  },
  template: `
  <div id="grid">
    <div
      v-infinite-scroll="loadMoreBox"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="true"
      infinite-scroll-listen-for-event=""
    >
      <div v-for="(slide, index) in shared.slides" class="o-thumb" :data-image="slide" :data-index="index">
        <div class="o-thumb__image" v-lazy:background-image="shared.imagesUrl + slide"></div>
        <input type="checkbox" class="o-thumb__command o-thumb__command--select" @change="toggleSelectedImage" />
        <a href="#" @click="downloadSingleImage" class="o-thumb__command o-thumb__command--download"></a>
        <a href="#" @click="openAndScrollCarousel" class="o-thumb__command o-thumb__command--show"></a>
      </div>
    </div>
    <span :class="[{ 'is-active': private.busy }, 'c-thumb__loader']"></span>
  </div>`
});

// shared.slides.slice(private.currentChunk, private.maxBox)

/**
 *
 */
new Vue({
  el: '#downloader',
  data: {
    private: {

    },
    shared: store.state
  },
  methods: {
    downloadedSelectedImages: function(event) {
      event.preventDefault();

      for (var i = this.shared.selected.length - 1; i >= 0; i--) {
        store.downloadSingleImage(this.shared.selected[i]);
      }
      // store.downloadMultipleImages(this.shared.selected);
    }
  },
  template: `
  <div id="downloader" :class="{ 'is-active': shared.selected.length }">
    <a href="#" @click="downloadedSelectedImages"></a>
  </div>`
});
