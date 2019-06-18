/**
 *
 */

import axios from 'axios';
import {SITE_URL} from './constants.js';

const HTTP = axios.create({
  baseURL: `${SITE_URL}/api/`,
});

export default HTTP;
