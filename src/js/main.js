import "../css/index.css"
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Green Box
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshStandardMaterial({
// 	color: 0x00ff00,
// 	roughness: 0.7,
// 	metalness: 0.3
// })
// const greenBox = new THREE.Mesh(geometry, material)
// scene.add(greenBox)

// Load the .glb model
const loader = new GLTFLoader()
loader.load(
	"src/assets/models/mount.blend1.glb", // Replace with the actual path to your .glb file
	(gltf) => {
		// Add the loaded model to the scene
		const model = gltf.scene

		// Wireframe model
		model.position.set(0, 0, 0) // Adjust position if needed
		model.scale.set(1, 1, 1) // Adjust scale if needed

		// Set wireframe to true for all materials
		model.traverse((child) => {
			if (child.isMesh && child.material) {
				child.material.wireframe = true
				child.material.color.set(0xffffff)
			}
		})

		scene.add(model)

		// Dots
		// Traverse the model and replace meshes with Points
		// model.traverse((child) => {
		// 	if (child.isMesh) {
		// 		const pointsMaterial = new THREE.PointsMaterial({
		// 			color: 0xffffff, // Set the color of the points
		// 			size: 0.025, // Adjust the size of the points
		// 		})

		// 		// Convert the mesh geometry to points
		// 		const points = new THREE.Points(child.geometry, pointsMaterial)
		// 		points.position.copy(child.position)
		// 		points.scale.copy(child.scale)
		// 		points.rotation.copy(child.rotation)

		// 		// Add the points to the scene
		// 		scene.add(points)
		// 	}
		// })
	},
	(xhr) => {
		// Optional: Log the loading progress
		console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
	},
	(error) => {
		// Handle errors
		console.error("An error occurred while loading the model:", error)
	}
)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const mainLight = new THREE.DirectionalLight(0xffffff, 1)
mainLight.position.set(2, 2, 1)
scene.add(mainLight)

// Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(5, 5, 10)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Add shadow support
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Prevent the camera from going below the model
controls.maxPolarAngle = Math.PI / 2 // Limit the vertical angle (90 degrees)

// Clock for consistent animations
const clock = new THREE.Clock()

// Animate
function animate() {
	const elapsedTime = clock.getElapsedTime()

	// Rotate the box
	// greenBox.rotation.x = elapsedTime * 0.5
	// greenBox.rotation.y = elapsedTime * 0.5

	// Update controls
	controls.update()

	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

// Handle Resize
window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setSize(sizes.width, sizes.height)
})

// Handle fullscreen
window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
})

animate()
