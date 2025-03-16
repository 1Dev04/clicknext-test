<template>
  <LoginPage/>
</template>

<script>
import LoginPage from './components/DepoAndwithdrawPage.vue'

export default {
  name: 'App',
  components: {
    LoginPage
  }
}
</script>

<style>
#app {
    /* font */
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 500px;
    /* container สูงเต็มจอ */
    color: #000000;
}
</style>
