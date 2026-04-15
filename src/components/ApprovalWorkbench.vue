<template>
  <q-card class="bg-dark text-white rounded-borders shadow-5">
    <q-card-section class="bg-primary flex justify-between items-center">
      <div class="text-h6 text-accent">Approval Workbench</div>
      <q-badge color="accent" text-color="dark" class="text-body2">
        {{ pendingCount }} Pending
      </q-badge>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-table
        dark
        dense
        :rows="queue"
        :columns="columns"
        row-key="id"
        class="bg-transparent no-shadow"
        :no-data-label="'No pending applications for ' + authStore.currentRole"
      >
        <!-- Body Slots -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            
            <!-- Standard Approval Action -->
            <q-btn 
              v-if="!isImprestBranch"
              size="sm" 
              color="positive" 
              icon="check" 
              label="Approve & Fwd" 
              @click="handleApprove(props.row)" 
            />

            <!-- Imprest Branch specific action -->
            <q-btn 
              v-else
              size="sm" 
              color="warning" 
              text-color="dark"
              icon="edit_document" 
              label="Process CTB Data" 
              @click="openProcessingDialog(props.row)" 
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <!-- CTB Processing Dialog specifically for Imprest -->
    <q-dialog v-model="processDialog" persistent>
      <q-card class="bg-dark text-white" style="min-width: 400px; border: 1px solid gold;">
        <q-card-section class="bg-primary text-accent">
          <div class="text-h6">Pass Processing: {{ selectedApp?.id }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input dark filled v-model="processForm.busPassNo" label="Bus Pass No (e.g. AF008894)" />
          <q-input dark filled v-model="processForm.hoToCtbDate" type="date" stack-label label="Handed Over to CTB Date" />
          <q-input dark filled v-model="processForm.receivedFromCtbDate" type="date" stack-label label="Received from CTB Date" />
          <q-input dark filled v-model="processForm.dateHoToCamp" type="date" stack-label label="Handed Over to Camp Date" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="white" v-close-popup />
          <q-btn label="Save & Finalize" color="accent" text-color="dark" @click="finalizeCTB" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useApplicationStore } from 'stores/applications'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const appStore = useApplicationStore()

// The hierarchy mapped to the generic workflow
const roleQueueMapping = {
  'Off I/C': 'Pending Off I/C',
  'O/Room': 'Pending O/Room',
  'P3 Clerk': 'Pending P3 Clerk',
  'P3 Officer': 'Pending P3 Officer',
  'Base CMDr': 'Pending Base CMDr',
  'P&R Branch': 'Pending P&R',
  'Imprest Branch': 'Pending Imprest'
}

const nextRoleMapping = {
  'Pending Off I/C': 'Pending O/Room',
  'Pending O/Room': 'Pending P3 Clerk',
  'Pending P3 Clerk': 'Pending P3 Officer',
  'Pending P3 Officer': 'Pending Base CMDr',
  'Pending Base CMDr': 'Pending P&R',
  'Pending P&R': 'Pending Imprest',
  'Pending Imprest': 'Completed / Pass Issued'
}

const currentTargetStatus = computed(() => roleQueueMapping[authStore.currentRole])
const queue = computed(() => appStore.list.filter(app => app.status === currentTargetStatus.value))
const pendingCount = computed(() => queue.value.length)
const isImprestBranch = computed(() => authStore.currentRole === 'Imprest Branch')

const columns = [
  { name: 'id', label: 'Req ID', field: 'id', align: 'left', sortable: true },
  { name: 'svcNo', label: 'SVC No', field: 'svcNo', align: 'left' },
  { name: 'rankName', label: 'Rank & Name', field: row => `${row.rank} ${row.name}`, align: 'left' },
  { name: 'camp', label: 'Camp', field: 'postedCamp', align: 'center' },
  { name: 'category', label: 'Cat', field: 'category', align: 'center' },
  { name: 'journey', label: 'Journey', field: row => `${row.journeyFrom} to ${row.journeyTo}`, align: 'left' },
  { name: 'date', label: 'Date Applied', field: 'applicationReceivedDate', align: 'center', sortable: true },
  { name: 'actions', label: 'Action', field: 'actions', align: 'center' }
]

const handleApprove = (app) => {
  const nextTarget = nextRoleMapping[app.status]
  appStore.approveApplication(app.id, authStore.currentRole, nextTarget)
  $q.notify({ type: 'positive', message: `Application ${app.id} approved and forwarded.` })
}

// Imprest Branch Specific Processing
const processDialog = ref(false)
const selectedApp = ref(null)
const processForm = ref({ busPassNo: '', hoToCtbDate: '', receivedFromCtbDate: '', dateHoToCamp: '' })

const openProcessingDialog = (app) => {
  selectedApp.value = app
  processForm.value = { 
    busPassNo: app.busPassNo || '', 
    hoToCtbDate: app.hoToCtbDate || '', 
    receivedFromCtbDate: app.receivedFromCtbDate || '', 
    dateHoToCamp: app.dateHoToCamp || '' 
  }
  processDialog.value = true
}

const finalizeCTB = () => {
  if (selectedApp.value) {
    appStore.updateApplicationTracking(selectedApp.value.id, { ...processForm.value })
    handleApprove(selectedApp.value) // Finalize status
  }
  processDialog.value = false
}
</script>
