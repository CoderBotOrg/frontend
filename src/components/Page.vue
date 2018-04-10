<template>

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
    </v-content>
  </v-app>
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
