import * as THREE from "./three.js-master145/build/three.module.js";
import { OrbitControls } from "./three.js-master145/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "./three.js-master145/examples/jsm/loaders/GLTFLoader.js"
import { TextGeometry } from "./three.js-master145/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "./three.js-master145/examples/jsm/loaders/FontLoader.js";



let camera, SpaceshipCamera, scene, renderer, controls, spaceship, currentCamera;

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
  


const createObjects = async() =>{

    //Sun
    let sun = cSun(40,32,32,"./assets/textures/sun.jpg");
    sun.position.set(0, 0, 0);
    scene.add(sun);
    
    //Sunlight
    let PointLight = createPointLight({color:"#FFFFFF"}, 200000, 1280); 
    PointLight.position.copy(sun.position.clone());
    PointLight.castShadow = true;
    scene.add(PointLight);
    //Planet
    let mercury = cBall(3.2,32,32,"./assets/textures/mercury.jpg");
    mercury.position.set(150,0,0);

    let venus = cBall(4.8,32,32,"./assets/textures/venus.jpg");
    venus.position.set(200,0,0);

    let earth = cBall(4.8,32,32,"./assets/textures/earth.jpg");
    earth.position.set(250,0,0);

    let satellite = cSatelite(1, 0.5, 0.4, 8); 
    satellite.position.copy(earth.position.clone().add(new THREE.Vector3(8, 0, 0))); 
    satellite.rotation.x = Math.PI/180 * -90;
    satellite.rotation.z = Math.PI/180 * 90;

    let mars = cBall(4,32,32,"./assets/textures/mars.jpg");
    mars.position.set(300,0,0);

    let jupiter = cBall(13,32,32,"./assets/textures/jupiter.jpg");
    jupiter.position.set(350,0,0);

    let saturn = cBall(10,32,32,"./assets/textures/saturn.jpg");
    saturn.position.set(400,0,0);
    let saturnring = cRing(16,32, 64,"./assets/textures/saturn_ring.png");
    saturnring.position.copy(saturn.position.clone());
    saturnring.rotation.x = Math.PI/180 * -90;
    saturnring.rotation.y = Math.PI/180 * -10;
    
    let uranus = cBall(8,32,32,"./assets/textures/uranus.jpg");
    uranus.position.set(450,0,0);
    let uranusring = cRing(16,20,64,"./assets/textures/uranus_ring.png");
    uranusring.position.copy(uranus.position.clone());
    uranusring.rotation.y = Math.PI/180 * 5;

    let neptune = cBall(6,32,32,"./assets/textures/neptune.jpg");
    neptune.position.set(500,0,0);

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
  
  

  // Skybox
    const skyboxTextures = [
      'assets/skybox/front.png',
      'assets/skybox/back.png',   
      'assets/skybox/left.png',   
      'assets/skybox/right.png', 
      'assets/skybox/top.png',    
      'assets/skybox/bottom.png'  
    ];
    createSkybox(scene, skyboxTextures);  
  
    //Spaceship
    spaceship = await loadSpaceship();
    spaceship.position.set(100,0,0);
    scene.add(spaceship);
    //SpaceshipHeadlights
    let spaceshiplight = createSpotLight({color:"#FFFFFF"}, 8, 8)
    spaceshiplight.position.copy(spaceship.position.clone());
    spaceshiplight.castShadow = true;
    scene.add(spaceshiplight);


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


const createSpotLight = (color, intensity, distance) => {
  let light = new THREE.SpotLight(color, intensity,distance);
  light.castShadow = false;
  return light;
}

const loadSpaceship = () => {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load("./assets/model/spaceship/scene.gltf", (gltf) => {
      let spaceship = gltf.scene;
      spaceship.scale.set(0.01, 0.01, 0.01);
      spaceship.rotation.y = (Math.PI / 180) * 0;
      scene.add(spaceship);
      resolve(spaceship);
    });
  });
};


let addHandling = () => {
    document.addEventListener("keydown", keyDownEvent);
    document.addEventListener("keyup", keyUpEvent);
};

let 
  spaceshipVelocity = 0, 
  spaceshipMaxSpeed = 1, 
  rotateSpeed = 0.01, 
  isRotating = 0, 
  isMoving = 0,
  isHovering = 0,
  accel = 0.001, 
  hoverSpeed = 0.05; // Speed for vertical movement

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
      spaceship.rotation.y += rotateSpeed * isRotating;
  }
