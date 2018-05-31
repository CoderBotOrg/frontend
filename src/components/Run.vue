<template>
  <div>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 lg6>
          <img :src="webcamStream"/>
        </v-flex>
        <v-flex xs12 lg6 style="background-color: black; color:white">
          <pre>
          asdfTest
          </pre>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      webcamStream: process.env.CB_ENDPOINT + '/video/stream',
      CB: process.env.CB_ENDPOINT,
    };
  },
  mounted() {
    console.log(CB)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {

}
</style>
