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

    <div
      class="c-carousel__wrapper"
      @mousedown="slideStart"
      @touchstart="slideStart"
      @mouseup="slideEnd"
      @touchend="slideEnd"
      @mousemove="slide"
      @touchmove="slide"
      ref="wrapper"
    >
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
      isMounted: false,
      sliding: 0,
      startClientX: 0,
      startPixelOffset: 0,
      pixelOffset: 0,
      activeSlidePosition: 0
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
    autoTiming: {
      type: Number,
      default: 5000
    }
  },
  methods: {
    goToSlide(slideIndex) {
      if (slideIndex >= 0 && slideIndex < this.slideTotal) {
        this.shared.currentSlide = slideIndex;
      }
    },
    isControlActive(controlIndex) {
      return controlIndex - 1 === this.shared.currentSlide;
    },
    nextSlide() {
      if (this.shared.currentSlide === (this.slideTotal - 1)) {
        if (this.loop === true) {
          this.shared.currentSlide = 0;
        } else {
          return false;
        }
      } else {
        this.shared.currentSlide++;
      }

      return true;
    },
    prevSlide() {
      if (this.shared.currentSlide === 0) {
        if (this.loop === true) {
          this.shared.currentSlide = (this.slideTotal - 1);
        } else {
          return false;
        }
      } else {
        this.shared.currentSlide--;
      }

      return true;
    },
    closeSlider() {
      this.$storage.closeSlider();
    },
    cancelAutoSlide() {
      clearInterval(this.autoInterval);
    },
    /**
     * Triggers when slide event started
     */
    slideStart(event) {
      // If it is mobile device redefine event to first touch point
      if (typeof event.originalEvent != 'undefined' && event.originalEvent.touches) {
        event = event.originalEvent.touches[0];
      }

      // If sliding not started yet store current touch position to calculate distance in future.
      if (this.sliding === 0) {
        this.$refs.container.classList.add('is-sliding');
        this.sliding = 1; // Status 1 = slide started.
        this.startClientX = event.clientX;
      }
    },

    /**
     * Occurs when image is being slid.
     */
    slide(event) {
      event.preventDefault();

      if (typeof event.originalEvent != 'undefined' && event.originalEvent.touches) {
        event = event.originalEvent.touches[0];
      }

      // Distance of slide.
      let deltaSlide = event.clientX - this.startClientX;

      // If sliding started first time and there was a distance.
      if (this.sliding === 1 && deltaSlide != 0) {
        this.sliding = 2; // Set status to 'actually moving'
        this.startPixelOffset = this.pixelOffset; // Store current offset
      }

      //  When user move image
      if (this.sliding === 2) {
        // Means that user slide 1 pixel for every 1 pixel of mouse movement.
        let touchPixelRatio = 1;

        let checkFromStart = (this.shared.currentSlide == 0 && event.clientX > this.startClientX);
        let checkFromEnd = (this.shared.currentSlide == (this.slideTotal - 1) && event.clientX < this.startClientX);

        // Check for user doesn't slide out of boundaries
        if (checkFromStart || checkFromEnd) {
          // Set ratio to 5 means image will be moving by 5 pixels
          // each time user moves it's pointer by 1 pixel. (Rubber-band effect)
          touchPixelRatio = 5;
        }

        // Calculate move distance.
        this.pixelOffset = this.startPixelOffset + (deltaSlide / touchPixelRatio);
      }
    },

    /**
     * When user release pointer finish slide moving.
     */
    slideEnd() {
      if (this.sliding !== 0) {
        // Reset sliding.
        this.sliding = 0;

        // Calculate which slide need to be in view.
        this.shared.currentSlide = this.pixelOffset < this.startPixelOffset
          ? this.shared.currentSlide + 1
          : this.shared.currentSlide - 1;

        // Make sure that unexisting slides weren't selected.
        this.shared.currentSlide = Math.min(Math.max(this.shared.currentSlide, 0), this.slideTotal - 1);

        // Since in this example slide is full viewport width offset can be calculated according to it.
        this.pixelOffset = this.shared.currentSlide * -(this.$refs.wrapper.offsetWidth);

        this.$refs.container.classList.remove('is-sliding');
      }
    }
  },
  mounted: function() {
    if (this.auto === 'true') {
      this.autoInterval = setInterval(() => {
        this.nextSlide();
      }, parseInt(this.autoTiming));
    }

    this.isMounted = true;
  },
  watch: {
    'shared.currentSlide': function(val) {
      if (!this.isMounted) {
        this.activeSlidePosition = (100 / this.slideTotal * val) + '%';
      } else {
        this.activeSlidePosition = (this.$refs.wrapper.offsetWidth * val) + 'px';
      }
    },
    pixelOffset: function(val) {
      this.activeSlidePosition = (-val) + 'px';
    }
  },
  computed: {
    wrapperWidth() {
      return (!this.isMounted)
        ? (this.slideTotal * 100) + '%'
        : (this.slideTotal * this.$refs.wrapper.offsetWidth) + 'px';
    },
    containerStyle() {
      // eslint-disable-next-line no-console
      console.log(this.activeSlidePosition);

      return {
        width: `${this.wrapperWidth}`,
        transform: `translateX(-${this.activeSlidePosition})`,
        transitionTimingFunction: this.transitionTiming,
        transitionDuration: this.transitionDuration
      };
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
