<template>
	<div id="app">
		<v-app id="inspire">

	    <v-navigation-drawer
	      fixed
	      v-model="drawer"
	      app
	    >

	    <v-list dense>
	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>home</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Home</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        Utente
	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>account_box</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Luigi Beretta</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>exit_to_app</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Logout</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        Attività
	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>add</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Nuova</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>open_in_new</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Apri</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>close</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Chiudi</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>

	        Altro
	        <v-list-tile>
	          <v-list-tile-action>
	            <v-icon>settings</v-icon>
	          </v-list-tile-action>
	          <v-list-tile-content>
	            <v-list-tile-title>Impostazioni</v-list-tile-title>
	          </v-list-tile-content>
	        </v-list-tile>
	    </v-list>

	    </v-navigation-drawer>

	    <v-toolbar color="indigo" dark fixed app>
	      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
	      <v-toolbar-title>Coderbot</v-toolbar-title>
	    </v-toolbar>

	    <v-content>
	    	<!-- Inject component here-->
	    	<router-view/>
	    </v-content>
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