//Moving
  if (isMoving === 1) { 
      spaceshipVelocity += accel;
  } else if (isMoving === -1) { 
      spaceshipVelocity -= accel;
  } else {
      spaceshipVelocity = 0;
  }

  spaceshipVelocity = Math.max(-spaceshipMaxSpeed, Math.min(spaceshipMaxSpeed, spaceshipVelocity));
//ascend/decent
  if (isHovering !== 0) {
      spaceship.position.y += hoverSpeed * isHovering;
  }
  if (spaceshipVelocity !== 0) {
      spaceship.position.x += Math.sin(spaceship.rotation.y) * spaceshipVelocity;
      spaceship.position.z += Math.cos(spaceship.rotation.y) * spaceshipVelocity;
  }
};



let cameraFollowShip = () =>{
  if(spaceship){
    const offset = new THREE.Vector3(0,0.1,-0.2);
    const rotatedOffset = offset.clone().applyQuaternion(spaceship.quaternion);
    const spaceshipPos = spaceship.position.clone();
    const camPos = spaceshipPos.add(rotatedOffset);
    SpaceshipCamera.position.copy(camPos);
    SpaceshipCamera.lookAt(spaceship.position);
  }
}



const colorList = [
  "#00FFFF", "#00FF00", "#FFCC00", "#E6E6FA", "#FF69B4",
  "#FF8C00", "#FFB6C1", "#00FFFF", "#87CEEB", "#A8FFB2",
  "#EE82EE", "#ADD8E6"
];

// Hovered object name display
let infoDiv = document.createElement("div");
infoDiv.style.position = "absolute";
infoDiv.style.top = "10px";
infoDiv.style.left = "10px";
infoDiv.style.color = "#fff";
infoDiv.style.padding = "10px";
infoDiv.style.backgroundColor = "rgba(0,0,0,0.5)";
infoDiv.style.display = "none";
document.body.appendChild(infoDiv);

// Handle mouse hover and click effects
window.onmousemove = (event) => {
  const mouse = new THREE.Vector2();

  // Convert mouse coordinates to normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Get intersected objects
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;

      // If the hovered object changes
      if (hoveredObject !== lastIntersected) {
          // Reset the last intersected object
          if (lastIntersected) {
              lastIntersected.material.color.set(0xffffff);
              infoDiv.style.display = "none";
          }

          // Update new hovered object
          hoveredObject.material.color.set(colorList[Math.floor(Math.random() * colorList.length)]);
          infoDiv.innerText = `Hovered: ${hoveredObject.name || "Unnamed Object"}`;
          infoDiv.style.display = "block";

          hoverEffects.get(hoveredObject).rotating = true;
          lastIntersected = hoveredObject;
      }
  } else {
      // Reset when no object is hovered
      if (lastIntersected) {
          hoverEffects.get(lastIntersected).rotating = false;
          lastIntersected.material.color.set(0xffffff);
          lastIntersected = null;
          infoDiv.style.display = "none";
      }
  }
};

// Handle click interaction
window.onclick = () => {
  if (lastIntersected) {
      const effect = hoverEffects.get(lastIntersected);
      effect.rotating = true; // Ensure the object rotates
      effect.fastRotation = true;

      // Set a timer to slow down the rotation after 2 seconds
      setTimeout(() => {
          effect.fastRotation = false;
      }, 2000);
  }
};

// Update animations for hover and click
let animationrunner = () => {
  const delta = animationClock.getDelta();

  hoverEffects.forEach((params, mesh) => {
      if (params.fastRotation) {
          mesh.rotation.x += delta * Math.PI * 2; // Faster rotation
          mesh.rotation.y += delta * Math.PI * 2;
      } else if (params.rotating) {
          mesh.rotation.x += delta * Math.PI;
          mesh.rotation.y += delta * Math.PI;

          params.scale += delta * 2;
          if (params.scale > 1.5) {
              params.scale = 1.5;
          }
      } else {
          params.scale -= delta * 2;
          if (params.scale < 1) {
              params.scale = 1;
          }
      }

      mesh.scale.set(params.scale, params.scale, params.scale);
  });
};


  
  let render = () => {
    renderer.shadowMap.enabled = true;
  
    requestAnimationFrame(render);
    moveSpaceship();
    cameraFollowShip();

    renderer.render(scene, currentCamera);
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
  