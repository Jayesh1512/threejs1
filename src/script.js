import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// objectx

const textureLoader = new THREE.TextureLoader()
const gradiectTexture = textureLoader.load('textures/gradients/3.jpg')
gradiectTexture.magFilter = THREE.NearestFilter 


//
const cursor = {
    x :0,y:0
}
window.addEventListener('mousemove' , (e)=>{
    cursor.x = e.clientX / sizes.width -0.5;
    cursor.y = e.clientY / sizes.height -0.5;

})


//matrial
const material =  new THREE.MeshToonMaterial({color : parameters.materialColor , gradientMap : gradiectTexture})
const objectDistance = 4
///meshes
const mesh3 = new THREE.Mesh(
new THREE.TorusGeometry(1,0.4,16,60),
material
)

const mesh2 = new THREE.Mesh(
new THREE.ConeGeometry(1,2,32),
material
)

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
   )

scene.add(mesh1 , mesh2 , mesh3)
mesh1.position.y = -objectDistance *0;

mesh1.position.x = 2


mesh2.position.y = -objectDistance *1;
mesh2.position.x = -2
mesh3.position.y = -objectDistance *2;
mesh3.position.x = 2


const sectionMeshes = [mesh1 , mesh2, mesh3]

//particle
const particleCount = 500
const positions = new Float32Array(particleCount*3) 

for(let i =0 ; i< particleCount ; i++){
    positions[i*3 +0] = (Math.random()-0.5) *10;
    positions[i*3 +1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
    positions[i*3 +2] = (Math.random()-0.5) *10;
}
const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position' , new THREE.BufferAttribute(positions,3))

const particleMaterial = new THREE.PointsMaterial({color: parameters.materialColor , size:0.03 , sizeAttenuation:true})

const particles = new THREE.Points(particleGeometry,particleMaterial);
scene.add(particles)


// UJAALA

const directionalLight =new THREE.DirectionalLight('#ffffff')
directionalLight.position.set(1,1,0)
scene.add(directionalLight)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */


const cameraGroup = new THREE.Group();
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




// camera Rotation

let scroll = window.scrollY;

window.addEventListener('scroll' , ()=>{
    scroll = window.scrollY;
})


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    for(const mesh  of sectionMeshes){
        mesh.rotation.x = elapsedTime  * 0.1
        mesh.rotation.y = elapsedTime  * 0.15
    }
    camera.position.y  = -scroll/sizes.height*4
    

        //parallax
    const parallaxX = cursor.x
    const parallaxY = cursor.y
    cameraGroup.position.x = (parallaxX - cameraGroup.position.x) * 0.1;
    cameraGroup.position.y = (parallaxY - cameraGroup.position.y) *0.1
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()