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
  created(){
    //////////////////////////////////////////////////////////////////////////////////
  //    Init
  //////////////////////////////////////////////////////////////////////////////////

  // init renderer
  var renderer  = new this.$THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new this.$THREE.Color('lightgrey'), 0)
  renderer.setSize( 640, 480 );
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.body.appendChild( renderer.domElement );

  // array of functions for the rendering loop
  var onRenderFcts= [];

  // init scene and camera
  var scene = new this.$THREE.Scene();
  scene = new this.$THREE.Scene();
        var ambientLight = new this.$THREE.AmbientLight( 0xcccccc, 0.5 );
        scene.add( ambientLight );
        var pointLight = new this.$THREE.PointLight( 0xffffff, 0.6 );



  //////////////////////////////////////////////////////////////////////////////////
  //    Initialize a basic camera
  //////////////////////////////////////////////////////////////////////////////////

  // Create a camera
  var camera = new this.$THREE.Camera();
  camera.add( pointLight );
  scene.add(camera);

  ////////////////////////////////////////////////////////////////////////////////
  //          handle arToolkitSource
  ////////////////////////////////////////////////////////////////////////////////

  var arToolkitSource = new this.$THREEx.ArToolkitSource({
    // to read from the webcam
    // sourceType : 'webcam',

    // // to read from an image
    sourceType : 'image',
    sourceUrl : this.$THREEx.ArToolkitContext.baseURL + '../data/images/prova.jpg',

    // to read from a video
    // sourceType : 'video',
    // sourceUrl : this.$THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
  })

  arToolkitSource.init(function onReady(){
    onResize()
  })

  // handle resize
  window.addEventListener('resize', function(){
    onResize()
  })
  function onResize(){
    arToolkitSource.onResize()
    arToolkitSource.copySizeTo(renderer.domElement)
    if( arToolkitContext.arController !== null ){
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  //          initialize arToolkitContext
  ////////////////////////////////////////////////////////////////////////////////


  // create atToolkitContext
  var arToolkitContext = new this.$THREEx.ArToolkitContext({
    cameraParametersUrl: this.$THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode: 'mono',
  })
  // initialize it
  arToolkitContext.init(function onCompleted(){
    // copy projection matrix to camera
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
  })

  // update artoolkit on every frame
  onRenderFcts.push(function(){
    if( arToolkitSource.ready === false ) return

    arToolkitContext.update( arToolkitSource.domElement )

    // update scene.visible if the marker is seen
    scene.visible = camera.visible
  })

  ////////////////////////////////////////////////////////////////////////////////
  //          Create a ArMarkerControls
  ////////////////////////////////////////////////////////////////////////////////

  // init controls for camera
  var markerControls = new this.$THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : this.$THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
    // patternUrl : this.$THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    changeMatrixMode: 'cameraTransformMatrix'
  })
  // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
  scene.visible = false

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object in the scene
  //////////////////////////////////////////////////////////////////////////////////


    var onProgress = function ( xhr ) {
          if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
          }
        };

            var onError = function ( xhr ) { };
        this.$THREE.Loader.Handlers.add( /\.dds$/i, new this.$THREE.DDSLoader() );

    var mtlLoader = new this.$THREE.MTLLoader();
        mtlLoader.setPath( 'obj/' );
        mtlLoader.load( 'futurama.mtl', function( materials ) {
          materials.preload();
          var objLoader = new this.$THREE.OBJLoader();
          objLoader.setMaterials( materials );
          objLoader.setPath( 'obj/' );
          objLoader.load( 'futurama.obj', function ( object ) {
            scene.add( object );
          }, onProgress );
        });




  //////////////////////////////////////////////////////////////////////////////////
  //    render the whole thing on the page
  //////////////////////////////////////////////////////////////////////////////////

  // render the scene
  onRenderFcts.push(function(){
    renderer.render( scene, camera );

  })

  // run the rendering loop
  var lastTimeMsec= null
  requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
  })
  },
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
