<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-dark text-white window-height flex flex-center">
      <q-card class="bg-blue-10 shadow-10 text-center q-pa-xl" style="width: 500px; max-width: 90vw; border-radius: 12px; border: 1px solid rgba(255,215,0,0.3)">
        <q-img src="/slaf-crest.svg" width="80px" class="q-mb-md" />
        <h4 class="text-h4 text-accent text-weight-bold q-mt-none q-mb-sm">e-PAS Portal</h4>
        <p class="opacity-80 q-mb-xl">Select a role to mock login</p>
        
        <div class="row q-col-gutter-sm justify-center">
          <div class="col-6" v-for="role in roles" :key="role">
            <q-btn 
              outline 
              color="accent" 
              class="full-width" 
              :label="role" 
              @click="handleLogin(role)"
            />
          </div>
        </div>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const roles = authStore.roles

const handleLogin = (role) => {
  authStore.login(role)
  router.push('/dashboard')
}
</script>

<style scoped>
.opacity-80 { opacity: 0.8; }
</style>
