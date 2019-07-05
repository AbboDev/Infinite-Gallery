<template>
  <div :class="['c-carousel', {'is-active': shared.sliderOpened}]">
    <a href="#" class="c-carousel__button c-carousel__closer" @click="closeSlider"></a>

    <button
      class="c-carousel__button c-carousel__arrow c-carousel__arrow--prev"
      @click="prevSlide() + cancelAutoSlide()"
      @click.native="prevSlide() + cancelAutoSlide()"
    ></button>
    <button
      class="c-carousel__button c-carousel__arrow c-carousel__arrow--next"
      @click="nextSlide() + cancelAutoSlide()"
      @click.native="nextSlide() + cancelAutoSlide()"
    ></button>

    <div class="c-carousel__pagination" v-if="showPagination">
      <span
        v-for="index in slideTotal"
        :key="index"
        :class="['c-carousel__button c-carousel__pagination__dot', {'is-active': isControlActive(index)}]"
        v-on:click="goToSlide(index - 1)"
      >
      </span>
    </div>

    <div class="c-carousel__wrapper">
      <div class="c-carousel__wrapper__container" :style="containerStyle" ref="container">
        <carousel-slide v-for="(slide, index) in shared.slides" :key="index" v-lazyload="'js-lazyload'">
          <div slot="image" class="c-slide__image js-lazyload" :data-url="shared.imagesUrl + slide"></div>
        </carousel-slide>
      </div>
    </div>
  </div>
</template>

<script>
import CarouselSlide from './Slide.vue';

export default {
  name: 'carousel',
  components: {
    CarouselSlide
  },
  data: function() {
    return {
      shared: this.$storage.state,
      activeSlideIndex: 0
    };
  },
  props: {
    transitionDuration: {
      type: String,
      default: '0.5s'
    },
    transitionTiming: {
      type: String,
      default: 'ease'
    },
    auto: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    startSlideIndex: {
      type: Number,
      default: 0
    },
    autoTiming: {
      type: Number,
      default: 5000
    }
  },
  created() {
    this.activeSlideIndex = this.startSlideIndex;
  },
  methods: {
    goToSlide(slideIndex) {
      if (slideIndex >= 0 && slideIndex < this.slideTotal) {
        this.activeSlideIndex = slideIndex;
      }
    },
    isControlActive(controlIndex) {
      return controlIndex - 1 === this.activeSlideIndex;
    },
    nextSlide() {
      if (this.activeSlideIndex === (this.slideTotal - 1)) {
        if (this.loop === true) {
          this.activeSlideIndex = 0;
        } else {
          return false;
        }
      } else {
        this.activeSlideIndex++;
      }

      return true;
    },
    prevSlide() {
      if (this.activeSlideIndex === 0) {
        if (this.loop === true) {
          this.activeSlideIndex = (this.slideTotal - 1);
        } else {
          return false;
        }
      } else {
        this.activeSlideIndex--;
      }

      return true;
    },
    closeSlider() {
      this.$storage.closeSlider();
    },
    cancelAutoSlide() {
      clearInterval(this.autoInterval);
    }
  },
  mounted: function() {
    if (this.auto === 'true') {
      this.autoInterval = setInterval(() => {
        this.nextSlide();
      }, parseInt(this.autoTiming));
    }
  },
  computed: {
    containerWidth() {
      return this.slideTotal * 100 + '%';
    },
    activeSlidePosition() {
      return '-' + (100 / this.slideTotal) * this.activeSlideIndex + '%';
    },
    containerStyle() {
      return `width: ${this.containerWidth};
      transform: translateX(${this.activeSlidePosition});
      transition-timing-function: ${this.transitionTiming};
      transition-duration: ${this.transitionDuration};`;
    },
    slideTotal() {
      return this.shared.slides.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.c-carousel {
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 100;
  position: fixed;

  display: block;

  background-color: #323232;
  background-image: linear-gradient(#3d3d3d, #1a1a1a);

  opacity: 0;
  visibility: hidden;

  transition-duration: 500ms;
  transition-timing-function: ease-in-out;
  transition-property: opacity, visibility;
}

.c-carousel.is-active {
  opacity: 1;
  visibility: visible;
}

.c-carousel > .c-carousel__wrapper {
  top: 2.5%;
  left: 2.5%;
  right: 2.5%;
  bottom: 2.5%;
  position: absolute;

  overflow: hidden;
}

.c-carousel > .c-carousel__wrapper > .c-carousel__wrapper__container {
  height: 100%;
  min-width: 100%;
  display: flex;

  transition: transform 300ms ease-in-out;
}

.c-carousel > .c-carousel__button {
  cursor: pointer;

  color: #323232;

  background-color: #27ae61;

  border: 0px;
  border-radius: 50%;
}

.c-carousel > .c-carousel__arrow,
.c-carousel > .c-carousel__closer {
  width: 48px;
  height: 48px;
  display: block;

  padding: 0px;
  line-height: 1em;

  z-index: 25;
  position: absolute;
}

.c-carousel > .c-carousel__arrow::before,
.c-carousel > .c-carousel__closer::before {
  content: '';

  pointer-events: none;

  user-select: none;

  position: relative;
  width: 100%;
  height: 100%;
  display: block;

  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center center;
}

.c-carousel > .c-carousel__arrow {
  top: 50%;

  transform: translate(0px, -50%);
}

.c-carousel > .c-carousel__arrow--prev {
  left: 20px;
  right: auto;
}

.c-carousel > .c-carousel__arrow--prev::before {
  background-image: url('http://localhost:8000/assets/images/arrow.svg');

  transform: rotate(180deg);
}

.c-carousel > .c-carousel__arrow--next {
  left: auto;
  right: 20px;
}

.c-carousel > .c-carousel__arrow--next::before {
  background-image: url('http://localhost:8000/assets/images/arrow.svg');
}

.c-carousel > .c-carousel__closer {
  top: 20px;
  left: auto;
  right: 20px;
  bottom: auto;
}

.c-carousel > .c-carousel__closer::before {
  background-image: url('http://localhost:8000/assets/images/close.svg');
}
</style>
