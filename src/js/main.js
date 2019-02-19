// GLOBAL CONFIGURATION VARIABLES
let renderer = undefined;
let scene = undefined;
let camera = undefined;
let scaler = 2;

// GLOBAL HELPER VARIABLES
let absoluteAccumulatedTime = 0;

// JQUERY MAIN FUNCTION
$(function () {

  // ARGUMENT DECONSTRUCTION
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  // SETTING UP THE CAMERA
  camera = new THREE.PerspectiveCamera(17, ratio, 0.1, 1000);
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  // SETTING UP THE CONTROLS
  const controls = new THREE.OrbitControls( camera );
  controls.update();

  // SETTING UP THE RENDERER AND VIEWPORT
  renderer = new THREE.WebGLRenderer();
  updateViewport();
  $("#canvas-container").append(renderer.domElement);

  // CREATE SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.TextureLoader().load("src/textures/astronomy.jpg");

  // TO DO MAIN CODE BLOCK THAT DESCRIBES THE SOLAR SYSTEM
  sun = new CelestialObject(5, 10, 0, 0, {map: "src/textures/sunmap.jpg"}, false, true);

  // CREATE ASTEROID BELT
  const asteroids = []
  // SET TO 1500 IN YOUR COMPUTER CAUSE I CAN'T BECAUSE OF KERNEL PANICS
  for(let i = 0; i < 150; i++){
  //  const asteroid = new CelestialObject(Math.random(), Math.random(), Math.random()*2, 9, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"})
    const asteroid = new CelestialObject(Math.random()*.2, Math.random() + 8, Math.random() + 8, 40, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"})
    asteroids.push(asteroid);
  }
  for(let i = 0; i < asteroids.length; i++){
    sun.appendSatellite(asteroids[i]);
  }

  //const moon = new CelestialObject(0.5, 2, 5, 5, "src/textures/selena.jpg", true);
  //const a = new CelestialObject(0.3, 3, 2, 2, "src/textures/selena.jpg");
  //const b = new CelestialObject(0.1, -1, 1, 1, "src/textures/selena.jpg");

  //a.appendSatellite(b);
  //moon.appendSatellite(a);
  //sun.appendSatellite(moon);
  // radius, spinPeriod, orbitalPeriod, orbitalRadius, texturePath, hasRings = false, hasLight = false

  // MERCURY
  const mercury = new CelestialObject(0.052553917*scaler, 1, 6, 7, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  // VENUS
  const venus = new CelestialObject(0.130362667*scaler, 2, 7, 12, {map: "src/textures/venusmap.jpg"});

  // EARTH AND MOON
  const earth = new CelestialObject(0.137238598*scaler, 4, 8, 19, {map: "src/textures/earthmap1k.jpg", bump: "src/textures/earthbump1k.jpg"});
  const moon = new CelestialObject(0.037419113*scaler, 1, 	2.92, 3, {map: "src/textures/jupiter2_1k.jpg"});

  const mars = new CelestialObject(0.073013692*scaler, 3, 9.881, 32, {map: "src/textures/mars_1k_color.jpg"});

  // JUPITER
  const jupiter = new CelestialObject(1.505962587*scaler, 12, 	11.86, 55, {map: "src/textures/jupiter2_1k.jpg"});

  // JUPITER'S MOONS
  const ganyemede = new CelestialObject(0.056741515*scaler, 3, 4, 2, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const callisto = new CelestialObject(0.051920608*scaler, 4, 3, 4, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const io = new CelestialObject(0.039239339*scaler, 2, 3, 7, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const europa = new CelestialObject(0.03362141*scaler, 1, 4, 11, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});

  // SATURN
  const saturn = new CelestialObject(1.254383622*scaler, 9, 29.46, 78, {map: "src/textures/saturnmap.jpg"}, true);

  // SATURN'S MOONS
  const titan = new CelestialObject(0.055462618*scaler, 3, 4, 2, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const rhea = new CelestialObject(0.016453122*scaler, 4, 3, 5, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const iapetus = new CelestialObject(0.015821967*scaler, 4, 3, 7, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const dione = new CelestialObject(0.012093196*scaler, 4, 3, 9, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const tethys = new CelestialObject(0.011440499*scaler, 4, 3, 13, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});

  // URANUS
  const uranus = new CelestialObject(0.546326374*scaler, 8, 84.01, 99, {map: "src/textures/uranusmap.jpg"});

  // URANUS MOONS
  const titania = new CelestialObject(0.016983034*scaler, 3, 6, 3, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const oberon = new CelestialObject(0.016401423*scaler, 6, 2, 6, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const umbriel = new CelestialObject(0.012595104*scaler, 5, 1, 7, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});
  const ariel = new CelestialObject(0.012470166*scaler, 2, 5, 10, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});

  // NEPTUNE AND MOONS
  const neptune = new CelestialObject(0.530385931, 7, 	164.8, 120, {map: "src/textures/neptunemap.jpg"});
  const triton = new CelestialObject(0.029153778, 2, 2, 5, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"});

  // PLUTO AND MOONS
  const pluto = new CelestialObject(0.15597336, 3, 250, 150, {map: "src/textures/plutomap1k.jpg", bump: "src/textures/plutobump1k.jpg"})
  const charon = new CelestialObject(0.01305393, 1, 2, 3, {map: "src/textures/mercurymap.jpg", bump: "src/textures/mercurybump.jpg"}); // SHOULD BE TIDALLY LOCKED, BUT OK

  // ADD SONS TO SUN
  sun.appendSatellite(mercury);
  sun.appendSatellite(venus);
  sun.appendSatellite(earth);
  sun.appendSatellite(mars);
  sun.appendSatellite(jupiter);
  sun.appendSatellite(saturn);
  sun.appendSatellite(uranus);
  sun.appendSatellite(neptune);
  sun.appendSatellite(pluto);

  // ADD SONS TO JUPITER
  jupiter.appendSatellite(ganyemede);
  jupiter.appendSatellite(callisto);
  jupiter.appendSatellite(io);
  jupiter.appendSatellite(europa);

  // ADD SONS TO SATURN
  saturn.appendSatellite(titan);
  saturn.appendSatellite(rhea);
  saturn.appendSatellite(iapetus);
  saturn.appendSatellite(dione);
  saturn.appendSatellite(tethys);

  // ADD SONS TO URANUS
  uranus.appendSatellite(titania);
  uranus.appendSatellite(oberon);
  uranus.appendSatellite(umbriel);
  uranus.appendSatellite(ariel);

  // ADD SONS TO NEPTUNE
  neptune.appendSatellite(triton);

  // ADD SONS TO PLUTO
  // SHOULD BE TIDALLY LOCKED BUT OK
  pluto.appendSatellite(charon);


  // ADD SONS TO EARTH
  earth.appendSatellite(moon);
  scene.add(sun);

  renderer.setAnimationLoop(animationLoop);
});

// MAIN ANIMATION LOOP
function animationLoop(accumulatedTime) {
  // DELTA TIME TO COUNT TICS
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  // sun.position.set(sun.position.x + 0.1, 0, 0);
  // CALL SUN'S ANIMATION LOOP
  sun.animationLoop(absoluteAccumulatedTime, timeDifference);
  absoluteAccumulatedTime = accumulatedTime;
  // ADD THE SCENE AND CAMERA AND RENDER THEM
  renderer.render(scene, camera);
}

// GET WIDTH AND HEIGHT
function getWidthAndHeight() {
  const width = $(window).width();
  const height = $(window).height();
  return { width, height };
}

// UPDATE THE VIEWPORT
function updateViewport() {
  const { width, height } = getWidthAndHeight();

  // FOV WILL GET RID OF BOUNDARY LENSING
  const fov = Math.atan2(height, width) * 100;
  // UPDATE ASPECT RATIO AND UPDATE PROJECTION
  camera.aspect = width / height;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  // SET NEW SIZE
  renderer.setSize(width, height);
}

// RESIZING FUNCTION ON WINDOW
$(window).on(
  "resize",
  updateViewport
);
