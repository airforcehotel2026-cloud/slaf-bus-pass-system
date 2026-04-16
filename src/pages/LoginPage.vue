<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-dark text-white window-height flex flex-center">
      <q-card class="bg-blue-10 shadow-24 text-center q-pa-lg" style="width: 450px; max-width: 95vw; border-radius: 16px; border: 1px solid rgba(255,215,0,0.2)">
        <q-img src="slaf-crest.png" width="80px" class="q-mb-md" />
        <h4 class="text-h4 text-accent text-weight-bolder q-mt-none q-mb-xs">Bus-Pass Portal</h4>
        <p class="text-subtitle2 text-grey-4 q-mb-lg">SLAF Bus Pass Management System</p>

        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="accent"
          indicator-color="accent"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator dark />

        <q-tab-panels v-model="tab" animated class="bg-transparent q-mt-md">
          <!-- LOGIN TAB -->
          <q-tab-panel name="login">
            <q-form @submit="onLogin" class="q-gutter-md">
              <q-input 
                v-model="loginForm.email" 
                label="Service Email" 
                dark 
                filled 
                color="accent"
                :rules="[val => !!val || 'Email is required']"
              >
                <template v-slot:prepend><q-icon name="email" color="accent" /></template>
              </q-input>

              <q-input 
                v-model="loginForm.password" 
                label="Password" 
                type="password" 
                dark 
                filled 
                color="accent"
                :rules="[val => !!val || 'Password is required']"
              >
                <template v-slot:prepend><q-icon name="lock" color="accent" /></template>
              </q-input>

              <q-btn 
                label="Sign In" 
                type="submit" 
                color="accent" 
                text-color="dark"
                class="full-width q-py-sm text-weight-bold" 
                :loading="loading"
              />
            </q-form>
          </q-tab-panel>

          <!-- REGISTER TAB -->
          <q-tab-panel name="register">
            <q-form @submit="onRegister" class="q-gutter-md">
              <q-input 
                v-model="regForm.email" 
                label="Service Email" 
                dark 
                filled 
                color="accent"
                :rules="[val => !!val || 'Email is required']"
              >
                <template v-slot:prepend><q-icon name="person" color="accent" /></template>
              </q-input>

              <q-select 
                v-model="regForm.role" 
                :options="roles" 
                label="Designation / Role" 
                dark 
                filled 
                color="accent"
                :rules="[val => !!val || 'Role is required']"
              >
                <template v-slot:prepend><q-icon name="badge" color="accent" /></template>
              </q-select>

              <q-input 
                v-model="regForm.password" 
                label="Password" 
                type="password" 
                dark 
                filled 
                color="accent"
                :rules="[val => val && val.length >= 6 || 'Min 6 characters']"
              >
                <template v-slot:prepend><q-icon name="lock" color="accent" /></template>
              </q-input>

              <q-btn 
                label="Create Account" 
                type="submit" 
                color="accent" 
                text-color="dark"
                class="full-width q-py-sm text-weight-bold" 
                :loading="loading"
              />
            </q-form>
          </q-tab-panel>
        </q-tab-panels>

        <div class="q-mt-md text-caption text-grey-5">
          Restricted Access - Authorized Personnel Only
        </div>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const tab = ref('login')
const roles = authStore.roles
const loading = computed(() => authStore.loading)

const loginForm = reactive({
  email: '',
  password: ''
})

const regForm = reactive({
  email: '',
  password: '',
  role: ''
})

const onLogin = async () => {
  const res = await authStore.login(loginForm.email, loginForm.password)
  if (res.success) {
    $q.notify({ color: 'positive', message: 'Logged in successfully', icon: 'check_circle' })
    router.push('/dashboard')
  } else {
    $q.notify({ color: 'negative', message: res.error, icon: 'error' })
  }
}

const onRegister = async () => {
  const res = await authStore.register(regForm.email, regForm.password, regForm.role)
  if (res.success) {
    $q.notify({ color: 'positive', message: 'Registration successful! Check email for verification.', icon: 'mail' })
    tab.value = 'login'
  } else {
    $q.notify({ color: 'negative', message: res.error, icon: 'error' })
  }
}
</script>

<style scoped>
.q-card {
  backdrop-filter: blur(10px);
  background: rgba(30, 58, 138, 0.9) !important;
}
</style>
