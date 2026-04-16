<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark text-white">
    <q-header elevated class="bg-primary/90 backdrop-blur">
      <q-toolbar class="q-py-sm">
        <q-btn flat no-caps to="/" class="q-mr-sm">
          <q-img src="slaf-crest.png" width="40px" class="q-mr-md" />
          <div class="text-left">
            <div class="text-subtitle2 text-weight-bolder text-accent line-height-1">SLAF e-PAS</div>
            <div class="text-caption opacity-70 line-height-1">Bus Pass System</div>
          </div>
        </q-btn>

        <q-space />

        <div class="gt-xs q-gutter-sm">
          <q-btn flat no-caps label="Home" to="/" />
          <q-btn flat no-caps label="Verify e-Pass" icon="qr_code_scanner" to="/verify" color="accent" />
          <q-btn flat no-caps label="Track Status" icon="track_changes" to="/dashboard/track" />
        </div>

        <q-btn 
          color="accent" 
          text-color="dark" 
          label="Login" 
          icon="login" 
          class="q-ml-md gt-xs" 
          to="/login" 
        />
        
        <!-- Mobile Menu -->
        <q-btn flat round icon="menu" class="lt-sm">
          <q-menu dark class="bg-primary">
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup to="/">
                <q-item-section>Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/verify">
                <q-item-section>Verify e-Pass</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/dashboard/track">
                <q-item-section>Track Status</q-item-section>
              </q-item>
              <q-separator dark />
              <q-item clickable v-close-popup to="/login">
                <q-item-section class="text-accent">Login</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    
    <q-footer class="bg-dark text-grey-5 q-pa-md border-top">
      <div class="text-center text-caption">
        &copy; 2026 Sri Lanka Air Force. All Rights Reserved. | 
        <span class="text-accent">Directorate of IT Personnel & Revenue</span>
      </div>
    </q-footer>
  </q-layout>
</template>

<style lang="scss">
.backdrop-blur {
  backdrop-filter: blur(10px);
}
.line-height-1 { line-height: 1; }
.border-top { border-top: 1px solid rgba(255, 255, 255, 0.1); }
</style>

<script setup>
</script>
