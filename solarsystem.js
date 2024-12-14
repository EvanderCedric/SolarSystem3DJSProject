import * as THREE from "./three.js-master145/build/three.module.js";
import { OrbitControls } from "./three.js-master145/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three.js-master145/examples/jsm/loaders/GLTFLoader.js"
import { TextGeometry } from "./three.js-master145/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "./three.js-master145/examples/jsm/loaders/FontLoader.js";



let camera, scene, renderer, controls, spaceship;
let clock = new THREE.Clock();

let init = () => {
//Scene
  scene = new THREE.Scene();
  
  //Camera atrribut
  let w = window.innerWidth;
  let h = window.innerHeight;
  let aspect = w / h;
  let near = 0.1;
  let far = 10000;

  //Free Rotate Camera
  let fov = 75;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(640, 480, 240);
  camera.lookAt(640,320, 0);

  // //Spaceship Camera
  // let Spaceshipfov = 90;
  // SpaceshipCamera = new THREE.PerspectiveCamera(Spaceshipfov, aspect, near, far);
  // SpaceshipCamera.position.set(x,y + 16)

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setClearColor("#7e7e7e");
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  //Controls
  controls = new OrbitControls(camera, renderer.domElement);

  // spaceship = importDynamicGLTF("helicopter.glb");
};


let render = () => {
  renderer.shadowMap.enabled = true;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
};

window.onload = () => {
  init();
  render();
  createObjects();
};

window.onresize = () => {
  let w = window.innerWidth;
  let h = window.innerHeight;
  renderer.setSize(w, h);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};

const createObjects = () =>{

    //Sun
    let sun = cSun(40,32,32,"./assets/textures/sun.jpg");
    sun.position.set(640, 320, 0);
    scene.add(sun);
    
    //Light
    let PointLight = createPointLight({color:"#FFFFFF"}, 450000, 1280); 
    PointLight.position.set(640,320,0); 
    PointLight.castShadow = true;
    scene.add(PointLight);

    let PointLightHelper = new THREE.PointLightHelper(PointLight);
    scene.add(PointLightHelper)


    
    //Planet
    let mercury = cBall(3.2,32,32,"./assets/textures/mercury.jpg");
    mercury.position.set(58,320,0);

    let venus = cBall(4.8,32,32,"./assets/textures/venus.jpg");
    venus.position.set(80,320,0);

    let earth = cBall(4.8,32,32,"./assets/textures/earth.jpg");
    earth.position.set(100,320,0);

    let satellite = cSatelite(1, 0.5, 0.4, 8); 
    satellite.position.copy(earth.position.clone().add(new THREE.Vector3(8, 0, 0))); 

    satellite.rotation.x = Math.PI/180 * -90;
    satellite.rotation.z = Math.PI/180 * 90;

    let mars = cBall(4,32,32,"./assets/textures/mars.jpg");
    mars.position.set(130,320,0);

    let jupiter = cBall(13,32,32,"./assets/textures/jupiter.jpg");
    jupiter.position.set(175,320,0);

    let saturn = cBall(10,32,32,"./assets/textures/saturn.jpg");
    saturn.position.set(240,320,0);
    let saturnring = cRing(16,32, 64,"./assets/textures/saturn_ring.png");
    saturnring.position.copy(saturn.position.clone());
    saturnring.rotation.x = Math.PI/180 * -90;
    saturnring.rotation.y = Math.PI/180 * 10;
    
    let uranus = cBall(8,32,32,"./assets/textures/uranus.jpg");
    uranus.position.set(280,320,0);
    let uranusring = cRing(16,20,64,"./assets/textures/uranus_ring.png");
    uranusring.position.copy(uranus.position.clone());
    uranusring.rotation.y = Math.PI/180 * 5;

    let neptune = cBall(6,32,32,"./assets/textures/neptune.jpg");
    neptune.position.set(320,320,0);

    let planetObj = [
      mercury, 
      venus,
      earth,
      satellite,
      mars,
      jupiter,
      saturn,
      saturnring,
      uranus,
      uranusring,
      neptune
    ];
    planetObj.forEach(obj =>{
      scene.add(obj)
    })


    
    //Spaceship


    //Skybox
    const skyboxTextures = [
      'assets/skybox/front.png',  // Front
      'assets/skybox/back.png',   // Back
      'assets/skybox/left.png',   // Left
      'assets/skybox/right.png',  // Right
      'assets/skybox/top.png',    // Top
      'assets/skybox/bottom.png'  // Bottom
    ];
    createSkybox(scene, skyboxTextures);

}


