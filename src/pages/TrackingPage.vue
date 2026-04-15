<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <div class="max-width-1200 q-mx-auto">
      <div class="row items-center q-mb-xl">
        <div class="col">
          <h4 class="text-h4 text-weight-bold text-accent q-mt-none q-mb-xs">Track Applications</h4>
          <p class="text-subtitle1 opacity-80">Monitor the progress of bus pass requests in real-time.</p>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Search Section -->
        <div class="col-12 col-md-4">
          <q-card class="bg-blue-10/20 border-accent shadow-10">
            <q-card-section>
              <div class="text-h6 text-accent q-mb-md">Search Records</div>
              <q-input 
                dark 
                filled 
                v-model="searchSvcNo" 
                label="Enter Service No" 
                @keyup.enter="performSearch"
                bg-color="dark-page"
                class="q-mb-md"
              >
                <template v-slot:append>
                  <q-icon name="search" color="accent" class="cursor-pointer" @click="performSearch" />
                </template>
              </q-input>
              <q-btn 
                color="accent" 
                text-color="dark" 
                label="Trace Files" 
                class="full-width text-weight-bold" 
                @click="performSearch"
                :loading="loading"
              />
            </q-card-section>
            
            <q-card-section v-if="authStore.currentRole === 'Applicant'" class="q-pt-none">
              <q-separator dark class="q-my-md" />
              <div class="text-caption text-grey-4 q-mb-sm">My Quick Links</div>
              <q-btn flat dense color="accent" label="View All My Applications" icon="apps" class="full-width" @click="showAllMyApps" />
            </q-card-section>
          </q-card>
          
          <div class="q-mt-md q-pa-md bg-primary-dark rounded-borders opacity-60">
            <div class="text-subtitle2 text-accent">Status Guide</div>
            <q-list dense dark>
              <q-item v-for="step in workflowSteps" :key="step.label">
                <q-item-section side><q-badge rounded color="accent" size="6px" /></q-item-section>
                <q-item-section class="text-caption">{{ step.label }}: {{ step.description }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <!-- Results Section -->
        <div class="col-12 col-md-8">
          <div class="flex justify-between items-center q-mb-md">
            <h5 class="text-h5 text-weight-bold q-my-none">
              {{ searchSvcNo && hasSearched ? `Results for ${searchSvcNo}` : 'Application History' }}
            </h5>
            <q-chip v-if="filteredApps.length" color="primary" text-color="accent" outline dense>
              {{ filteredApps.length }} File(s) Found
            </q-chip>
          </div>

          <div v-if="filteredApps.length > 0">
            <ApplicationTracker 
              v-for="app in filteredApps" 
              :key="app.id" 
              :app="app" 
              class="q-mb-lg"
            />
          </div>

          <q-card v-else-if="hasSearched" class="bg-dark border-dashed text-center q-pa-xl opacity-70">
            <q-icon name="search_off" size="xl" color="grey-7" class="q-mb-md" />
            <div class="text-h6">No Records Found</div>
            <p>We couldn't find any applications matching that Service Number.</p>
          </q-card>

          <q-card v-else class="bg-dark border-dashed text-center q-pa-xl opacity-70">
            <q-icon name="manage_search" size="xl" color="grey-7" class="q-mb-md" />
            <div class="text-h6">Search to Tracking</div>
            <p>Enter a Service Number to trace application progress across Air Force Headquarters.</p>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useApplicationStore } from 'stores/applications'
import ApplicationTracker from 'components/ApplicationTracker.vue'

const authStore = useAuthStore()
const appStore = useApplicationStore()

const searchSvcNo = ref('')
const hasSearched = ref(false)
const loading = ref(false)
const manualSearchResults = ref([])

onMounted(() => {
  if (appStore.list.length === 0) {
    appStore.fetchApplications()
  }
})

const performSearch = () => {
  if (!searchSvcNo.value) return
  loading.value = true
  hasSearched.value = true
  
  // Simulated delay for premium feel
  setTimeout(() => {
    manualSearchResults.value = appStore.list.filter(app => 
      app.svcNo.toLowerCase().includes(searchSvcNo.value.toLowerCase())
    )
    loading.value = false
  }, 400)
}

const showAllMyApps = () => {
  searchSvcNo.value = authStore.user?.user_metadata?.service_no || ''
  performSearch()
}

const filteredApps = computed(() => {
  if (hasSearched.value) return manualSearchResults.value
  
  // Default view for logged in applicants
  if (authStore.currentRole === 'Applicant') {
    return appStore.list
  }
  
  return []
})

const workflowSteps = [
  { label: 'O/Room', description: 'Under process at Station Orderly Room' },
  { label: 'P3 Desk', description: 'Pending P3 Officer verification at AFHQ' },
  { label: 'Director', description: 'Under review by Director Personnel & Revenue' },
  { label: 'Issued', description: 'File released and e-Pass issued' }
]
</script>

<style lang="scss" scoped>
.max-width-1200 { max-width: 1200px; }
.opacity-80 { opacity: 0.8; }
.opacity-70 { opacity: 0.7; }
.opacity-60 { opacity: 0.6; }
.border-accent { border-left: 4px solid $accent; }
.border-dashed { border: 1px dashed rgba(255,255,255,0.2); }
.bg-primary-dark { background: rgba(var(--q-primary), 0.1); }
</style>
