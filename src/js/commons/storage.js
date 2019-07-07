/**
 *
 */

import {API_URL} from './constants.js';

const storage = {
  debug: true,
  state: {
    imagesUrl: '/images/',
    readerUrl: API_URL + '/reader.php',
    downloaderSingleUrl: API_URL + '/downloader-single.php',
    downloaderMultipleUrl: API_URL + '/downloader-multiple.php',

    slides: [],
    count: 0,
    selected: [],
    currentSlide: 0,
    sliderOpened: false
  },
  toggleValueFromSelected(value) {
    let selected = this.state.selected;

    if (selected.includes(value)) {
      selected.splice(selected.indexOf(value), 1);
    } else {
      selected.push(value);
    }
  },
  changeSlide(index) {
    this.state.currentSlide = parseInt(index);
    this.state.sliderOpened = true;
  },
  closeSlider() {
    this.state.sliderOpened = false;
  },
  downloadSingleImage(image) {
    var img = encodeURIComponent(image);

    window.open(`${this.state.downloaderSingleUrl}?img=${img}`);
  },
  downloadMultipleImages(images) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        window.open(this.responseText);
      }
    };

    xhr.open('POST', this.state.downloaderMultipleUrl, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(`imgs=${images}`);
  }
};

export default storage;
