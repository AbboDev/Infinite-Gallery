/**
 *
 */

import axios from 'axios';
import site_url from './constants.js';

const HTTP = axios.create({
  baseURL: `${site_url}/api/`,
});

export default HTTP;
