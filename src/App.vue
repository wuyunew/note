<script setup>
import Head from './components/Head.vue';

</script>

<template>
  <div class="myDoc">
    <header>
      <Head></Head>
    </header>
    <main><router-view></router-view></main>
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  width: 100%;
}
.myDoc {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
