<template>
  <!-- Card Container (CR80 Standard) -->
  <div class="card-container" id="bus-pass">
    <!-- Sidebar -->
    <div class="sidebar">TRAVEL PASS</div>

    <div class="main-content">
      <!-- Watermark -->
      <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" class="watermark" alt="SLAF Watermark">

      <!-- Header with Logos -->
      <div class="header-row">
        <div class="logo-group">
          <img src="https://www.sltb.lk/assets/sltblogo-DiHTzX2Z.png" alt="SLTB" class="h-10 w-auto">
          <div class="h-6 w-px bg-slate-200 mx-1"></div>
          <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" alt="SLAF" class="h-10 w-auto">
        </div>
        <div class="text-right">
          <span class="label-text">VALID UNTIL / වලංගු කාලය</span>
          <div class="text-red-800 font-extrabold text-[12px] italic">ANNUAL PASS {{ passData.year }}</div>
        </div>
      </div>

      <!-- Information Section -->
      <div class="grid grid-cols-[1fr_105px] gap-4 flex-1">
        <div class="flex flex-col">
          <!-- Smart Chip Design -->
          <div class="smart-chip"></div>
          
          <div class="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span class="label-text">FROM / සිට</span>
              <div class="value-text">{{ passData.fromDate }}</div>
            </div>
            <div>
              <span class="label-text">TO / දක්වා</span>
              <div class="value-text">{{ passData.toDate }}</div>
            </div>
          </div>

          <div class="mb-3">
            <span class="label-text">DESTINATION / ගමනාන්තය</span>
            <div class="value-text text-sm uppercase">{{ passData.destination }}</div>
          </div>

          <div>
            <span class="label-text">AUTHORIZED BY / බලයලත් නිලධාරී</span>
            <div class="border-b border-dashed border-slate-300 w-32 h-4 mb-1"></div>
            <div class="text-[8px] font-bold text-slate-400">SLAF / SLTB HQ</div>
          </div>
        </div>

        <!-- Photo and QR Code -->
        <div class="flex flex-col items-end">
          <div class="photo-slot">
            <img v-if="passData.photo" :src="passData.photo" class="w-full h-full object-cover">
            <div v-else class="text-[9px] text-slate-400 font-bold">PHOTO</div>
          </div>
          <div class="mt-2 text-center">
             <div class="bg-white p-1 rounded-sm shadow-sm border border-slate-100">
               <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${passData.id}`" alt="QR" class="w-12 h-12">
             </div>
             <div class="text-[6px] text-slate-400 mt-1">{{ passData.id }}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        Sri Lanka Transport Board, No 200, Kirula Road, Colombo 05. OFFICIAL DOCUMENT.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  passData: {
    type: Object,
    default: () => ({
      year: '2026',
      fromDate: '2026/01/01',
      toDate: '2026/12/31',
      destination: 'KATUNAYAKE - COLOMBO',
      id: 'SLAF-0001',
      photo: null
    })
  }
})
</script>

<style scoped>
.card-container {
  width: 420px;
  height: 260px;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  position: relative;
  border: 1px solid #222;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.sidebar {
  width: 45px;
  background: linear-gradient(180deg, #991b1b 0%, #450a0a 100%) !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white !important;
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
  text-align: left;
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
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%) !important;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
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
  display: block;
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
}

@media print {
  body { background: white !important; padding: 0 !important; }
  .card-container { border: 1px solid #000 !important; box-shadow: none !important; }
}
</style>
