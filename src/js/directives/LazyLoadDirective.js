/**
 *
 */
export default {
  inserted: (el, binding) => {
    function loadImage() {
      const imageElement = Array.from(el.children).find(
        (el) => {
          return (binding.value != '')
            ? el.classList.contains(binding.value)
            : el.nodeName === 'IMG';
        }
      );

      if (imageElement) {
        imageElement.addEventListener('load', () => {
          setTimeout(() => {
            el.classList.add('is-loaded');
          }, 100);
        });

        imageElement.addEventListener('error', () => {
          // eslint-disable-next-line no-console
          console.log('error');
        });

        if (binding.value != '') {
          imageElement.style.backgroundImage = `url("${imageElement.dataset.url}")`;
        } else if (el.nodeName === 'IMG') {
          imageElement.src = imageElement.dataset.url;
        }
      }
    }

    function handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage();
          observer.unobserve(el);
        }
      });
    }

    function createObserver() {
      const options = {
        root: null,
        threshold: '0'
      };
      const observer = new IntersectionObserver(handleIntersect, options);
      observer.observe(el);
    }
    if (window['IntersectionObserver']) {
      createObserver();
    } else {
      loadImage();
    }
  }
};
