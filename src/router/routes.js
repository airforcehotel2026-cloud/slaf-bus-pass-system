const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'verify', component: () => import('pages/ScanPage.vue') }
    ]
  },
  {
    path: '/print/:id',
    component: () => import('pages/PrintPassPage.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/SystemLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'track', component: () => import('pages/TrackingPage.vue') },
      { path: 'history', component: () => import('pages/ApplicationHistory.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'reports', component: () => import('pages/ReportsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
