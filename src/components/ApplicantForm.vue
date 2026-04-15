<template>
  <div>
    <h4 class="text-h5 text-weight-bold text-accent q-mb-md">Submit New Application</h4>

    <q-card v-if="!submitted" class="bg-blue-10 text-white shadow-5" style="border: 1px solid rgba(255,215,0,0.3)">
      <q-card-section class="bg-primary text-accent q-pa-sm">
        <div class="text-h6 text-center">e-PAS Request Form</div>
      </q-card-section>

      <q-form @submit="onSubmit" class="q-pa-lg q-gutter-md">
        
        <!-- Applicant Details -->
        <div class="text-subtitle1 text-accent text-weight-bold q-mb-sm">Applicant Details & Documents</div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-input dark filled v-model="form.name" label="Full Name *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-4">
            <q-file 
              dark 
              filled 
              v-model="form.documentFile" 
              label="Upload NIC/Photo *" 
              accept="image/*,.pdf"
              :rules="[val => !!val || 'Document is required']"
            >
              <template v-slot:prepend><q-icon name="attach_file" color="accent" /></template>
            </q-file>
          </div>
        </div>
        
        <q-input dark filled v-model="form.address" label="Address *" :rules="[val => !!val || 'Required']" />
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input 
              dark filled 
              v-model="form.nic" 
              label="NIC Number *" 
              hint="Format: 123456789V or 200012345678"
              :rules="[
                val => !!val || 'Required',
                val => /^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(val) || 'Invalid NIC Format'
              ]" 
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input 
              dark filled 
              v-model="form.mobile" 
              label="Mobile No *" 
              mask="##########" 
              unmasked-value
              :rules="[
                val => !!val || 'Required',
                val => val.length === 10 || 'Must be 10 digits',
                val => /^[0-9]+$/.test(val) || 'Numbers only'
              ]" 
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-select dark filled v-model="form.rank" :options="['AC', 'LAC', 'Cpl', 'Sgt', 'F/Sgt', 'W/O', 'Plt Off', 'Fg Off', 'Flt Lt', 'Sqn Ldr', 'Wg Cdr', 'Gp Capt', 'Air Cdre', 'AVM', 'AM', 'ACM']" label="Rank *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-4">
            <q-input dark filled v-model="form.postedCamp" label="Duty Station / Posted Camp *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-4">
            <q-input dark filled v-model="form.svcNo" label="Service No *" mask="######" :rules="[val => !!val || 'Required']" />
          </div>
        </div>

        <q-separator dark class="q-my-lg" />

        <!-- Bus Pass Info -->
        <div class="text-subtitle1 text-accent text-weight-bold q-mb-sm">Bus Pass Info</div>
        
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select dark filled v-model="form.hasPreviousPass" :options="['Yes', 'No']" label="Has Previous Pass? *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-6">
            <q-input 
              dark filled 
              v-model="form.previousPassNo" 
              label="Previous Pass No (If any)" 
              :disable="form.hasPreviousPass === 'No'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.journeyFrom" label="Journey From *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.journeyTo" label="Journey To *" :rules="[val => !!val || 'Required']" />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.nearestTown" label="Nearest Main Town *" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.busRouteNo" label="Bus Route No *" :rules="[val => !!val || 'Required']" />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.amount" label="Fee / Amount Rs *" type="number" :rules="[val => !!val || 'Required']" />
          </div>
          <div class="col-12 col-md-6">
            <q-input dark filled v-model="form.distance" label="Distance in km *" type="number" :rules="[val => !!val || 'Required']" />
          </div>
        </div>

        <div class="q-mt-xl text-right">
          <q-btn label="Reset" type="reset" color="primary" flat class="q-mr-sm" />
          <q-btn label="Submit Application" type="submit" color="accent" text-color="dark" class="glossy" />
        </div>
      </q-form>
    </q-card>

    <q-card v-else class="bg-positive text-white text-center q-pa-xl shadow-5">
      <q-icon name="check_circle" size="4rem" class="q-mb-md" />
      <h5 class="q-mt-none q-mb-sm">Application Submitted!</h5>
      <p class="opacity-80">Your e-PAS request has been successfully recorded and forwarded to the <strong>Off I/C Section</strong>.</p>
      <q-btn outline color="white" label="Submit Another Request" @click="resetForm" class="q-mt-md" />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApplicationStore } from 'stores/applications'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const appStore = useApplicationStore()

const submitted = ref(false)
const form = ref({
  name: '',
  address: '',
  nic: '',
  mobile: '',
  rank: '',
  postedCamp: '',
  svcNo: '',
  hasPreviousPass: 'No',
  previousPassNo: '',
  journeyFrom: '',
  journeyTo: '',
  nearestTown: '',
  busRouteNo: '',
  amount: '',
  distance: '',
  documentFile: null
})

const onSubmit = async () => {
  $q.loading.show({ message: 'Uploading documents & submitting...' })
  try {
    let documentUrl = null
    
    // 1. Upload File
    if (form.value.documentFile) {
      const file = form.value.documentFile
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${form.value.svcNo}.${fileExt}`
      const filePath = `applications/${fileName}`

      const { error: uploadError } = await appStore.uploadDocument(filePath, file)
      if (uploadError) throw new Error('File upload failed: ' + uploadError.message)
      
      documentUrl = filePath
    }

    // 2. Submit Application
    const res = await appStore.submitApplication({ 
      ...form.value,
      documentUrl 
    })

    if (res.success) {
      submitted.value = true
    } else {
      throw new Error(res.error)
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message,
      icon: 'error'
    })
  } finally {
    $q.loading.hide()
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    address: '',
    nic: '',
    mobile: '',
    rank: '',
    postedCamp: '',
    svcNo: '',
    hasPreviousPass: 'No',
    previousPassNo: '',
    journeyFrom: '',
    journeyTo: '',
    nearestTown: '',
    busRouteNo: '',
    amount: '',
    distance: '',
    documentFile: null
  }
  submitted.value = false
}
</script>

<style scoped>
.opacity-80 { opacity: 0.8; }
</style>
