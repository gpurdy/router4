// Note: The cubenado is a port of https://github.com/wpdildine/Cubenado
export class Cubenado {
  private _canvas: any;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.ArcRotateCamera;
  private _light: BABYLON.Light;
  private _SPS: BABYLON.SolidParticleSystem;
  private _shaderMaterial: BABYLON.ShaderMaterial;
  private _pointLight: BABYLON.PointLight;
  private _time: number = 0;
  private _gravity: number = 0;
  private _scale: number = 7;
  private _vortexSpeed: number = 3;

  public particleCount: number = 0;
  public speed: number = 0;

  constructor(canvasElement: any) {
    this._canvas = canvasElement; //document.getElementById(canvasElement);
    this._engine = new BABYLON.Engine(this._canvas, true);
  }

  animate(): void {
    this.speed = this.speed / 3 || 1;
    this._gravity = this.speed;
    this._vortexSpeed = this.speed;

    this.createScene();

    this._time = 0;
    this._engine.runRenderLoop(() => {
      var shaderMaterial = this._scene.getMaterialByName("shader") as BABYLON.ShaderMaterial;
      shaderMaterial.setFloat("time", this._time);
      this._time += 0.02;
      shaderMaterial.setVector3("cameraPosition", this._scene.activeCamera.position);
      this._scene.render();
    });
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(0, 0, -0), this._scene);
    this._camera.setPosition(new BABYLON.Vector3(0, 50, -300));

    this._camera.attachControl(this._canvas, true);
    let box = BABYLON.MeshBuilder.CreateBox("box", { width: 1, height: 1, depth: 1 }, this._scene); //{size: 2, segments: 1}
    box.position.y = 1;

    this._pointLight = new BABYLON.PointLight('light2', new BABYLON.Vector3(100, 1000, 1), this._scene);
    this._pointLight.diffuse = new BABYLON.Color3(1, 0, 0);
    this._pointLight.specular = new BABYLON.Color3(1, 1, 0);

    this._shaderMaterial = new BABYLON.ShaderMaterial("shader", this._scene, {
      vertex: "custom",
      fragment: "custom",
    } , {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
    });
    this._shaderMaterial.setColor3("rgb", new BABYLON.Color3(0.3, 0.3, 0.3));
    this._shaderMaterial.setFloat("time", 0);
    this._shaderMaterial.setVector3("cameraPosition", BABYLON.Vector3.Zero());
    this._shaderMaterial.backFaceCulling = false;

    let mat = new BABYLON.StandardMaterial("mat1", this._scene);

    // ---------------- Create the particles    
    this._SPS = new BABYLON.SolidParticleSystem('_SPS', this._scene);
    this._SPS.addShape(box, this.particleCount);
    let mesh = this._SPS.buildMesh();
    mesh.material = mat;
    mesh.position.y = -100;
    box.dispose();

    // ************************* Initialize ***************************
    this._SPS.initParticles = function () {
      for (let p = 0; p < this.nbParticles; p++) {
        this.particles[p].color.r = Math.random() * 0.6 + 0.5;
        this.particles[p].color.g = Math.random() * 0.6 + 0.5;
        this.particles[p].color.b = Math.random() * 0.6 + 0.5;
        this.recycleParticle(this.particles[p]);

      }
    };

    // ********************* Recycle Particles ************************
    this._SPS.recycleParticle = function (particle: BABYLON.SolidParticle): BABYLON.SolidParticle {

      if (particle.idx > this.particleCount) {
        particle.alive = false;
      }
      else {
        particle.alive = true;
      }
      if (!particle.alive) {
        if (particle.scale.y == 0) {
          return particle;
        }
        particle.scale.x = 0;
        particle.scale.y = 0;
        particle.scale.z = 0;
        return particle;
      }
      else {
        particle.position.x = Math.random() * 100;
        particle.position.y = Math.random() * 100;
        particle.position.z = Math.random() * 100;
        particle.velocity.x = (Math.random() - 0.5) * this.speed;
        particle.velocity.y = Math.random() * this.speed;
        particle.velocity.z = (Math.random() - 0.5) * this.speed;

        particle.scale.x = this._scale; // this._SPS.vars.scale;
        particle.scale.y = this._scale; //this._SPS.vars.scale;
        particle.scale.z = this._scale; //this._SPS.vars.scale;
        particle.rotation.x = Math.random() * 3.5;
        particle.rotation.y = Math.random() * 3.5;
        particle.rotation.z = Math.random() * 3.5;
      }

      return particle;

    }.bind(this);

    // *************************** Behavior ***************************
    this._SPS.updateParticle = function (particle: BABYLON.SolidParticle): BABYLON.SolidParticle {
      if (particle.position.x == null || isNaN(particle.position.x)) {
        return this._SPS.recycleParticle(particle);
      }
      if (particle.position.y > 200 || particle.position.y < 0 || Math.pow((particle.position.x - 0), 2) + Math.pow((particle.position.z - 0), 2) > Math.pow(140, 2)) {
        return this._SPS.recycleParticle(particle);
      }

      particle.velocity.y += (this._gravity * 0.01);
      (particle.position).addInPlace(particle.velocity);
      particle.position.y += this.speed / 4;

      let spin = (particle.idx % 2 == 0) ? 1 : -1;
      particle.rotation.z += 0.1 * spin;
      particle.rotation.x += 0.05 * spin;
      particle.rotation.y += 0.008 * spin;
      return particle;
    }.bind(this);

    this._SPS.initParticles();

    // ************* Execute Prior to Render **********************
    this._scene.registerBeforeRender(function () {

      this._SPS.setParticles();
      this._SPS.mesh.rotation.y += this._vortexSpeed * 0.025;
      if (this.shaderMaterial) {
        this.shaderMaterial.setVector3("lightPosition", this._pointLight.position);
      }
    }.bind(this));

  }

}