<template>
	<div id="activity">
		        <v-textarea
          name="input-7-1"
          label="Default style"
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          hint="Hint text"
        ></v-textarea>
	</div>
</template>

<script>
export default {
	name: 'HelloWorld',
	data() {
		return {
			drawer: null,
			source: null,
			msg: 'Welcome to Your Vue.js App',
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
