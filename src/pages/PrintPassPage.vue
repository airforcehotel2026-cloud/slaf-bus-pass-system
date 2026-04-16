<template>
  <div class="print-page flex flex-center">
    <div v-if="loading" class="text-center">
       <q-spinner-oval color="primary" size="3em" />
       <div class="q-mt-md text-weight-bold">Preparing for Print...</div>
    </div>
    
    <div v-else-if="app" class="print-container">
       <PassTemplate :app="app" />
       
       <!-- Instructions (Hidden for print) -->
       <div class="no-print q-mt-xl text-center">
         <q-btn color="primary" icon="print" label="Print Now" @click="handlePrint" />
         <div class="text-caption q-mt-sm opacity-60">Press Ctrl+P if the dialog doesn't open automatically.</div>
       </div>
    </div>

    <div v-else class="text-negative">
       Record not found!
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'src/boot/supabase'
import PassTemplate from 'components/PassTemplate.vue'

const route = useRoute()
const app = ref(null)
const loading = ref(true)

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
    console.log('App found:', data)
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
