<template>
  <div>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 lg6>
          <img :src="webcamStream"/>

        </v-flex>
        <v-flex xs12 lg6>
        <v-layout row wrap>
          <v-flex xs12 sm12>
            <v-btn-toggle>

              <v-btn flat v-on:mousedown="move(0)" v-on:mouseup="stop()">
                <v-icon>keyboard_arrow_up</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs12 sm12>
            <v-btn-toggle>
              <v-btn flat @click.native="move(1)" v-on:mouseup="stop()">
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>

              <v-btn flat @click.native="move(2)" v-on:mouseup="stop()">
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs12 sm12>
            <v-btn-toggle>

              <v-btn flat @click.native="move(3)" v-on:mouseup="stop()">
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>

            </v-btn-toggle>
          </v-flex>
        </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  methods:{
    move: function(direction) {
      let axios = this.$axios
      let CB = this.$data.CB
      if (direction == 0){
        // UP, move forward
        axios.post(CB+'/move', {
          speed: 100,
          elapse: -1
        }).catch((error)=>{
          console.log('API error', error)
        })
      } else if (direction == 1){
        // RIGHT, turn right
        axios.post(CB+'/turn').catch((error)=>{
          console.log('API error', error)
        })
      } else if (direction == 2){
        // LEFT, turn left
        axios.post(CB+'/turn').catch((error)=>{
          console.log('API error', error)
        })
      } else if (direction == 3){
        // DOWN, move backwards
        axios.post(CB+'/move', {
          speed: -100,
          elapse: -1
        }).catch((error)=>{
          console.log('API error', error)
        })
      }
    },
    stop: function(){
      this.$axios.get().catch((error)=>{
        console.log('API error', error)
      })
    }
  },
  data() {
    return {
      webcamStream: process.env.CB_ENDPOINT + '/video/stream',
      CB: process.env.CB_ENDPOINT,
    };
  },
  mounted() {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {

}
</style>
