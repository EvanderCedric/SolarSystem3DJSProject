import * as THREE from "./three.js-master145/build/three.module.js";
import { OrbitControls } from "./three.js-master145/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three.js-master145/examples/jsm/loaders/GLTFLoader.js"
import { TextGeometry } from "./three.js-master145/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "./three.js-master145/examples/jsm/loaders/FontLoader.js";



let camera, SpaceshipCamera, scene, renderer, controls, spaceship, currentCamera;
let hoverEffects = new Map();
let lastIntersected = null;
let animationClock = new THREE.Clock();


  let render = () => {
    renderer.shadowMap.enabled = true;
  
    requestAnimationFrame(render);
    moveSpaceship();
    cameraFollowShip();
    raycastAnim();
    animateOrbits();
    //lightFollowShip();

    renderer.render(scene, currentCamera);
    controls.update();
  };
  
  window.onload = () => {
    init();
    createObjects();
    render();
  };
  
  window.onresize = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;
    renderer.setSize(w, h);
  
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  
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
    camera.position.set(640, 320, 240);
    camera.lookAt(0,320, 0);
  
    //Spaceship Camera
    let Spaceshipfov = 90;
    SpaceshipCamera = new THREE.PerspectiveCamera(Spaceshipfov, aspect, near, far);
    // SpaceshipCamera.position.copy(spaceship.position.clone());
  
    currentCamera = camera;
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor("#7e7e7e");
    document.body.appendChild(renderer.domElement);
  
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  
    //Controls
    controls = new OrbitControls(camera, renderer.domElement);
    addHandling();
  
  };
  
//Grouping
  let solarSystem = new THREE.Object3D();
  let sunGroup = new THREE.Object3D();
  let mercuryGroup = new THREE.Object3D();
  let venusGroup = new THREE.Object3D();
  let earthGroup = new THREE.Object3D();
  let marsGroup = new THREE.Object3D();
  let jupiterGroup = new THREE.Object3D();
  let  saturnGroup = new THREE.Object3D();
  let uranusGroup = new THREE.Object3D();
  let neptuneGroup = new THREE.Object3D();
  let spaceshipGroup = new THREE.Object3D();

