<template>
  <q-card class="app-card q-mb-md bg-dark text-white border-accent shadow-10 overflow-hidden" :class="{ 'mini-card': mini }">
    <div class="card-header bg-gradient q-pa-sm flex justify-between items-center">
      <div>
        <div class="text-overline text-accent line-height-1">Application ID</div>
        <div :class="mini ? 'text-subtitle2' : 'text-h6'" class="text-weight-bold">{{ app.id }}</div>
      </div>
      <div class="text-right flex items-center">
        <div class="q-mr-md gt-xs">
          <div class="text-overline text-grey-4 line-height-1">Current Status</div>
          <q-badge :color="getBadgeColor(app.status)" class="q-px-sm q-py-xs text-weight-bold">
            {{ app.status }}
          </q-badge>
        </div>
        <q-btn flat round dense icon="open_in_new" color="accent" @click="$emit('view', app)">
          <q-tooltip>View Full Details</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-card-section :class="mini ? 'q-pa-sm' : ''">
      <div class="row q-col-gutter-sm" :class="mini ? 'q-mb-sm' : 'q-mb-lg'">
        <div class="col-12 col-sm-6">
          <div class="detail-item">
            <q-icon name="person" color="accent" size="xs" />
            <span class="q-ml-sm text-grey-4">Officer:</span>
            <span class="q-ml-xs">{{ app.rank }} {{ app.name }} ({{ app.svcNo }})</span>
          </div>
        </div>
        <div class="col-12 col-sm-6" v-if="!mini">
          <div class="detail-item">
            <q-icon name="route" color="accent" size="xs" />
            <span class="q-ml-sm text-grey-4">Route:</span>
            <span class="q-ml-xs">{{ app.journeyFrom }} to {{ app.journeyTo }}</span>
          </div>
        </div>
      </div>

      <!-- Visual Progress Stepper -->
      <div class="progress-container q-px-sm" :class="mini ? 'q-pb-sm q-mt-md' : 'q-pb-md q-mt-xl'">
        <div class="progress-line" :style="mini ? 'top: 6px; height: 3px;' : ''">
          <div class="progress-fill" :style="{ width: getProgressPercent(app.status) + '%' }"></div>
        </div>
        
        <div class="steps-wrapper flex justify-between full-width items-start relative-position">
          <div v-for="(step, idx) in workflowSteps" :key="idx" class="step-point text-center" :class="{ 'active': isStepActive(app.status, idx), 'completed': isStepCompleted(app.status, idx) }">
            <div class="dot-container">
              <div class="dot shadow-accent" :style="mini ? 'width: 14px; height: 14px; border-width: 2px;' : ''">
                <q-icon v-if="isStepCompleted(app.status, idx)" name="check" :size="mini ? '10px' : '14px'" />
              </div>
            </div>
            <div class="step-label q-mt-xs" v-if="!mini || isStepActive(app.status, idx)">{{ step.label }}</div>
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Detailed Footer for issued passes -->
    <q-separator dark v-if="app.status === 'Completed / Pass Issued'" />
    <q-card-section v-if="app.status === 'Completed / Pass Issued'" class="bg-blue-10/30 q-pa-md border-top-glow">
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-sm-auto text-center">
          <div class="bg-white q-pa-xs rounded-borders inline-block">
            <qrcode-vue :value="verificationUrl" :size="mini ? 60 : 100" level="H" />
          </div>
          <div class="text-caption text-accent q-mt-xs">Verify Online</div>
        </div>
        <div class="col">
          <div class="text-h6 text-accent">PASS ISSUED: #{{ app.busPassNo }}</div>
          <div class="text-subtitle2 opacity-70">Handed over on {{ app.dateHoToCamp }}</div>
          
          <q-btn 
            color="primary" 
            icon="print" 
            label="Print e-Pass" 
            class="q-mt-md" 
            @click="generatePDF" 
          />
        </div>
      </div>
    </q-card-section>

    <!-- Hidden Render for printing -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
       <BusPassCard :passData="mappedData" />
    </div>
  </q-card>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'
