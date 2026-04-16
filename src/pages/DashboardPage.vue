<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <!-- Stats Overview -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-10/30 border-accent shadow-10 stats-card q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-overline text-grey-4">Total Requests</div>
              <div class="text-h4 text-weight-bolder text-accent">{{ appStore.list.length }}</div>
            </div>
            <q-icon name="apps" size="3rem" color="accent" opacity-30 />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-10/30 border-accent shadow-10 stats-card q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-overline text-grey-4">Pending Approvals</div>
              <div class="text-h4 text-weight-bolder text-warning">{{ pendingCount }}</div>
            </div>
            <q-icon name="pending_actions" size="3rem" color="warning" opacity-30 />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card class="bg-blue-10/30 border-accent shadow-10 stats-card q-pa-md">
          <div class="row items-center justify-between">
            <div>
              <div class="text-overline text-grey-4">Passes Issued</div>
              <div class="text-h4 text-weight-bolder text-positive">{{ issuedCount }}</div>
            </div>
            <q-icon name="verified" size="3rem" color="positive" opacity-30 />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Context-Aware Action Area -->
    <div class="row q-col-gutter-lg">
      <!-- Applicant View: Active Applications & Apply Now -->
      <div v-if="authStore.currentRole === 'Applicant'" class="col-12">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-7">
            <div class="flex justify-between items-center q-mb-md">
              <h5 class="text-h5 text-weight-bold q-my-none">Active Applications</h5>
              <q-chip color="warning" text-color="black" label="In Progress" dense />
            </div>

            <div v-if="activeApps.length > 0">
              <ApplicationTracker 
                v-for="app in activeApps" 
                :key="app.id" 
                :app="app" 
                class="q-mb-md" 
                @view="viewAppDetails"
              />
            </div>
            <q-card v-else class="bg-dark border-dashed text-center q-pa-xl opacity-70">
              <q-icon name="check_circle" size="xl" color="positive" class="q-mb-md" />
              <div class="text-h6">No Active Applications</div>
              <p>All your files have been processed. View them in History.</p>
            </q-card>
          </div>

          <div class="col-12 col-md-5">
            <q-card class="bg-blue-10 border-accent shadow-24 q-pa-lg text-center">
              <q-img src="slaf-crest.png" width="80px" class="q-mb-md" />
              <div class="text-h6 text-accent q-mb-sm text-uppercase text-weight-bolder">Need a Bus Pass?</div>
              <p class="text-caption text-grey-4 q-mb-md">Submit your request now for digital processing.</p>
              <q-btn 
                color="accent" 
                text-color="dark" 
                size="lg" 
                label="Apply Now" 
                icon="add_circle" 
                class="full-width glossy text-weight-bold" 
                @click="showApplyDialog = true"
              />
            </q-card>
          </div>
        </div>
      </div>

      <!-- Approver / Admin View: Review Panel -->
      <div v-else class="col-12">
        <div class="flex justify-between items-center q-mb-md">
          <h5 class="text-h5 text-weight-bold q-my-none">Approval Workbench</h5>
          <div class="q-gutter-sm">
            <q-btn flat color="accent" icon="history" label="View Past Approvals" to="/dashboard/history" />
            <q-chip color="primary" text-color="accent" :label="`${pendingCount} Files Awaiting`" />
          </div>
        </div>
        <ApprovalWorkbench />
      </div>
    </div>

    <!-- Application Form Dialog -->
    <q-dialog v-model="showApplyDialog" persistent>
      <q-card class="bg-dark text-white" style="width: 700px; max-width: 90vw; border: 1px solid rgba(255,215,0,0.3)">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-accent">New Application</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <ApplicantForm @submitted="showApplyDialog = false" />
        </q-card-section>
      </q-card>
    </q-dialog>



    <!-- Application Details Dialog -->
    <q-dialog v-model="detailsOpen" persistent>
      <q-card class="bg-dark text-white" style="width: 800px; max-width: 95vw; border: 1px solid rgba(255,215,0,0.3)">
        <q-card-section class="bg-primary flex justify-between items-center">
          <div class="text-h6 text-accent">Record Overview</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedApp" class="q-pa-lg">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <q-list dense dark separator>
                <q-item v-for="(val, label) in displayFields" :key="label">
                  <q-item-section class="text-grey-4">{{ label }}</q-item-section>
                  <q-item-section side class="text-white">{{ val }}</q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-4 text-center">
              <div class="text-overline text-accent q-mb-md">Attachment</div>
              <div v-if="selectedApp.documentUrl" class="q-pa-sm border-accent">
                <q-icon name="description" size="4rem" color="grey-7" />
                <q-btn flat dense color="accent" label="View File" @click="openDoc(selectedApp.documentUrl)" class="full-width q-mt-sm" />
              </div>
              <div v-else class="text-caption opacity-50">No document attached</div>
            </div>
          </div>
        </q-card-section>
        
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="white" v-close-popup />
          <q-btn color="accent" text-color="dark" label="Edit Record" icon="edit" @click="goToHistory" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { useApplicationStore } from 'stores/applications'
import ApplicantForm from 'components/ApplicantForm.vue'
import ApprovalWorkbench from 'components/ApprovalWorkbench.vue'
import ApplicationTracker from 'components/ApplicationTracker.vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useApplicationStore()

const showApplyDialog = ref(false)
const detailsOpen = ref(false)
const selectedApp = ref(null)

onMounted(() => {
  appStore.fetchApplications()
  appStore.subscribeToApplications()
})

onUnmounted(() => {
  appStore.unsubscribeApplications()
})

const activeApps = computed(() => {
  return appStore.list.filter(app => app.status !== 'Completed / Pass Issued')
})

const pendingCount = computed(() => {
  return activeApps.value.length
})

const issuedCount = computed(() => {
  return appStore.list.filter(app => app.status === 'Completed / Pass Issued').length
})

const viewAppDetails = (app) => {
  selectedApp.value = app
  detailsOpen.value = true
}

const displayFields = computed(() => {
  if (!selectedApp.value) return {}
  return {
    'Rank & Name': `${selectedApp.value.rank} ${selectedApp.value.name}`,
    'Service No': selectedApp.value.svcNo,
    'NIC': selectedApp.value.nic,
    'Route': `${selectedApp.value.journeyFrom} to ${selectedApp.value.journeyTo}`,
    'Station': selectedApp.value.postedCamp,
    'Status': selectedApp.value.status
  }
})

const openDoc = (path) => {
  const url = `https://lrscjblgerapzosnbxjw.supabase.co/storage/v1/object/public/documents/${path}`
  window.open(url, '_blank')
}

const goToHistory = () => {
  router.push('/dashboard/history')
}
</script>

<style lang="scss" scoped>
.opacity-80 { opacity: 0.8; }
.opacity-70 { opacity: 0.7; }
.opacity-50 { opacity: 0.5; }

.shadow-glow {
  box-shadow: 0 0 15px rgba($primary, 0.5);
}

.border-accent {
  border-left: 4px solid $accent;
}

.border-dashed { border: 1px dashed rgba(255,255,255,0.2) }
</style>