const createObjects = async () => {
    // Sun
    let sun = cSun(40, 32, 32, "./assets/textures/sun.jpg");
    sun.position.set(0, 0, 0);

    // Sunlight
    let sunlight = createPointLight({ color: "#FFFFFF" }, 200000, 1280);
    sunlight.position.copy(sun.position.clone());
    sunlight.castShadow = true;
    scene.add(sunlight);

    // Planets
    let mercury = cBall(3.2, 32, 32, "./assets/textures/mercury.jpg");
    let venus = cBall(4.8, 32, 32, "./assets/textures/venus.jpg");
    let earth = cBall(4.8, 32, 32, "./assets/textures/earth.jpg");
    let satellite = cSatelite(1, 0.5, 0.4, 8);
    let mars = cBall(4, 32, 32, "./assets/textures/mars.jpg");
    let jupiter = cBall(13, 32, 32, "./assets/textures/jupiter.jpg");
    let saturn = cBall(10, 32, 32, "./assets/textures/saturn.jpg");
    let saturnring = cRing(16, 32, 64, "./assets/textures/saturn_ring.png");
    let uranus = cBall(8, 32, 32, "./assets/textures/uranus.jpg");
    let uranusring = cRing(16, 20, 64, "./assets/textures/uranus_ring.png");
    let neptune = cBall(6, 32, 32, "./assets/textures/neptune.jpg");


    //planet position and rotation adjustment
    mercury.position.set(150, 0, 0);
    venus.position.set(200, 0, 0);
    earth.position.set(250, 0, 0);
    satellite.position.copy(earth.position.clone().add(new THREE.Vector3(8, 0, 0)));
    satellite.rotation.x = Math.PI / 180 * -90;
    satellite.rotation.z = Math.PI / 180 * 90;
    mars.position.set(300, 0, 0);
    jupiter.position.set(450, 0, 0);
    saturn.position.set(600, 0, 0);
    saturnring.position.copy(saturn.position.clone());
    saturnring.rotation.x = Math.PI / 180 * -90;
    saturnring.rotation.y = Math.PI / 180 * -10;
    uranus.position.set(750, 0, 0);
    uranusring.position.copy(uranus.position.clone());
    uranusring.rotation.y = Math.PI / 180 * 5;
    neptune.position.set(900, 0, 0);


    // Grouping
    sunGroup.add(sun,sunlight);
    mercuryGroup.add(mercury);
    venusGroup.add(venus);
    earthGroup.add(earth,satellite);
    marsGroup.add(mars);
    jupiterGroup.add(jupiter);
    saturnGroup.add(saturn, saturnring);
    uranusGroup.add(uranus, uranusring);
    neptuneGroup.add(neptune);

    sunGroup.position.set(0,0,0);
    mercuryGroup.position.set(0,0,0);
    venusGroup.position.set(0,0,0);
    earthGroup.position.set(0,0,0);
    marsGroup.position.set(0,0,0);
    jupiterGroup.position.set(0,0,0);
    saturnGroup.position.set(0,0,0);
    uranusGroup.position.set(0,0,0);
    neptuneGroup.position.set(0,0,0);

    solarSystem.add(
      sunGroup,
      mercuryGroup,
      venusGroup,
      earthGroup,
      marsGroup,
      jupiterGroup,
      saturnGroup,
      uranusGroup,
      neptuneGroup,
    )
     scene.add(solarSystem);

    // Adding objects for hover effects
    if(currentCamera != SpaceshipCamera){
      let refObj = [
        solarSystem, 
        sunGroup,
        mercuryGroup,   
        venusGroup,     
        earthGroup,     
        marsGroup,      
        jupiterGroup,  
        saturnGroup,    
        uranusGroup,    
        neptuneGroup    
    ];
      refObj.forEach(group => {
        group.children.forEach(obj => {
            if (obj.material) { 
                obj.defaultColor = obj.material.color.clone();
            }
            hoverEffects.set(obj, { rotating: false, fastRotation: false, scale: 1 });
            
        });
    });
  
    }

  

    // Skybox
    const skyboxTextures = [
        'assets/skybox/front.png',
        'assets/skybox/back.png',
        'assets/skybox/left.png',
        'assets/skybox/right.png',
        'assets/skybox/top.png',
        'assets/skybox/bottom.png'
    ];
   cSkybox(scene, skyboxTextures);

// Spaceship
spaceship = await loadSpaceship();
spaceship.position.set(0, 0, 0);

// Spaceship Headlights
let spaceshiplight = createSpotLight({ color: "#FFFFFF" }, 8, 3);
spaceshiplight.position.copy(spaceship.position.clone().add(new THREE.Vector3(0, 2, 0))); // 3 units above the spaceship
spaceshiplight.castShadow = true;

// Spotlight Target
const lightTarget = new THREE.Object3D();
lightTarget.position.copy(spaceship.position); // Target the spaceship
scene.add(lightTarget);
spaceshiplight.target = lightTarget; // Assign the target to the spotlight

// Spaceship Group
spaceshipGroup.add(spaceship, spaceshiplight, lightTarget);
spaceshipGroup.position.set(100, 0, 0);
scene.add(spaceshipGroup);

};

// Animation
const animateOrbits = () => {
  const delta = animationClock.getDelta();
  let deltaspeed = Math.PI/180;

 // Orbital Speeds 
mercuryGroup.rotation.y += deltaspeed * (1 / 0.24) * 0.05;
venusGroup.rotation.y += deltaspeed * (1 / 0.62) * 0.05;
earthGroup.rotation.y += deltaspeed * (1 / 1.00) * 0.05;
marsGroup.rotation.y += deltaspeed * (1 / 1.88) * 0.05;
jupiterGroup.rotation.y += deltaspeed * (1 / 11.86) * 0.05;
saturnGroup.rotation.y += deltaspeed * (1 / 29.46) * 0.05;
uranusGroup.rotation.y += deltaspeed * (1 / 84.02) * 0.05;
neptuneGroup.rotation.y += deltaspeed * (1 / 164.79) * 0.05;

// Rotation Speeds
if (sunGroup.children[0]) sunGroup.children[0].rotation.y += deltaspeed * (24 / 588);
if (mercuryGroup.children[0]) mercuryGroup.children[0].rotation.y += deltaspeed * (24 / 1407.6) * 0.2;
if (venusGroup.children[0]) venusGroup.children[0].rotation.y += deltaspeed * -(24 / 5832.5) * 0.2;
if (earthGroup.children[0]) earthGroup.children[0].rotation.y += deltaspeed * (24 / 24) * 0.2;
if (earthGroup.children[1]) earthGroup.children[1].rotation.z += deltaspeed * (24 / 24) * 0.2;
if (marsGroup.children[0]) marsGroup.children[0].rotation.y += deltaspeed * (24 / 24.6) * 0.2;
if (jupiterGroup.children[0]) jupiterGroup.children[0].rotation.y += deltaspeed * (24 / 9.9) * 0.2;
if (saturnGroup.children[0]) saturnGroup.children[0].rotation.y += deltaspeed * (24 / 10.7) * 0.2;
if (uranusGroup.children[0]) uranusGroup.children[0].rotation.y += deltaspeed * -(24 / 17.2) * 0.2;
if (neptuneGroup.children[0]) neptuneGroup.children[0].rotation.y += deltaspeed * (24 / 16.1) * 0.2;



};