import { computed } from 'vue'
import BusPassCard from 'components/BusPassCard.vue'

const props = defineProps({
  app: Object,
  mini: Boolean
})

defineEmits(['view'])

// Step 2: Data Mapping from guide
const mappedData = computed(() => ({
  year: 2026,
  fromDate: '2026/01/01',
  toDate: '2026/12/31',
  destination: `${props.app.journeyFrom} - ${props.app.journeyTo}`,
  id: props.app.svcNo,
  name: `${props.app.rank} ${props.app.name}`,
  photo: props.app.documentUrl ? `https://lrscjblgerapzosnbxjw.supabase.co/storage/v1/object/public/documents/${props.app.documentUrl}` : null
}))

const verificationUrl = computed(() => {
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}#/verify?id=${props.app.id}`
})

// Step 4: Printing Feature from guide
const generatePDF = () => {
  const printContents = document.getElementById('bus-pass').outerHTML;
  const originalContents = document.body.innerHTML;

  // Simple and effective printing as requested
  document.body.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:white;">
      ${printContents}
    </div>
  `;
  
  window.print();
  window.location.reload(); 
};

const workflowSteps = [
  { label: 'Submitted', status: 'Pending Off I/C' },
  { label: 'O/Room', status: 'Pending O/Room' },
  { label: 'P3 Desk', status: 'Pending P3 Officer' },
  { label: 'Command', status: 'Pending Base CMDr' },
  { label: 'Director', status: 'Pending P&R' },
  { label: 'Finance', status: 'Pending Imprest' },
  { label: 'Issued', status: 'Completed / Pass Issued' }
]

const getStatusIndex = (status) => {
  if (status === 'Completed / Pass Issued') return 7
  const idx = workflowSteps.findIndex(s => s.status === status)
  return idx === -1 ? 0 : idx
}

const getProgressPercent = (status) => {
  const idx = getStatusIndex(status)
  return (idx / (workflowSteps.length - 1)) * 100
}

const isStepActive = (status, index) => {
  return getStatusIndex(status) === index
}

const isStepCompleted = (status, index) => {
  return getStatusIndex(status) > index
}

const getBadgeColor = (status) => {
  if (status.includes('Pending')) return 'warning'
  if (status.includes('Approved') || status.includes('Ready') || status.includes('Completed')) return 'positive'
  return 'primary'
}
</script>

<style lang="scss" scoped>
.line-height-1 { line-height: 1; }

.app-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  &.mini-card {
    border-left: 2px solid $accent;
    .detail-item { font-size: 0.8rem; }
  }
  &:not(.mini-card):hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border-color: rgba($accent, 0.4);
  }
}

.bg-gradient {
  background: linear-gradient(90deg, rgba($primary, 1) 0%, rgba($primary, 0.6) 100%);
}

.filter-glow {
  filter: drop-shadow(0 0 5px $accent);
}

.border-accent {
  border-left: 4px solid $accent;
}

.detail-item {
  display: flex;
  align-items: center;
}

// Custom Stepper
.progress-container {
  position: relative;
}

.progress-line {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background: $accent;
  box-shadow: 0 0 10px $accent;
  transition: width 1s ease-in-out;
}

.steps-wrapper {
  z-index: 2;
}

.step-point {
  flex: 1;
  .dot-container {
    display: flex;
    justify-content: center;
  }
  .dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #2a2a2a;
    border: 3px solid rgba(255,255,255,0.2);
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .step-label {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: bold;
    color: rgba(255,255,255,0.3);
    transition: all 0.4s ease;
  }

  &.completed {
    .dot {
      background: $accent;
      border-color: $accent;
      color: #000;
    }
    .step-label { color: $accent; }
  }

  &.active {
    .dot {
      background: #fff;
      border-color: $accent;
      box-shadow: 0 0 15px $accent;
      transform: scale(1.1);
    }
    .step-label { 
      color: #fff;
    }
  }
}

.border-top-glow {
  border-top: 1px solid rgba($accent, 0.3);
}

.shadow-accent {
  box-shadow: 0 0 10px rgba($accent, 0.3);
}
</style>
