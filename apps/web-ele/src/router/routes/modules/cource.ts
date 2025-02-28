import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: '课程管理',
    path: '/courceManage',
    component: () => import('#/views/courceManage/index.vue'),
    meta: {
      affixTab: false,
      icon: 'lucide:area-chart',
      title: $t('page.courceManage.title'),
    },
  },
];

export default routes;
