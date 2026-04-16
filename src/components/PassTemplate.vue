<template>
  <div id="pass-render-container" class="preview-hidden">
    <!-- This matches the user's beautiful design exactly -->
    <div class="card-container" id="pass-card">
      <div class="sidebar">
        TRAVEL PASS
      </div>

      <div class="main-content">
        <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" class="watermark" alt="SLAF">

        <div class="header-row">
          <div class="logo-group">
            <img src="https://www.sltb.lk/assets/sltblogo-DiHTzX2Z.png" alt="SLTB" class="h-10 w-auto">
            <div class="h-6 w-px bg-slate-200"></div>
            <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" alt="SLAF" class="h-10 w-auto">
          </div>
          <div class="text-right">
            <span class="label-text">VALID UNTIL / වලංගු කාලය</span>
            <div class="text-red-800 font-extrabold text-[12px] italic">ANNUAL PASS 2026</div>
          </div>
        </div>

        <div class="flex row no-wrap gap-4 flex-1">
          <!-- Left Column -->
          <div class="flex-grow flex flex-col items-start text-left">
            <div class="smart-chip"></div>
            
            <div class="flex row gap-4 mb-3">
              <div>
                <span class="label-text">FROM / සිට</span>
                <div class="value-text">2026/01/01</div>
              </div>
              <div>
                <span class="label-text">TO / දක්වා</span>
                <div class="value-text">2026/12/31</div>
              </div>
            </div>

            <div class="mb-3">
              <span class="label-text">DESTINATION / ගමනාන්තය</span>
              <div class="value-text text-sm uppercase">{{ app?.journey_from || app?.journeyFrom }} - {{ app?.journey_to || app?.journeyTo }}</div>
            </div>

            <div class="flex row gap-4">
              <div>
                <span class="label-text">NAME & RANK</span>
                <div class="value-text text-[10px]">{{ app?.rank }} {{ app?.name }}</div>
              </div>
              <div>
                <span class="label-text">SERVICE NO</span>
                <div class="value-text text-[12px]">{{ app?.svc_no || app?.svcNo }}</div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div style="width: 105px;" class="flex flex-col items-end">
            <div class="photo-slot">
              <div class="text-[9px] text-slate-400 font-bold">PHOTO</div>
            </div>
            <div class="mt-2">
              <div id="qr-target-container" class="bg-white p-1 rounded-sm shadow-sm">
                <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=SLAF-${app?.id}`" class="w-12 h-12">
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          Sri Lanka Transport Board | Sri Lanka Air Force Official Document. STATION: {{ app?.posted_camp || app?.postedCamp }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  app: Object
})
</script>

<style scoped>
#pass-render-container {
  padding: 0;
  background: white;
  width: 420px;
  height: 260px;
}

.card-container {
  width: 420px;
  height: 260px;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  position: relative;
  border: 1px solid #222;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  /* Force colors to print */
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.sidebar {
  width: 45px;
  background: #991b1b !important; /* Use solid color fallback */
  background: linear-gradient(180deg, #991b1b 0%, #450a0a 100%) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white !important;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 4px;
  z-index: 20;
  text-transform: uppercase;
}

.main-content {
  flex: 1;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.watermark {
  position: absolute;
  top: 55%;
  left: 45%;
  transform: translate(-50%, -50%);
  width: 190px;
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #991b1b;
  padding-bottom: 10px;
  margin-bottom: 12px;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.smart-chip {
  width: 35px;
  height: 28px;
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
}

.smart-chip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0,0,0,0.2);
}

.label-text {
  font-size: 8px;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value-text {
  font-size: 14px;
  color: #0f172a;
  font-weight: 800;
  line-height: 1.2;
}

.photo-slot {
  width: 95px;
  height: 115px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.footer {
  font-size: 7px;
  color: #94a3b8;
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  padding-top: 6px;
  text-align: left;
}

.preview-hidden {
  position: absolute;
  left: -9999px;
  top: -9999px;
}
</style>
