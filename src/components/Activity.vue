<template>
<div id="activity">
	<h2 class="text-xs-left">Dati Progetto </h2>
	<v-form v-model="valid">
		<v-text-field
			v-model="name"
			label="Nome"
			required
		></v-text-field>
		<v-text-field
			v-model="description"
			label="Descrizione"
		></v-text-field>
	</v-form>
				<v-select
				v-model="select"
				:items="viste"
				label="Vista predefinita"
				required
			></v-select>
	<h2 class="text-xs-left">Tipografia </h2>
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
			viste: [
				{ text: 'Esecuzione', value: 'exec', },
				{ text: 'Blocchi', value: 'blocks' },
				{ text: 'Python', value: 'python', disabled: true }
			],
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
