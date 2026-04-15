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
        <div class="col-12 col-lg-4 col-md-5">
          <ApplicantForm />
        </div>
        
        <div class="col-12 col-lg-8 col-md-7">
          <div class="flex justify-between items-center q-mb-md">
            <h4 class="text-h5 text-weight-bold text-accent q-my-none">Track My Applications</h4>
            <q-badge color="primary" label="Live Status" class="q-pa-xs shadow-glow" />
          </div>

          <div v-if="appStore.list.length > 0">
            <ApplicationTracker v-for="app in appStore.list" :key="app.id" :app="app" />
          </div>

          <q-card v-else class="bg-dark border-dashed text-center q-pa-xl opacity-70 rounded-borders">
            <q-icon name="assignment_late" size="xl" color="grey-7" class="q-mb-md" />
            <div class="text-h6">No applications found</div>
            <p>Go ahead and submit your first application using the form on the left.</p>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Approver / Admin View -->
    <div v-else>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-lg-8">
          <ApprovalWorkbench />
        </div>
        
        <div class="col-12 col-lg-4">
          <!-- Admin Search Section -->
          <q-card class="bg-dark text-white border-accent shadow-5 overflow-hidden">
            <q-card-section class="bg-primary text-accent">
              <div class="text-h6">Global Search & Track</div>
              <div class="text-caption">Search any officer's application status</div>
            </q-card-section>
            
            <q-card-section class="q-pa-md">
              <q-input 
                dark 
                filled 
                v-model="searchSvcNo" 
                label="Enter Service No (e.g. 33456)" 
                @keyup.enter="performSearch"
                bg-color="dark"
              >
                <template v-slot:append>
                  <q-btn flat round icon="search" color="accent" @click="performSearch" />
                </template>
              </q-input>
            </q-card-section>

            <!-- Search Results Display -->
            <q-card-section v-if="searchResults.length > 0" class="q-pt-none">
              <div class="text-overline q-mb-sm text-grey-5">Matching Applications</div>
              <div style="max-height: 500px; overflow-y: auto;">
                <ApplicationTracker v-for="app in searchResults" :key="app.id" :app="app" mini />
              </div>
            </q-card-section>
            
            <q-card-section v-else-if="hasSearched" class="text-center q-pa-lg">
              <q-icon name="search_off" size="md" color="grey-6" />
              <div class="text-grey-6">No applications found for SVC No: {{ searchSvcNo }}</div>
            </q-card-section>
            
            <q-card-section v-else class="text-center q-pa-xl opacity-50">
              <q-icon name="manage_search" size="xl" />
              <div class="q-mt-md">Enter a Service Number to trace files</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useApplicationStore } from 'stores/applications'
import ApplicantForm from 'components/ApplicantForm.vue'
import ApprovalWorkbench from 'components/ApprovalWorkbench.vue'
import ApplicationTracker from 'components/ApplicationTracker.vue'

const authStore = useAuthStore()
const appStore = useApplicationStore()

// Global Search Logic
const searchSvcNo = ref('')
const searchResults = ref([])
const hasSearched = ref(false)

const performSearch = () => {
  if (!searchSvcNo.value) return
  hasSearched.value = true
  searchResults.value = appStore.list.filter(app => 
    app.svcNo.toLowerCase().includes(searchSvcNo.value.toLowerCase())
  )
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
