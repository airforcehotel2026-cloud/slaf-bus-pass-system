<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <div class="max-width-1200 q-mx-auto">
      <h4 class="text-h4 text-weight-bold text-accent q-mb-xl">System Reports & Analytics</h4>
      
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-card class="bg-blue-10/20 shadow-10 text-center q-pa-lg">
            <q-icon name="trending_up" size="4rem" color="accent" />
            <div class="text-h5 q-mt-md">Usage Trends</div>
            <div class="text-caption opacity-70">Analyze monthly bus pass issuance</div>
            <q-btn flat color="accent" label="Generate Report" class="q-mt-md" />
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card class="bg-blue-10/20 shadow-10 text-center q-pa-lg">
            <q-icon name="summarize" size="4rem" color="primary" />
            <div class="text-h5 q-mt-md">Financial Summary</div>
            <div class="text-caption opacity-70">Total payments and reimbursements</div>
            <q-btn flat color="primary" label="Generate Report" class="q-mt-md" />
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card class="bg-blue-10/20 shadow-10 text-center q-pa-lg">
            <q-icon name="assessment" size="4rem" color="positive" />
            <div class="text-h5 q-mt-md">Operational Audit</div>
            <div class="text-caption opacity-70">Approval timeline efficiency</div>
            <q-btn flat color="positive" label="Generate Report" class="q-mt-md" />
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.max-width-1200 { max-width: 1200px; }
</style>
