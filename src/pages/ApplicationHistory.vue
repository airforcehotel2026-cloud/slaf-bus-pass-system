<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <div class="max-width-1200 q-mx-auto">
      <div class="row items-center justify-between q-mb-xl">
        <div class="col">
          <h4 class="text-h4 text-weight-bold text-accent q-mt-none q-mb-xs">Application History</h4>
          <p class="text-subtitle1 opacity-80">View and manage all your historical bus pass records.</p>
        </div>
        <div class="col-auto">
          <q-btn outline color="accent" icon="file_download" label="Export CSV" />
        </div>
      </div>

      <q-table
        :rows="appStore.list"
        :columns="columns"
        row-key="id"
        dark
        flat
        bordered
        class="bg-dark shadow-10"
        :loading="appStore.loading"
        :pagination="pagination"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getBadgeColor(props.value)" class="q-px-sm q-py-xs">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>
        
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn flat round dense icon="visibility" color="accent" @click="viewDetails(props.row)">
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn v-if="props.row.status === 'Completed / Pass Issued'" flat round dense icon="download" color="primary">
              <q-tooltip>Download PDF</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <!-- Details & Edit Dialog -->
      <q-dialog v-model="detailsOpen" persistent>
        <q-card class="bg-dark text-white" style="width: 800px; max-width: 95vw; border: 1px solid rgba(255,215,0,0.3)">
          <q-card-section class="bg-primary flex justify-between items-center">
            <div class="text-h6 text-accent">Application Details: {{ selectedApp?.id?.substring(0,8) }}</div>
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section v-if="selectedApp" class="q-pa-lg">
            <div class="row q-col-gutter-lg">
              <!-- Left: View Info -->
              <div :class="canEdit ? 'col-12 col-md-6' : 'col-12'">
                <div class="text-subtitle1 text-accent q-mb-md">Record Information</div>
                <q-list dense padding>
                   <q-item v-for="(val, label) in displayFields" :key="label">
                     <q-item-section class="text-grey-4">{{ label }}</q-item-section>
                     <q-item-section side class="text-white">{{ val }}</q-item-section>
                   </q-item>
                </q-list>
                
                <div class="q-mt-md" v-if="selectedApp.documentUrl">
                  <div class="text-subtitle2 text-accent">Attachment</div>
                  <q-btn flat dense color="primary" label="View Document" icon="attach_file" @click="openDoc(selectedApp.documentUrl)" />
                </div>
              </div>

              <!-- Right: Edit Form (If applicable) -->
              <div v-if="canEdit" class="col-12 col-md-6 border-left-faded">
                <div class="text-subtitle1 text-warning q-mb-md">Modify Request</div>
                <q-form @submit="onUpdate" class="q-gutter-sm">
                  <q-input dark dense filled v-model="editForm.journeyFrom" label="From" />
                  <q-input dark dense filled v-model="editForm.journeyTo" label="To" />
                  <q-input dark dense filled v-model="editForm.nearestTown" label="Town" />
                  <q-input dark dense filled v-model="editForm.mobile" label="Mobile" />
                  <q-input dark dense filled v-model="editForm.service_no" label="Svc No" />
                  
                  <q-btn label="Save Changes" type="submit" color="positive" class="full-width q-mt-md" :loading="updating" />
                </q-form>
                <div class="text-caption text-grey-6 q-mt-sm">* Editing is only allowed while status is 'Pending Off I/C'.</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useApplicationStore } from 'stores/applications'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const appStore = useApplicationStore()

const detailsOpen = ref(false)
const selectedApp = ref(null)
const updating = ref(false)
const editForm = ref({})

onMounted(() => {
  appStore.fetchApplications()
})

const pagination = ref({ rowsPerPage: 10 })

const columns = [
  { name: 'date', label: 'Date', field: row => row.created_at?.split('T')[0] || 'N/A', align: 'left', sortable: true },
  { name: 'svcNo', label: 'Svc No', field: 'svcNo', align: 'left', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'route', label: 'Route', field: row => `${row.journeyFrom} - ${row.journeyTo}`, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const canEdit = computed(() => selectedApp.value?.status === 'Pending Off I/C')

const displayFields = computed(() => {
  if (!selectedApp.value) return {}
  return {
    'Rank & Name': `${selectedApp.value.rank} ${selectedApp.value.name}`,
    'Service No': selectedApp.value.svcNo,
    'NIC': selectedApp.value.nic,
    'Mobile': selectedApp.value.mobile,
    'Station': selectedApp.value.postedCamp,
    'Journey': `${selectedApp.value.journeyFrom} to ${selectedApp.value.journeyTo}`,
    'Route No': selectedApp.value.busRouteNo,
    'Distance': `${selectedApp.value.distance} km`,
    'Amount': `Rs. ${selectedApp.value.amount}`
  }
})

const viewDetails = (app) => {
  selectedApp.value = app
  editForm.value = JSON.parse(JSON.stringify(app))
  detailsOpen.value = true
}

const onUpdate = async () => {
  updating.value = true
  const res = await appStore.updateApplication(selectedApp.value.id, editForm.value)
  if (res.success) {
    $q.notify({ type: 'positive', message: 'Application updated successfully' })
    detailsOpen.value = false
  } else {
    $q.notify({ type: 'negative', message: 'Update failed' })
  }
  updating.value = false
}

const openDoc = (path) => {
  const url = `https://lrscjblgerapzosnbxjw.supabase.co/storage/v1/object/public/documents/${path}`
  window.open(url, '_blank')
}

const getBadgeColor = (status) => {
  if (status.includes('Pending')) return 'warning'
  if (status.includes('Completed')) return 'positive'
  return 'primary'
}
</script>

<style scoped>
.max-width-1200 { max-width: 1200px; }
.opacity-80 { opacity: 0.8; }
.border-left-faded { border-left: 1px solid rgba(255,255,255,0.1); }
</style>
