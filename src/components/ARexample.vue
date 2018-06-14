<template>
  <div>

   <div id="img"></div>
   <div id="btn">
    <v-btn v-on:click="initAR()">Show AR</v-btn>
    <v-btn v-on:click="removeAr()">Hide AR</v-btn>
   </div>

    
  </div>
</template>

<script>
  export default {
    name : '',
    data : function () {
      return {
        obj : new THREE.Object3D(),
        created : 0,
        visible : 1
      }
    },
    methods: {
      initAR : function () {
        //this.obj = new THREE.Object3D();
        //console.log(this.obj);
        if(this.created == 1){
          if(this.visible == 0){
            this.visible = 1;
            this.obj.visible = true;
          }
         
          
        }else{
        
        THREEx.ArToolkitContext.baseURL = 'static/'
        console.log("ecomi")
        //////////////////////////////////////////////////////////////////////////////////
  //    Init
  //////////////////////////////////////////////////////////////////////////////////

  // init renderer
  var renderer  = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  renderer.setSize( 640, 480 );
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.getElementById("img").appendChild( renderer.domElement);
  //document.ar.appendChild( renderer.domElement );

  // array of functions for the rendering loop
  var onRenderFcts= [];

  // init scene and camera
  var scene = new THREE.Scene();
  scene = new THREE.Scene();
        var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
        scene.add( ambientLight );
        var pointLight = new THREE.PointLight( 0xffffff, 0.6 );



  //////////////////////////////////////////////////////////////////////////////////
  //    Initialize a basic camera
  //////////////////////////////////////////////////////////////////////////////////

  // Create a camera
  var camera = new THREE.Camera();
  camera.add( pointLight );
  scene.add(camera);

  ////////////////////////////////////////////////////////////////////////////////
  //          handle arToolkitSource
  ////////////////////////////////////////////////////////////////////////////////

  var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    // sourceType : 'webcam',

    // // to read from an image
    sourceType : 'image',
    sourceUrl : THREEx.ArToolkitContext.baseURL + 'data/images/prova.jpg',

    // to read from a video
    // sourceType : 'video',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
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
  var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '/data/data/camera_para.dat',
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
  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : THREEx.ArToolkitContext.baseURL + '/data/data/patt.hiro',
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    changeMatrixMode: 'cameraTransformMatrix'
  })
  // as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
  scene.visible = false

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object in the scene
  //////////////////////////////////////////////////////////////////////////////////

 
     var onProgress = function(xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log(Math.round(percentComplete, 2) + '% downloaded');
                }
            };

            //console.log(this.obj);
            var onError = function(xhr) {};
            THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
            function loader(materials, obj){
               materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('static/obj/');
                objLoader.load('futurama.obj', function(object) {
                    this.obj.add(object);
                    scene.add(this.obj);  

                }, onProgress);

            };


            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath('static/obj/');
            mtlLoader.load('futurama.mtl', function(materials) {
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath('static/obj/');
                objLoader.load('futurama.obj', function(object) {
                    this.obj.add(object);
                    scene.add(this.obj);  

                }.bind(this), onProgress);
            }.bind(this));
           // console.log(this.obj);




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
  this.created = 1;
        }
      },
      removeAr : function(){
        //console.log(this.count);
        this.obj.visible = false;
        this.visible = false;
        
        
        
      }

    }

  }
</script>
