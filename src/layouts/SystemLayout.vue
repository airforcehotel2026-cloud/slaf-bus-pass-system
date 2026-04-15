<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark-page text-white">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="flex items-center">
          <q-img src="/slaf-crest.svg" width="30px" class="q-mr-sm" />
          e-PAS System Workspace
        </q-toolbar-title>

        <q-chip outline color="accent" text-color="white" icon="badge" class="q-mr-md shadow-3">
          {{ authStore.currentRole || 'Guest' }}
        </q-chip>
        
        <q-btn flat round icon="logout" @click="handleLogout" title="Logout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-dark">
      <div class="flex flex-center q-pa-md border-bottom text-center">
        <div>
          <q-avatar size="72px" color="primary" text-color="accent" class="shadow-5 q-mb-sm">
            {{ getInitials(authStore.currentRole) }}
          </q-avatar>
          <div class="text-weight-bold text-accent">{{ authStore.user?.email }}</div>
          <div class="text-caption opacity-70">{{ authStore.user?.user_metadata?.service_no }}</div>
        </div>
      </div>
    
      <q-list class="q-mt-md">
        <q-item-label header class="text-white opacity-70">Navigation</q-item-label>

        <q-item clickable v-ripple to="/dashboard" active-class="text-accent bg-blue-10" exact>
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section><q-item-label>Dashboard</q-item-label></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/track" active-class="text-accent bg-blue-10">
          <q-item-section avatar><q-icon name="track_changes" /></q-item-section>
          <q-item-section><q-item-label>Status Tracking</q-item-label></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/history" active-class="text-accent bg-blue-10">
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section><q-item-label>App History</q-item-label></q-item-section>
        </q-item>

        <q-separator dark class="q-my-sm" />

        <q-item clickable v-ripple to="/dashboard/reports" active-class="text-accent bg-blue-10">
          <q-item-section avatar><q-icon name="assessment" /></q-item-section>
          <q-item-section><q-item-label>Reports</q-item-label></q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/dashboard/profile" active-class="text-accent bg-blue-10">
          <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
          <q-item-section><q-item-label>Profile & Settings</q-item-label></q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const getInitials = (role) => {
  if (!role) return '?'
  return role.substring(0, 2).toUpperCase()
}
</script>

<style scoped>
.opacity-70 { opacity: 0.7; }
.border-bottom { border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
</style>