//
// CREATE OBJECTS
//


const cSkybox = (scene, texturePaths, size = 4260) => {
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
  obj.isIgnoredByRaycasting = true;

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
  obj.isIgnoredByRaycasting = true;
  return obj;
  
}

const createPointLight = (color, intensity, distance) => {
  let light = new THREE.PointLight(color, intensity, distance);
  light.castShadow = true;
  return light;
}

const createSpotLight = (color, intensity, distance) => {
  let light = new THREE.SpotLight(color, intensity,distance);
  light.castShadow = false;
  return light;
}

const loadSpaceship = () => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load("./assets/model/spaceship/scene.gltf", (gltf) => {
      let model = gltf.scene;
      model.scale.set(0.01, 0.01, 0.01);
      model.rotation.y = (Math.PI / 180) * 0;
      scene.add(model);
      resolve(model);
    });
  });
};


//
// SPACESHIP MOVEMENT FUNCTION
//

let addHandling = () => {
    document.addEventListener("keydown", keyDownEvent);
    document.addEventListener("keyup", keyUpEvent);
};

let 
  spaceshipVelocity = 0, 
  spaceshipMaxSpeed = 1, 
  rotateSpeed = 0.04, 
  isRotating = 0, 
  isMoving = 0,
  isHovering = 0,
  accel = 0.01, 
  hoverSpeed = 0.05; 

let keyDownEvent = (e) => {
    let keyCode = e.keyCode;
    if (keyCode == 87) { 
        isMoving = 1; 
        console.log("w");
    } else if (keyCode == 83) { 
        isMoving = -1; 
        console.log("s");
    } else if (keyCode == 65) { 
        isRotating = 1; 
        console.log("a");
    } else if (keyCode == 68) { 
        isRotating = -1;
        console.log("d");
    } else if (keyCode == 81) { 
        isHovering = -1; // Descend
        console.log("q");
    } else if (keyCode == 69) { 
        isHovering = 1; // Ascend
        console.log("e");
    } else if (keyCode == 82) { 
        console.log("r");
        if (currentCamera === camera) {
            currentCamera = SpaceshipCamera;
        } else if (currentCamera === SpaceshipCamera) {
            currentCamera = camera;
            camera.position.set(640, 320, 240);
            camera.lookAt(0,320, 0);
            
        }
    }
};

let keyUpEvent = (e) => {
    let keyCode = e.keyCode;
    if (keyCode == 87 || keyCode == 83) { isMoving = 0; } 
    else if (keyCode == 65 || keyCode == 68) { isRotating = 0; } 
    else if (keyCode == 81 || keyCode == 69) { isHovering = 0; } 
};

let moveSpaceship = () => {
  // Rotation
  if (isRotating !== 0) {
    spaceshipGroup.rotation.y += rotateSpeed * isRotating;
  }

  // Moving
  if (isMoving === 1) {
    spaceshipVelocity += accel;
  } else if (isMoving === -1) {
    spaceshipVelocity -= accel;
  } else {
    spaceshipVelocity = 0;
  }

  spaceshipVelocity = Math.max(-spaceshipMaxSpeed, Math.min(spaceshipMaxSpeed, spaceshipVelocity));

  // Ascend/Descend
  if (isHovering !== 0) {
    spaceshipGroup.position.y += hoverSpeed * isHovering;
  }

  // Apply forward/backward movement
  if (spaceshipVelocity !== 0) {
    spaceshipGroup.position.x += Math.sin(spaceshipGroup.rotation.y) * spaceshipVelocity;
    spaceshipGroup.position.z += Math.cos(spaceshipGroup.rotation.y) * spaceshipVelocity;
  }
};

