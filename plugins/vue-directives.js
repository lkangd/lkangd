import Vue from 'vue';
import hljs from 'highlight.js';

Vue.directive('highlight', el => [...el.querySelectorAll('pre code')].forEach(hljs.highlightBlock));
