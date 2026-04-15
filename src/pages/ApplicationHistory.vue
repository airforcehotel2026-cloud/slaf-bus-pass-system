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
            <q-btn flat round dense icon="visibility" color="accent">
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn v-if="props.row.status === 'Completed / Pass Issued'" flat round dense icon="download" color="primary">
              <q-tooltip>Download PDF</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useApplicationStore } from 'stores/applications'

const appStore = useApplicationStore()

onMounted(() => {
  appStore.fetchApplications()
})

const pagination = ref({
  rowsPerPage: 10
})

const columns = [
  { name: 'date', label: 'Date', field: row => row.created_at || 'N/A', align: 'left', sortable: true },
  { name: 'svcNo', label: 'Svc No', field: 'svcNo', align: 'left', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'route', label: 'Route', field: row => `${row.journeyFrom} - ${row.journeyTo}`, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const getBadgeColor = (status) => {
  if (status.includes('Pending')) return 'warning'
  if (status.includes('Completed')) return 'positive'
  return 'primary'
}
</script>

<style scoped>
.max-width-1200 { max-width: 1200px; }
.opacity-80 { opacity: 0.8; }
</style>