let cameraFollowShip = () => {
  if (spaceshipGroup) {
    const offset = new THREE.Vector3(0, 0.08, -0.2);
    const rotatedOffset = offset.clone().applyQuaternion(spaceshipGroup.quaternion);
    const spaceshipPos = spaceshipGroup.position.clone();
    const camPos = spaceshipPos.add(rotatedOffset);

    SpaceshipCamera.position.copy(camPos);
    SpaceshipCamera.lookAt(spaceshipGroup.position);
  }
};




//
// RAYCASTING FUNCTION
//
// RAYCASTING FUNCTION
let planetNames = {
  "Sun": null,
  "Mercury": null,
  "Venus": null,
  "Earth": null,
  "Mars": null,
  "Jupiter": null,
  "Saturn": null,
  "Uranus": null,
  "Neptune": null
};

window.onmousemove = (event) => {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (!camera || !camera.isPerspectiveCamera) {
    console.error("Camera is not properly initialized or is not a perspective camera.");
    return;
  }


  raycaster.setFromCamera(mouse, camera);

  if (camera !== SpaceshipCamera) {
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;

      // Ignore objects flagged as isIgnoredByRaycasting
      if (hoveredObject.isIgnoredByRaycasting) return;

      if (hoveredObject !== lastIntersected) {
        if (lastIntersected) {
          resetHoverState(lastIntersected);
          hideTextGeometry(lastIntersected);
        }

        if (hoverEffects.has(hoveredObject)) {
          applyHoverEffects(hoveredObject);
          lastIntersected = hoveredObject;
          const planetName = hoveredObject.name;

          if (!planetNames[planetName]) {
            const worldPosition = new THREE.Vector3();
            hoveredObject.getWorldPosition(worldPosition);
            createTextGeometry(planetName, worldPosition);
          }
        } else {
          lastIntersected = null;
        }
      }
    } else {
      if (lastIntersected) {
        resetHoverState(lastIntersected);
        hideTextGeometry(lastIntersected);
        lastIntersected = null;
      }
    }
  }
};

const createTextGeometry = (name, position) => {
  const loader = new FontLoader();
  loader.load('./three.js-master145/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(name, {
      font: font,
      size: 50, 
      height: 20, 
      depth: 20
    });
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const textMesh = new THREE.Mesh(textGeometry, material);

    // Position text above the object
    textMesh.position.set(position.x, position.y + 10, position.z);

    scene.add(textMesh);
    planetNames[name] = textMesh;

    // Move the camera closer and make it look at the text
    //focusCameraOnText(textMesh.position);
  });
};

//DEBUG TEXT RAYCAST
// Function to focus the camera on the text
// const focusCameraOnText = (textPosition) => {
//   const distance = 20; // Adjust distance for how close the camera gets
//   const direction = new THREE.Vector3().subVectors(camera.position, textPosition).normalize();
//   const focusPosition = new THREE.Vector3(
//     textPosition.x - direction.x * distance,
//     textPosition.y - direction.y * distance,
//     textPosition.z - direction.z * distance
//   );

//   camera.position.set(focusPosition.x, focusPosition.y, focusPosition.z);
//   camera.lookAt(textPosition);
// };



// Menyembunyikan teks saat raycasting hilang
const hideTextGeometry = (object) => {
  const planetName = object.name;
  if (planetNames[planetName]) {
    scene.remove(planetNames[planetName]);
    delete planetNames[planetName];
  }
};


const colorList = [
  "#00FFFF", "#00FF00", "#FFCC00", "#E6E6FA", "#FF69B4",
  "#FF8C00", "#FFB6C1", "#00FFFF", "#87CEEB", "#A8FFB2",
  "#EE82EE", "#ADD8E6"
];
const getRandomColor = () => colorList[Math.floor(Math.random() * colorList.length)];
const applyHoverEffects = (object) => {
  const effect = hoverEffects.get(object);
  if (effect) {
    object.material.color.set(getRandomColor());
    effect.rotating = true; 
  }
};

const resetHoverState = (object) => {
  const effect = hoverEffects.get(object);
  if (effect) {
    object.material.color.copy(object.defaultColor);
    effect.rotating = false;
  }
};

let raycastAnim = () => {
  const delta = animationClock.getDelta();
  hoverEffects.forEach((params, mesh) => {
    if (params.fastRotation) {
      mesh.rotation.y += delta * Math.PI/180 * 10;
    } else if (params.rotating) {
      mesh.rotation.y += delta * Math.PI;
    }
  });
};



  
