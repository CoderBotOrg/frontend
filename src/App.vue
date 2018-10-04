<template>
	<div id="app">
	    <router-view/>
  	</v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      }
    },
	name: 'App',
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