const createSkybox = (scene, texturePaths, size = 4260) => {
  const materials = texturePaths.map(path => 
    new THREE.MeshBasicMaterial({ 
      map: new THREE.TextureLoader().load(path), 
      side: THREE.BackSide 
    })
  );

  const skyboxGeometry = new THREE.BoxGeometry(size, size, size);
  const skybox = new THREE.Mesh(skyboxGeometry, materials);
  scene.add(skybox);
};



const cBall = (r, wSeg, hSeg, textureURL = "none") => {
  let geo = new THREE.SphereGeometry(r, wSeg, hSeg);
  let mat;
  if(textureURL !== "none"){
      let loader = new THREE.TextureLoader();
      let texture = loader.load(textureURL);
      mat = new THREE.MeshStandardMaterial({ map: texture });
  } else {
      mat = new THREE.MeshStandardMaterial({ color: "#FFFFFF" });
  }

  let obj = new THREE.Mesh(geo, mat);
  obj.castShadow = true;
  obj.receiveShadow = false;
  return obj;
}

const cSun = (r, wSeg, hSeg, textureURL) => {
  let geo = new THREE.SphereGeometry(r, wSeg, hSeg);
  let mat;
  if(textureURL !== "none"){
      let loader = new THREE.TextureLoader();
      let texture = loader.load(textureURL);
      mat = new THREE.MeshBasicMaterial({ map: texture });
  } else {
      mat = new THREE.MeshBasicMaterial({ color: "#FFFFFF" });
  }
  
  let obj = new THREE.Mesh(geo, mat);
  obj.castShadow = false;
  obj.receiveShadow = false;

  return obj;
}


const cRing = (inRad, outRad, tSeg, textureURL, opacity = 0.9) => {
  let geo = new THREE.RingGeometry(inRad, outRad, tSeg);
  let mat;

  if (textureURL !== "none") {
    let loader = new THREE.TextureLoader();
    let texture = loader.load(textureURL);
    mat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true, // Enable transparency
      opacity: opacity,  // Set opacity value
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      side: THREE.DoubleSide,
      transparent: true, // Enable transparency
      opacity: opacity,  // Set opacity value
    });
  }

  let obj = new THREE.Mesh(geo, mat);
  obj.castShadow = false;
  obj.receiveShadow = false;

  return obj;
};


const cSatelite = (radtop, radbot,h,radseg) =>{
  let geo = new THREE.CylinderGeometry(radtop, radbot,h,radseg);
  let  mat = new THREE.MeshStandardMaterial({
    color: "#CCCCCC",
    metalness: 0.5, 
    roughness: 0.5, 
  })
  
  let obj = new THREE.Mesh(geo,mat);
  obj.castShadow = false
  obj.receiveShadow = true;

  return obj;
  
}



const createPointLight = (color, intensity, distance) => {
  let light = new THREE.PointLight(color, intensity, distance);
  light.castShadow = true;
  return light;
}


const createSpotLight = (color, intensity) => {
  let light = new THREE.SpotLight(color, intensity);
  light.castShadow = false;
  return light;
}

const loadCSpaceship = () => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load("scene.gltf", (gltf) => {
      let cars = gltf.scene;
      cars.scale.set(0.01, 0.01, 0.01);
      cars.rotation.y = (Math.PI / 180) * 90;
      resolve(cars);
    });
  });
};