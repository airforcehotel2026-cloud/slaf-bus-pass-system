<template>
  <div class="card-container" id="bus-pass">
    <div class="sidebar">TRAVEL PASS</div>

    <div class="main-content">
      <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" class="watermark" alt="SLAF Watermark">

      <div class="header-row">
        <div class="logo-group">
          <img src="https://www.sltb.lk/assets/sltblogo-DiHTzX2Z.png" alt="SLTB" class="logo-img">
          <div class="divider"></div>
          <img src="https://airforcehotel2026-cloud.github.io/slaf-bus-pass-system/slaf-crest.png" alt="SLAF" class="logo-img">
        </div>
        <div class="text-right">
          <span class="label-text">VALID UNTIL / වලංගු කාලය</span>
          <div class="annual-pass-text">ANNUAL PASS {{ passData.year }}</div>
        </div>
      </div>

      <div class="details-grid">
        <div class="left-col">
          <div class="smart-chip"></div>
          
          <div class="row-flex mb-10">
            <div class="flex-1">
              <span class="label-text">FROM / සිට</span>
              <div class="value-text">{{ passData.fromDate }}</div>
            </div>
            <div class="flex-1">
              <span class="label-text">TO / දක්වා</span>
              <div class="value-text">{{ passData.toDate }}</div>
            </div>
          </div>

          <div class="mb-10">
            <span class="label-text">DESTINATION / ගමනාන්තය</span>
            <div class="value-text small-caps">{{ passData.destination }}</div>
          </div>

          <div>
            <span class="label-text">AUTHORIZED BY / බලයලත් නිලධාරී</span>
            <div class="signature-line"></div>
            <div class="auth-subtext">SLAF / SLTB HQ</div>
          </div>
        </div>

        <div class="right-col">
          <div class="photo-slot">
            <img v-if="passData.photo" :src="passData.photo" class="full-img">
            <div v-else class="photo-placeholder">PHOTO</div>
          </div>
          <div class="qr-container">
             <div class="qr-box">
               <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${passData.id}`" alt="QR" class="qr-img">
             </div>
             <div class="qr-id">{{ passData.id }}</div>
          </div>
        </div>
      </div>

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
/* Reset and Container */
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
  font-family: 'Inter', sans-serif;
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
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.logo-group {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 35px;
  width: auto;
}

.divider {
  height: 24px;
  width: 1px;
  background-color: #e2e8f0;
  margin: 0 8px;
}

.annual-pass-text {
  color: #991b1b;
  font-weight: 900;
  font-size: 12px;
  font-style: italic;
}

.details-grid {
  display: flex;
  gap: 15px;
  flex: 1;
}

.left-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.right-col {
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.row-flex {
  display: flex;
  gap: 10px;
}

.flex-1 { flex: 1; }

.mb-10 { margin-bottom: 10px; }

.smart-chip {
  width: 35px;
  height: 28px;
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%) !important;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;
  border: 1px solid rgba(0,0,0,0.1);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
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
  font-size: 13px;
  color: #0f172a;
  font-weight: 800;
  line-height: 1.1;
}

.small-caps {
  text-transform: uppercase;
  font-size: 12px;
}

.signature-line {
  border-bottom: 1px dashed #cbd5e1;
  width: 120px;
  height: 12px;
  margin-bottom: 2px;
}

.auth-subtext {
  font-size: 8px;
  font-weight: bold;
  color: #94a3b8;
}

.photo-slot {
  width: 95px;
  height: 110px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.full-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  font-size: 9px;
  color: #94a3b8;
  font-weight: bold;
}

.qr-container {
  margin-top: 8px;
  text-align: center;
}

.qr-box {
  background: white;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #f1f5f9;
}

.qr-img {
  width: 45px;
  height: 45px;
}

.qr-id {
  font-size: 6px;
  color: #94a3b8;
  margin-top: 2px;
}

.footer {
  font-size: 7px;
  color: #94a3b8;
  margin-top: auto;
  border-top: 1px solid #f1f5f9;
  padding-top: 6px;
}

@media print {
  body { background: white !important; }
  .card-container { 
    box-shadow: none !important; 
    border: 1px solid #000 !important; 
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
