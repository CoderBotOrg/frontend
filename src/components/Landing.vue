<template>
	<div>
        <prism language="javascript">
          var a
        </prism>

      <p class="display-3"> Benvenuto in CoderBot </p>
      <p class="display-1"> Scegli un'azione per iniziare </p>

      <v-btn depressed large color="primary"><v-icon left dark>open_in_new</v-icon>Apri Attività</v-btn> <br>
      <v-btn depressed large color="primary"><v-icon left dark>add</v-icon>Nuova Attività</v-btn> <br>
      <v-btn depressed large color="primary"><v-icon left dark>settings</v-icon>Impostazioni</v-btn> <br>
      <v-btn depressed large color="primary"><v-icon left dark>help</v-icon>Aiuto</v-btn> <br>

      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex text-xs-center>
            <v-tooltip left>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-container>
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
