import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
} from 'three'
import type { BufferGeometry, Material, Object3D } from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/** Escena decorativa local a la portada: tres vagones, un recorrido y un único ciclo de render. */
export function mountMetroScene(canvas: HTMLCanvasElement, graffitiImages: readonly HTMLImageElement[]) {
  // Comprobar el contexto antes del constructor evita errores de Three en equipos sin WebGL.
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true })
  if (!context) return () => {}

  const renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true })
  renderer.setClearColor(0, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.shadowMap.enabled = true
  const scene = new Scene()
  const camera = new OrthographicCamera(-10, 10, 10, -10, 0.1, 150)
  camera.position.set(-12, 9, 15)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const styles = getComputedStyle(canvas)
  const color = (token: string) => new Color(styles.getPropertyValue(token).trim())
  const ink = color('--p5-ink')
  const paper = color('--p5-paper')
  const red = color('--p5-red')
  const metal = color('--p5-paper-3')
  const dark = color('--p5-ink-3')
  const body = new MeshStandardMaterial({ color: color('--p5-ink-2'), roughness: 0.65, metalness: 0.18 })
  const aluminum = new MeshStandardMaterial({ color: dark, roughness: 0.65, metalness: 0.25 })
  const black = new MeshStandardMaterial({ color: ink, roughness: 0.55 })
  const glass = new MeshStandardMaterial({ color: metal, roughness: 0.35, metalness: 0.1, emissive: paper, emissiveIntensity: 0.12 })
  const stripe = new MeshStandardMaterial({ color: red, roughness: 0.4 })
  const light = new MeshBasicMaterial({ color: paper })
  const tailLight = new MeshBasicMaterial({ color: red })
  const geometries = new Map<string, BufferGeometry>()

  function box(parent: Object3D, size: [number, number, number], position: [number, number, number], material: Material, radius = 0) {
    const key = `${size.join(',')}:${radius}`
    let geometry = geometries.get(key)
    if (!geometry) {
      geometry = radius ? new RoundedBoxGeometry(...size, 2, radius) : new BoxGeometry(...size)
      geometries.set(key, geometry)
    }
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }

  // La señal de destino forma parte del modelo, con la marca y las tintas del portfolio.
  const signCanvas = document.createElement('canvas')
  signCanvas.width = 512
  signCanvas.height = 128
  const signContext = signCanvas.getContext('2d')!
  signContext.fillStyle = `#${ink.getHexString()}`
  signContext.fillRect(0, 0, 512, 128)
  signContext.fillStyle = `#${paper.getHexString()}`
  signContext.font = '800 66px "Barlow Condensed", sans-serif'
  signContext.textAlign = 'center'
  signContext.textBaseline = 'middle'
  signContext.fillText('01  PARIC.IO', 256, 66)
  const signTexture = new CanvasTexture(signCanvas)
  signTexture.colorSpace = SRGBColorSpace
  const signMaterial = new MeshBasicMaterial({ map: signTexture })

  const graffitiTextures = graffitiImages.map((image) => {
    const texture = new Texture(image)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    texture.needsUpdate = true
    return texture
  })
  const graffiti = new MeshStandardMaterial({ map: graffitiTextures[0], transparent: true, depthWrite: false, roughness: 0.65, metalness: 0.18 })
  const graffitiGeometry = new PlaneGeometry(5.2, 5.2 / 3)

  const train = new Group()
  const wheelGeometry = new CylinderGeometry(0.24, 0.24, 0.14, 12)
  wheelGeometry.rotateX(Math.PI / 2)
  geometries.set('wheel', wheelGeometry)

  for (let carriage = 0; carriage < 3; carriage++) {
    const car = new Group()
    car.position.x = (carriage - 1) * 6.15
    train.add(car)

    box(car, [5.7, 1.65, 1.6], [0, 1.26, 0], body, 0.16)
    box(car, [5.35, 0.28, 1.49], [0, 2.08, 0], aluminum, 0.12)
    box(car, [5.45, 0.22, 1.5], [0, 0.43, 0], black, 0.06)
    box(car, [4.5, 0.3, 1.12], [0, 0.32, 0], aluminum, 0.03)

    for (const side of [-1, 1]) {
      const z = side * 0.808
      box(car, [5.38, 0.09, 0.024], [0, 0.94, z], stripe)
      box(car, [5.22, 0.035, 0.024], [0, 0.64, z], aluminum)

      for (const x of [-2.16, 0, 2.16]) {
        box(car, [1.04, 0.71, 0.034], [x, 1.56, z], black, 0.045)
        box(car, [0.93, 0.61, 0.04], [x, 1.56, z + side * 0.012], glass, 0.035)
      }

      for (const x of [-1.08, 1.08]) {
        box(car, [0.91, 1.4, 0.036], [x, 1.25, z], black, 0.025)
        box(car, [0.85, 1.34, 0.04], [x, 1.25, z + side * 0.024], aluminum, 0.02)
        box(car, [0.85, 0.09, 0.045], [x, 0.94, z + side * 0.047], stripe)
        for (const half of [-1, 1]) {
          box(car, [0.29, 0.58, 0.045], [x + half * 0.215, 1.56, z + side * 0.048], glass, 0.025)
          box(car, [0.035, 0.12, 0.045], [x + half * 0.07, 1.13, z + side * 0.054], black)
        }
        box(car, [0.018, 1.3, 0.05], [x, 1.25, z + side * 0.05], black)
      }
      if (carriage === 1) {
        const tag = new Mesh(graffitiGeometry, graffiti)
        tag.position.set(0, 1.24, side * 0.91)
        tag.rotation.y = side === -1 ? Math.PI : 0
        tag.receiveShadow = true
        car.add(tag)
      }
    }

    // Bogies, ejes y equipos de climatización hacen legible el volumen desde arriba.
    for (const x of [-1.85, 1.85]) {
      box(car, [1.02, 0.25, 1.12], [x, 0.25, 0], black, 0.035)
      for (const axle of [-0.32, 0.32]) {
        for (const side of [-1, 1]) {
          const wheel = new Mesh(wheelGeometry, black)
          wheel.position.set(x + axle, 0.24, side * 0.65)
          wheel.castShadow = true
          car.add(wheel)
        }
      }
    }
    for (const x of [-1.45, 1.45]) {
      box(car, [1.24, 0.2, 1.05], [x, 2.3, 0], body, 0.06)
      for (let vent = 0; vent < 7; vent++) {
        box(car, [0.055, 0.014, 0.77], [x - 0.42 + vent * 0.14, 2.407, 0], aluminum)
      }
    }
    box(car, [1.15, 0.06, 0.52], [0, 2.25, 0], aluminum)

    if (carriage < 2) {
      box(car, [0.5, 1.32, 1.23], [3.075, 1.2, 0], black, 0.05)
      for (let fold = 0; fold < 5; fold++) {
        box(car, [0.045, 1.35, 1.26], [2.89 + fold * 0.09, 1.2, 0], aluminum, 0.015)
      }
    }

    if (carriage !== 1) {
      const end = carriage === 0 ? -1 : 1
      const cab = new Group()
      cab.position.x = end * 2.83
      cab.rotation.y = end === -1 ? -Math.PI / 2 : Math.PI / 2
      car.add(cab)
      box(cab, [1.48, 1.47, 0.1], [0, 1.24, 0], body, 0.1)
      box(cab, [1.34, 0.93, 0.035], [0, 1.56, 0.065], black, 0.1)
      box(cab, [1.2, 0.56, 0.04], [0, 1.46, 0.085], glass, 0.05)
      box(cab, [0.045, 0.58, 0.05], [0, 1.47, 0.11], black)
      box(cab, [1.44, 0.2, 0.06], [0, 0.93, 0.085], stripe)
      box(cab, [1.03, 0.19, 0.06], [0, 0.53, 0.06], black, 0.04)
      for (const side of [-1, 1]) {
        box(cab, [0.28, 0.15, 0.055], [side * 0.46, 0.72, 0.11], black, 0.04)
        box(cab, [0.21, 0.075, 0.06], [side * 0.46, 0.72, 0.14], end === -1 ? light : tailLight, 0.02)
      }
      const sign = new Mesh(new PlaneGeometry(1.06, 0.23), signMaterial)
      sign.position.set(0, 1.88, 0.092)
      cab.add(sign)
    }
  }
  scene.add(train)

  scene.add(new HemisphereLight(paper, metal, 2.4))
  const sun = new DirectionalLight(paper, 2)
  sun.position.set(-6, 12, 7)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 12, bottom: -12, far: 60 })
  sun.shadow.normalBias = 0.035
  scene.add(sun)
  const floor = new Mesh(new PlaneGeometry(160, 160), new ShadowMaterial({ color: ink, opacity: 0.24 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.04
  floor.receiveShadow = true
  scene.add(floor)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let visible = false
  let contextLost = false
  let elapsed = 0.3
  let previousTime: number | undefined
  let travel = 22
  const directions = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
  const mobileDirections = [0, Math.PI, 0.15, Math.PI + 0.15]
  let mobile = false
  let pass = -1

  function render(time: number) {
    const duration = mobile ? 5 : 3.6
    if (previousTime !== undefined) elapsed += (time - previousTime) / 1000
    previousTime = time
    const nextPass = reducedMotion.matches ? -1 : Math.floor(elapsed / duration)
    if (nextPass !== pass || reducedMotion.matches) {
      pass = nextPass
      const routeDirections = mobile ? mobileDirections : directions
      train.rotation.y = reducedMotion.matches ? 0 : routeDirections[pass % routeDirections.length]!
      graffiti.map = graffitiTextures[reducedMotion.matches ? 0 : pass % graffitiTextures.length]!
    }
    // Se reutiliza un solo tren y se cambia su sentido únicamente entre recorridos completos.
    const timeInPass = elapsed % duration
    const progress = reducedMotion.matches ? 0.46 : Math.min(timeInPass / duration, 1)
    const distance = travel * (1 - progress * 2)
    train.position.set(distance * Math.cos(train.rotation.y), 0, -distance * Math.sin(train.rotation.y))
    renderer.render(scene, camera)
  }

  function updatePlayback() {
    previousTime = undefined
    renderer.setAnimationLoop(null)
    if (!visible || document.hidden || contextLost) return
    if (reducedMotion.matches) render(performance.now())
    else renderer.setAnimationLoop(render)
  }

  function resize() {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height || contextLost) return
    mobile = window.innerWidth < 760
    camera.position.set(...(mobile ? [-10, 7, 17] : [-12, 9, 15]) as [number, number, number])
    camera.lookAt(0, 0, 0)
    if (mobile) camera.rotateZ(-1.06)
    camera.updateMatrixWorld()
    pass = -2
    const viewHeight = mobile ? 18 : 21
    const viewWidth = viewHeight * width / height
    const panelWidth = canvas.closest<HTMLElement>('.hero-plane')?.clientWidth ?? width
    const panelViewWidth = viewHeight * panelWidth / height
    // Descentrar la cámara compensa la parte del plano que queda fuera del viewport.
    const offset = panelViewWidth * 0.16
    camera.left = -viewWidth / 2 + offset
    camera.right = viewWidth / 2 + offset
    camera.top = viewHeight / 2 - 0.7
    camera.bottom = -viewHeight / 2 - 0.7
    camera.updateProjectionMatrix()
    // En móvil la salida se calcula también con el alto: deben salir los tres vagones.
    travel = 10 + Math.max(panelViewWidth, mobile ? viewHeight * 0.85 : 0)
    renderer.setSize(width, height, false)
    previousTime = undefined
    if (!document.hidden) render(performance.now())
  }

  function loseContext(event: Event) {
    event.preventDefault()
    contextLost = true
    updatePlayback()
  }

  function restoreContext() {
    contextLost = false
    resize()
    updatePlayback()
  }

  const resizeObserver = new ResizeObserver(resize)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false
    updatePlayback()
  })
  resizeObserver.observe(canvas)
  intersectionObserver.observe(canvas.closest('.home-hero') ?? canvas)
  reducedMotion.addEventListener('change', updatePlayback)
  document.addEventListener('visibilitychange', updatePlayback)
  canvas.addEventListener('webglcontextlost', loseContext)
  canvas.addEventListener('webglcontextrestored', restoreContext)
  resize()

  return () => {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    intersectionObserver.disconnect()
    reducedMotion.removeEventListener('change', updatePlayback)
    document.removeEventListener('visibilitychange', updatePlayback)
    canvas.removeEventListener('webglcontextlost', loseContext)
    canvas.removeEventListener('webglcontextrestored', restoreContext)
    const usedGeometries = new Set<BufferGeometry>()
    const usedMaterials = new Set<Material>()
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        usedGeometries.add(object.geometry)
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach(material => usedMaterials.add(material))
      }
    })
    usedGeometries.forEach(geometry => geometry.dispose())
    usedMaterials.forEach(material => material.dispose())
    signTexture.dispose()
    graffitiTextures.forEach(texture => texture.dispose())
    sun.shadow.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
}
