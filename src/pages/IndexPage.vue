<template>
  <q-page class="bg-dark text-white">
    <!-- Hero Section -->
    <div class="hero-section flex flex-center text-center relative-position">
      <div class="hero-overlay"></div>
      <div class="z-top relative-position q-pa-md">
        <q-img src="/slaf-crest.svg" width="120px" class="q-mb-md filter-glow" />
        <h1 class="text-h2 text-weight-bold text-accent q-mb-sm text-uppercase" style="letter-spacing: 2px;">
          Sri Lanka Air Force
        </h1>
        <h2 class="text-h4 text-weight-medium q-mt-none q-mb-xl opacity-90">
          Bus Pass System
        </h2>
        
        <q-btn 
          color="accent" 
          text-color="dark" 
          size="lg" 
          label="Login to Bus Pass Portal" 
          icon-right="login" 
          class="rounded-borders glossy shadow-10" 
          padding="15px 40px" 
          to="/login"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
</script>

<style lang="scss">
@import 'quasar/src/css/variables.sass';

.opacity-90 { opacity: 0.9; }

// Hero Section styling
.hero-section {
  height: 100vh; // Full screen now since there's no content below it
  background-image: url('/hero-aircraft.png');
  background-size: cover;
  background-position: center;
  position: relative;
  
  .hero-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba($primary, 0.7); // Deep blue overlay
  }

  .filter-glow {
    filter: drop-shadow(0 0 20px rgba($accent, 0.4));
  }
}
</style>
