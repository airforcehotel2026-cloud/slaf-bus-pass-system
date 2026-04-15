<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <div class="max-width-800 q-mx-auto">
      <h4 class="text-h4 text-weight-bold text-accent q-mb-xl">User Profile</h4>
      
      <q-card class="bg-blue-10/20 border-accent shadow-10 q-mb-lg">
        <q-card-section class="row items-center q-gutter-md">
          <q-avatar size="100px" color="primary" text-color="accent" class="shadow-5">
            {{ getInitials(authStore.currentRole) }}
          </q-avatar>
          <div>
            <div class="text-h5 text-weight-bold">{{ authStore.user?.email }}</div>
            <div class="text-subtitle1 text-accent">{{ authStore.currentRole }}</div>
          </div>
        </q-card-section>
        
        <q-separator dark />
        
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-item>
                <q-item-section avatar><q-icon name="badge" color="accent" /></q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-grey-4">Service Number</q-item-label>
                  <q-item-label class="text-weight-bold">{{ authStore.user?.user_metadata?.service_no || 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-12 col-sm-6">
              <q-item>
                <q-item-section avatar><q-icon name="apartment" color="accent" /></q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-grey-4">Unit / Section</q-item-label>
                  <q-item-label class="text-weight-bold">IT Directorate</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-gutter-md">
        <q-btn color="primary" icon="edit" label="Edit Profile Details" class="col" />
        <q-btn outline color="negative" icon="lock_reset" label="Change Password" class="col" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()

const getInitials = (role) => {
  if (!role) return '?'
  return role.substring(0, 2).toUpperCase()
}
</script>

<style scoped>
.max-width-800 { max-width: 800px; }
.border-accent { border-left: 4px solid $accent; }
</style>
