<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-xl">
      <div class="col-12">
        <h4 class="text-h4 text-weight-bold text-accent q-mt-none q-mb-xs">Welcome to e-PAS</h4>
        <p class="text-subtitle1 opacity-80">You are logged in as <strong class="text-primary">{{ authStore.currentRole }}</strong>.</p>
      </div>
    </div>

    <!-- Applicant View -->
    <div v-if="authStore.currentRole === 'Applicant'">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <ApplicantForm />
        </div>
        <div class="col-12 col-md-5">
          <!-- Applicant View: Their Submitted Applications -->
          <h4 class="text-h5 text-weight-bold text-accent q-mb-md q-mt-none">My Applications</h4>
          
          <q-list bordered class="rounded-borders bg-blue-10 text-white" v-if="appStore.list.length > 0">
            <q-item v-for="app in appStore.list" :key="app.id" class="q-py-md">
              <q-item-section avatar>
                <q-icon name="assignment" color="accent" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">{{ app.id }}</q-item-label>
                <q-item-label caption class="text-grey-4">{{ app.route }} - LKR {{ app.amount }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-badge :color="getBadgeColor(app.status)">
                  {{ app.status }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card v-else class="bg-dark border-dashed text-center q-pa-xl opacity-70">
            No applications submitted yet.
          </q-card>
        </div>
      </div>
    </div>

    <!-- Approver View -->
    <div v-else>
      <ApprovalWorkbench />
    </div>

  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
import { useApplicationStore } from 'stores/applications'
import ApplicantForm from 'components/ApplicantForm.vue'
import ApprovalWorkbench from 'components/ApprovalWorkbench.vue'

const authStore = useAuthStore()
const appStore = useApplicationStore()

const getBadgeColor = (status) => {
  if (status.includes('Pending')) return 'warning'
  if (status.includes('Approved') || status.includes('Ready')) return 'positive'
  return 'primary'
}
</script>

<style scoped>
.opacity-80 { opacity: 0.8; }
.opacity-70 { opacity: 0.7; }
.opacity-50 { opacity: 0.5; }
.border-dashed { border: 1px dashed rgba(255,255,255,0.2) }
</style>
