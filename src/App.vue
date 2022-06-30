<template>
 <div id="app">
  <router-view />
 </div>
</template>
<script>
export default {
  data() {
    return {
      drawer: null,
    };
  },
  name: 'App',
};

</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
