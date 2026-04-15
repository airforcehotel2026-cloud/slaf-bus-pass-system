<template>
  <q-page class="bg-dark text-white q-pa-lg flex flex-center">
    <q-card class="bg-blue-10 shadow-24 text-center q-pa-lg" style="width: 500px; max-width: 95vw; border-radius: 16px; border: 1px solid rgba(255,215,0,0.3)">
      <div class="text-h5 text-accent text-weight-bolder q-mb-md">verify e-PAS</div>
      
      <div v-if="!scanning" class="q-gutter-md">
        <q-btn 
          color="accent" 
          text-color="dark" 
          icon="qr_code_scanner" 
          label="Start Scanner" 
          class="full-width q-py-md text-weight-bold"
          @click="startScan"
        />
      </div>

      <div v-show="scanning" id="qr-reader" style="width: 100%; border-radius: 12px; overflow: hidden;"></div>

      <q-btn 
        v-if="scanning"
        flat 
        color="grey-4" 
        label="Cancel" 
        class="q-mt-md"
        @click="stopScan"
      />

      <!-- Result Section -->
      <div v-if="result" class="q-mt-xl q-pa-md rounded-borders" :class="result.isValid ? 'bg-positive' : 'bg-negative'">
        <q-icon :name="result.isValid ? 'check_circle' : 'cancel'" size="3rem" class="q-mb-sm" />
        <div class="text-h6">{{ result.message }}</div>
        
        <div v-if="result.app" class="text-left q-mt-md q-pa-sm bg-black/20 rounded-borders">
          <div class="row">
            <div class="col-4 text-grey-4">Name:</div>
            <div class="col-8 text-weight-bold">{{ result.app.name }}</div>
          </div>
          <div class="row">
            <div class="col-4 text-grey-4">Svc No:</div>
            <div class="col-8 text-weight-bold">{{ result.app.svc_no }}</div>
          </div>
          <div class="row">
            <div class="col-4 text-grey-4">Pass No:</div>
            <div class="col-8 text-accent">#{{ result.app.bus_pass_no }}</div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const scanning = ref(false)
const result = ref(null)
let html5QrcodeScanner = null

const startScan = () => {
  scanning.value = true
  result.value = null
  
  html5QrcodeScanner = new Html5QrcodeScanner(
    "qr-reader", 
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false
  )
  
  html5QrcodeScanner.render(onScanSuccess, onScanFailure)
}

const stopScan = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => console.error("Failed to clear scanner", error))
  }
  scanning.value = false
}

const onScanSuccess = async (decodedText) => {
  stopScan()
  $q.loading.show({ message: 'Verifying with HQ Database...' })
  
  try {
    // Expected format: .../verify?id=UUID
    const url = new URL(decodedText)
    const id = url.searchParams.get('id')
    
    if (!id) throw new Error('Invalid QR Code Format')

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) throw new Error('Pass Not Found or Invalid')

    if (data.status === 'Completed / Pass Issued') {
      result.value = {
        isValid: true,
        message: 'AUTHENTIC PASS',
        app: data
      }
    } else {
      result.value = {
        isValid: false,
        message: `PASS INVALID (Status: ${data.status})`
      }
    }
  } catch (err) {
    result.value = {
      isValid: false,
      message: err.message
    }
  } finally {
    $q.loading.hide()
  }
}

const onScanFailure = (_error) => {
  // Silent failure is better for UX while scanning
}

onUnmounted(() => {
  stopScan()
})
</script>
