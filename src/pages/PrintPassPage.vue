<template>
  <div class="print-page bg-grey-1 text-black">
    <div v-if="loading" class="flex flex-center" style="height: 100vh">
      <q-spinner-oval color="primary" size="4rem" />
      <div class="q-ml-md text-h6">Preparing for Print...</div>
    </div>
    
    <div v-else-if="app" class="print-container">
      <!-- High Fidelity Card Rendering -->
      <BusPassCard :passData="mappedData" id="bus-pass" />
      
      <div class="q-mt-xl no-print text-center">
        <q-btn color="primary" icon="print" label="PRINT NOW" size="lg" @click="handlePrint" />
        <p class="text-caption q-mt-sm opacity-50">Press Ctrl+P if the dialog doesn't open automatically.</p>
      </div>
    </div>

    <div v-else class="flex flex-center" style="height: 100vh">
      <div class="text-center">
        <q-icon name="error" color="negative" size="4rem" />
        <div class="text-h5 q-mt-md">Application Record Not Found</div>
        <q-btn flat label="Go Back" color="primary" class="q-mt-md" @click="closeWindow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import BusPassCard from 'components/BusPassCard.vue'

const route = useRoute()
const app = ref(null)
const loading = ref(true)

const mappedData = computed(() => {
  if (!app.value) return {}
  return {
    year: app.value.application_received_date ? new Date(app.value.application_received_date).getFullYear() : '2026',
    fromDate: app.value.application_received_date ? app.value.application_received_date.split('T')[0] : '2026/01/01',
    toDate: app.value.received_from_ctb_date ? app.value.received_from_ctb_date.split('T')[0] : '2026/12/31',
    destination: `${app.value.journey_from} - ${app.value.journey_to}`,
    id: app.value.svc_no || 'N/A',
    name: `${app.value.rank} ${app.value.name}`,
    photo: app.value.document_url ? `https://lrscjblgerapzosnbxjw.supabase.co/storage/v1/object/public/documents/${app.value.document_url}` : null,
    authorization: app.value.authorization_code || 'N/A'
  }
})

onMounted(async () => {
  console.log('Fetching app with ID:', route.params.id)
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', route.params.id)
    .single()
  
  if (error) {
    console.error('Supabase fetch error:', error)
    loading.value = false
    return
  }

  if (data) {
    console.log('App found for printing:', data)
    app.value = data
    // Let images load then print
    setTimeout(() => {
      handlePrint()
    }, 1500)
  } else {
    console.warn('No data returned for ID:', route.params.id)
  }
  loading.value = false
})

const handlePrint = () => {
  window.print()
}

const closeWindow = () => {
  window.close()
}
</script>

<style>
/* Remove Global Backgrounds for Print */
@media print {
  body, html {
    background: white !important;
    color: black !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .no-print {
    display: none !important;
  }
  .print-page {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    display: block !important;
  }
  .print-container {
    padding: 10mm !important; /* Some margin for printers */
  }
}

.print-page {
  min-height: 100vh;
  background: #f4f4f4;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: start;
}

.print-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
