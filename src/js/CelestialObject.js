class CelestialObject extends THREE.Group {

  // STATIC VARIABLES FOR FAST CONFIGURATION
  static RING_INNER_OFFSET = 0.1;
  static RING_OUTER_OFFSET = 1;
  static ORBIT_WIDTH = 0.05;

  // MAIN CLASS CONSTRUCTOR
  // RADIUS - DEFINES THE SIZE OF THE SPHERE
  // SPIN PERIOD - TIME OF SPINS
  // ORBITAL PERIOD - TIME OF ORBIT TRAVERSALS
  // TEXTURE PATH - PATH TO THE TEXTURE, NORMAL MAP, ETC
  // HAS RINGS - BOOLEAN TO DEFINE RINGS
  // HAS LIGHT - BOOLEAN TO DEFINE LIGHT
  constructor(radius, spinPeriod, orbitalPeriod, orbitalRadius, texturePaths, hasRings = false, hasLight = false) {
    super();

    // CATCH PARAMETERS AND APPEND TO CLASS DTA
    this.radius = radius;
    this.spinPeriod = spinPeriod;
    this.orbitalPeriod = orbitalPeriod;
    this.orbitalRadius = orbitalRadius;
    this.texturePaths = texturePaths;
    this.hasRings = hasRings;
    this.hasLight = hasLight;

    // CALL GENERATORS AND BUILD MESHES AND OBJECTS
    this.createMaterial();
    this.createGeometry();
    this.createObject();
    this.createAndAddRings();

    // ADD THE OBJECT
    this.add(this.astro);
    // CREATE GROUP
    this.orbitersGroup = new THREE.Group();
    // ADD THE OBJECT TO THE GROUP
    this.add(this.orbitersGroup);
  }

  // GENERATE THE MATERIAL
  createMaterial() {

    // LOAD THE TEXTURE FROM SOURCE FILE
    const map = new THREE.TextureLoader().load(this.texturePaths.map);
    const bumpMap = new THREE.TextureLoader().load(this.texturePaths.bump);
    // CHECK IF OBJECT MUST HAVE LIGHT
    if (this.hasLight) {
      // CALL BASIC MESH SO IT DOESN'T REFLECT LIGHT
      this.material = new THREE.MeshBasicMaterial({map: map});
    }
    else {
      // ELSE, CALL PHONG MATERIAL SO IT REFLECTS LIGHT
      this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: map, bumpMap: bumpMap, side: THREE.DoubleSide });
    }
  }

  // CREATE THE GEOMETRY
  createGeometry() {
    // USING SPHERE GEOMETRY
    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
  }

  // BUILD THE OBJECT
  createObject() {
    // CREATE A NEW MESH WITH GEOMETRY AND MATERIAL
    this.astro = new THREE.Mesh(this.geometry, this.material);
    // console.log(this.hasLight);
    if (this.hasLight) {
      // IF IT HAS LIGHT, PRODUCE A POINTLIGHT WITH WHITE COLOR
      this.light = new THREE.PointLight(0xffffff, 1, 0);
      // ADD THE LIGHT TO THE OBJECT
      this.astro.add(this.light);
    }
  }

  // BUILD THE RINGS AND ADD THEM
  createAndAddRings() {
    // FLAG TO CHECK IF IT HAS RINGS
    if (this.hasRings) {
      // THE INNER RING
      const inner = this.radius + CelestialObject.RING_INNER_OFFSET;
      // THE OUTER RING
      const outer = this.radius + CelestialObject.RING_OUTER_OFFSET;
      // CREATE A RING GEOMETRY
      const geometry = new THREE.RingGeometry(inner, outer, 32);
      // CREATE A PHONG MATERIAL
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      // CREATE THE MESH WITH GEOMETRY AND MATERIAL
      const ring = new THREE.Mesh(geometry, material);
      // ROTATION IS DEFINED BY RADIANS, SPECIFIED BY DEGREES
      ring.rotateX(this.º2r(70));
      // ADD THE RING TO THE OBJECT
      this.astro.add(ring);
    }
  }

  // BUILD THE ORBIT UPON WHICH PATH WILL BE TRACED
  createOrbitObject(astro) {
    // CREATE THE GEOMETRY
    const geometry = new THREE.RingGeometry(astro.orbitalRadius - CelestialObject.ORBIT_WIDTH / 2, astro.orbitalRadius + CelestialObject.ORBIT_WIDTH / 2, 32);
    // CREATE THE MATERIAL
    console.log("HOLA")
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffd4, side: THREE.DoubleSide });
    // CREATE THE MESH WITH GEOMETRY AND MATERIAL
    const ring = new THREE.Mesh(geometry, material);
    // ROTATION IS DEFINED BY RADIANS, SPECIFIED BY DEGREES
    ring.rotateX(this.º2r(90));
    // ADD THE RING TO THE OBJECT
    this.add(ring);
  }

  // ADD ORBITER CHILD
  appendSatellite(astro) {
    // CREATES THE ORBIT OBJECT
    this.createOrbitObject(astro);
    // CREATES A GROUP
    const group = new THREE.Group();
    // ADDS THE ORBITER TO THE GROUP
    group.add(astro);
    // SETS THE POSITION AS ORBITER
    astro.position.set(astro.orbitalRadius || 0, 0, 0);
    // ADD THE GROUP TO THE ORBITERS GROUP
    this.orbitersGroup.add(group);
  }

  r2º(radians) {
    return radians / Math.PI * 180;
  }

  º2r(degrees) {
    return degrees / this.r2º(1);
  }

  // ANIMATION LOOP
  animationLoop(_, timeDifference) {
    // IF THE SPIN PERIOD IS NOT NULL
    if (this.spinPeriod != 0) {
      // ROTATE Y
      this.astro.rotateY(timeDifference / 1000 / this.spinPeriod * 2 * Math.PI);
    }
    // FOR EACH ORBITER'S CHILDREN
    for (let orbiter of this.orbitersGroup.children) {
      // IF THE ORBITER HAS ORBITAL PERIOD
      if (orbiter.children[0].orbitalPeriod) {
        // ROTATE Y
        orbiter.rotateY(timeDifference / 1000 / orbiter.children[0].orbitalPeriod * 2 * Math.PI);
      }
      // PASS ARGUMENTS KEYWORD TO VARIADIC FUNCTION
      orbiter.children[0].animationLoop(...arguments);
    }
  }
}
