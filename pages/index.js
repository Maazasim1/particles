import { useEffect, useRef } from "react"
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default function Home() {
  const mountRef = useRef(null)

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene()

    //Particles
    const particlesGeometry=new THREE.BufferGeometry();
    const particleCount=100000
    const particleRadius=5
    const galaxyBranches=5
    const galaxySpin=-0.6
    const randomness=0.5
    const randomnessPower=2
    const insideColor ='#ff6030'
    const outsideColor ='#1b3984'

    const positions=new Float32Array(particleCount*3)
    const colors=new Float32Array(particleCount*3)

    const colorInside=new THREE.Color(insideColor)
    const colorOutside=new THREE.Color(outsideColor)

    
    
    for(let i=0;i<particleCount;i++)
    {  const i3=i*3
      const radius=Math.random()*particleRadius
      const spinAngle=radius*galaxySpin
      const branchAngle=(i%galaxyBranches)/galaxyBranches * Math.PI*2
      const randomX=Math.pow(Math.random(),randomnessPower)*(Math.random()<0.5?1:-1)
      const randomY=Math.pow(Math.random(),randomnessPower)*(Math.random()<0.5?1:-1)
      const randomZ=Math.pow(Math.random(),randomnessPower)*(Math.random()<0.5?1:-1)
      positions[i3]=Math.cos(branchAngle+spinAngle)*radius+randomX
      positions[i3+1]=randomY
      positions[i3+2]=Math.sin(branchAngle+spinAngle)*radius+randomZ
    
      const mixedColor=colorInside.clone()
      mixedColor.lerp(colorOutside,radius/particleRadius)
      colors[i3]=mixedColor.r
      colors[i3+1]=mixedColor.g
      colors[i3+2]=mixedColor.b
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions,3)
    )
    particlesGeometry.setAttribute('color',
    new THREE.BufferAttribute(colors,3))

    const particlesMaterial=new THREE.PointsMaterial({
      // color:'#ff88cc',
      size:0.02, 
      sizeAttenuation:true,
      depthWrite:false,
      blending:THREE.AdditiveBlending,
      vertexColors:true
    })
    //Points
    const particles=new THREE.Points(particlesGeometry,particlesMaterial)
    scene.add(particles)
    //Size
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    window.addEventListener('resize', () => {
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
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 1
    camera.position.y = 10
    camera.position.z = 10
    scene.add(camera)


    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#262837')
    renderer.shadowMap.enabled = true

    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    /**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //Update Particles
    // particles.rotation.y=elapsedTime*2
    // particles.rotation.x=elapsedTime*2
    // particles.rotation.z=elapsedTime*2
    
    // // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

    return () => mountRef.current.removeChild(renderer.domElement);
  }, [])

  return (
    <div ref={mountRef}>

    </div>
  )
}
