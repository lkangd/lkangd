import Vue from 'vue';
import dayjs from 'dayjs';

Vue.filter('formatDate', (value, formatType) => dayjs(value).format(formatType));
