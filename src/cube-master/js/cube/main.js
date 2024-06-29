import * as THREE from 'three';
import { OrbitControls } from "../three/OrbitControls.js";
import Cube from "./Cube.js";
import {
    Axes,
    KeysToMoves,
    ClickFlags,
    MoveFlags,
    ANIMATION_SPEED,
} from "./Constants.js";

let animationFrameId = null;  // This will store the request ID for the animation frame
let mouse = new THREE.Vector2(); // Vector2 for storing mouse coordinates
let raycaster = new THREE.Raycaster(); // Raycaster for detecting intersects
let isCameraRotating = true; // Track whether the camera is rotating

// Define animate globally within the module
const animate = (renderer, scene, camera, update, controls) => {
    const loop = () => {
        animationFrameId = requestAnimationFrame(loop);
        update(controls); // Now passing controls as an argument
        update(); // Call update to process moves and handle animations
        renderer.render(scene, camera);
    };
    loop();
};

// Main rendering function that handles continuous rendering of the scene
const render = (renderer, scene, camera, update, controls) => {
    animate(renderer, scene, camera, update, controls); // Use the globally defined animate function
};

export function CubeMasterInit(videoURLs, allVideosLoadedCallback, progressCallback, domElement, openModal, isModalOpen, isAnyModalOpen) {

    const getHeaderSize = () => {
        // Height of header for embedding in other websites
        return 0;
    };

    const getHeight = () => {
        // Main content height calculation
        return window.innerHeight * 1;
    };

    const getTolerance = () => {
        // Tolerance for mouse/pointer moves, higher on mobile
        if (window.innerWidth <= 500) {
            return 0.1;
        }
        return 0.05;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 3, 10); // Set initial camera position

    // Use the passed DOM element
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    domElement.appendChild(renderer.domElement);

    // Adding spotlight and ambient light
    const spotlight = new THREE.SpotLight(0xffffff, 0.5); // white light with full intensity
    const spotlightPosition = new THREE.Vector3(3, 0, 2); // Initial spotlight position
    spotlight.position.copy(spotlightPosition);
    spotlight.target.position.set(0, 0, 0); // Ensure this is the center of the cube
    spotlight.angle = Math.PI / 4; // Narrow beam of light
    spotlight.penumbra = 2; // Softer edge to make the transition less harsh
    spotlight.decay = 2; // Light intensity decreases with distance
    spotlight.distance = 100; // Adjust distance to cover the cube
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Adjust ambient light if scene is too dark or too bright
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // You can reduce intensity if needed
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.enableRotate = true;

    function updateSpotlightPosition() {
        const relativeCameraPosition = new THREE.Vector3().subVectors(camera.position, spotlight.target.position);
        const distanceFromTarget = relativeCameraPosition.length();
        relativeCameraPosition.normalize();
        spotlight.position.copy(spotlight.target.position).add(relativeCameraPosition.multiplyScalar(distanceFromTarget));
    }

    controls.addEventListener('change', updateSpotlightPosition);
    controls.update();

    const cube = new Cube(scene, videoURLs, allVideosLoadedCallback, progressCallback); // Initialize the cube with video textures

    const startRendering = () => {
        if (!animationFrameId) {
            animate(renderer, scene, camera, update); // Correctly call the global animate function
        }
    };    

    const stopRendering = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Stop the animation loop if it's running
            animationFrameId = null;
        }
    };

    let rotationPixelCutoff; // Declare variable to store rotation pixel cutoff
    let animating = false; // Tracks whether any animation is currently happening
    let holdingW = false; // Tracks whether the 'W' key is being held down
    let moveBuffer = [];  // Initialize moveBuffer as an empty array

    // Update the rotation pixel cutoff based on interactions
    const updateRotationPixelCutoff = () => {
        const halfWidth = window.innerWidth / 2;
        cube.cubies.forEach((cubie) => {
            if (cubie.fixedPositionVector.x === 1 && cubie.fixedPositionVector.y === -1 && cubie.fixedPositionVector.z === 1) {
                const pos = cubie.fixedPositionVector.clone();
                pos.project(camera);
                rotationPixelCutoff = pos.x * halfWidth + halfWidth; // Update the rotation pixel cutoff for user interactions
            }
        });
    };
    updateRotationPixelCutoff();
    controls.addEventListener("change", updateRotationPixelCutoff); // Add listener to update cutoff on control changes

    const clock = new THREE.Clock(); // Use a clock to manage time within the animation

    // Function for making updates per tick
    const update = () => {
        const delta = clock.getDelta();
    
        if (isCameraRotating) {
            camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.1); // Adjust the rotation speed as needed
            camera.lookAt(scene.position); // Ensure the camera is always looking at the cube
        }
    
        controls.update();  // Update the controls with damping effect
        updateSpotlightPosition();  // Update spotlight position based on camera
    
        if (!animating && moveBuffer.length > 0) {
            const move = moveBuffer.shift();
    
            if (move === MoveFlags.SOLUTION_END) {
                animating = false;
            } else {
                cube.move(move);
                animating = true;
            }
        }
    
        // if any cubie is animating, perform the animation
        cube.forEach((cubie) => {
            if (cubie.animating) {
                if (cubie.angle >= Math.PI * 0.5) {
                    // if it's finished rotating 90 degrees
                    cubie.angle = 0;
                    cubie.animating = false;
                    cubie.turn(cubie.animateAxis, cubie.animateDir);
                    cubie.lockPosition();
                    animating = false;
                } else {
                    // if it's still rotating
                    cubie.rotate(
                        cubie.animateAxis,
                        cubie.animateDir * delta * ANIMATION_SPEED
                    );
                    cubie.angle += delta * ANIMATION_SPEED
                }
            }
        });
    };    

    // Event handlers for keyboard and mouse events, resize, and touch

    // Declare a variable to keep track of the currently hovered sticker
    let hoveredSticker = null;
    // Variable to hold the sticker that might be clicked
    let activeSticker = null;

    // Event handlers for keyboard and mouse events, resize, and touch...
    document.addEventListener("pointermove", (event) => {
        if (!dragging) {
            // Existing hover functionality
            mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.offsetY / getHeight()) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cube.meshes, true);
            if (intersects.length > 0) {
                let intersectedMesh = intersects[0].object;
                if (cube.stickersMap.has(intersectedMesh.uuid)) {
                    let intersectedSticker = cube.stickersMap.get(intersectedMesh.uuid);
                    if (hoveredSticker !== intersectedSticker) {
                        if (hoveredSticker) hoveredSticker.reset();
                        hoveredSticker = intersectedSticker;
                        hoveredSticker.dim();
                        activeSticker = hoveredSticker; // Set activeSticker when a new sticker is hovered
                    }
                }
            } else {
                if (hoveredSticker) {
                    hoveredSticker.reset();
                    hoveredSticker = null;
                    activeSticker = null; // Clear activeSticker if no sticker is hovered
                }
            }
        } else {
            // Existing dragging functionality
            const delta = new THREE.Vector2(
                (event.offsetX / window.innerWidth) * 2 - 1 - mouse.x,
                -(event.offsetY / getHeight()) * 2 + 1 - mouse.y
            );
            if (delta.length() > getTolerance() && selectedObject !== ClickFlags.CUBIE) {
                // Compute the direction of the drag here and handle it appropriately
                // Ensure you update `chosenAxis` and `chosenDir` as needed
            }
        }
    }, false);

    /**
     * Handle key press event
     */
    const onKeyPress = (event) => {

        // append 'w' if holding w
        const key = holdingW ? "w" + event.key : event.key;

        if (KeysToMoves[key] !== undefined) {
            // push normal move if key is in KeysToMoves map
            moveBuffer.push(KeysToMoves[key]);
        } else if (event.key === "Enter") {
            moveBuffer.push(MoveFlags.SOLUTION_START);
        } else if (event.key === "w" || event.key === "W") {
            holdingW = true;
        }
    };
    document.addEventListener("keypress", onKeyPress, false);

    /**
     * Handle key up event
     */
    const onKeyUp = (event) => {
        // unset holdingW if released w
        if (event.key === "w" || event.key === "W") holdingW = false;
    };
    document.addEventListener("keyup", onKeyUp, false);

    /**
     * Resize canvas on window resize
     */
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / getHeight();
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, getHeight());
        updateRotationPixelCutoff();
    };
    window.addEventListener("resize", onWindowResize, false);

    /**
     * Route touch events to mouse events
     */
    const onTouchStart = (event) => {
        event.offsetX = event.touches[0].clientX;
        event.offsetY = event.touches[0].clientY - getHeaderSize();
        onDocumentMouseDown(event);
    };
    document.addEventListener("touchstart", onTouchStart, false);

    const onTouchEnd = (event) => {
        onDocumentMouseUp(event);
    };
    document.addEventListener("touchend", onTouchEnd, false);

    const onTouchMove = (event) => {
        event.preventDefault(); // Prevents scrolling the page while touching the cube
        event.offsetX = event.touches[0].clientX;
        event.offsetY = event.touches[0].clientY - getHeaderSize();
        onDocumentMouseMove(event);
      };      
    document.addEventListener("touchmove", onTouchMove, false);

    /**
     * Mouse events
     */
    // variables to store the chosen move based on the mouse events
    let chosenAxis = null;
    let chosenDir = 0;
    let selectedObject = ClickFlags.NONE;
    let dragging = false;
    let clickStartPosition = null;
    let hasMoved = false;

    /**
     * Function to handle pointer down events
     */
    const onDocumentMouseDown = (event) => {
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / getHeight()) * 2 + 1;
        clickStartPosition = { x: event.offsetX, y: event.offsetY };
        hasMoved = false;
    
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cube.meshes, true);
    
        if (intersects.length > 0) {
            controls.enabled = false;
            dragging = true;
            let clickedMesh = intersects[0].object;
            if (cube.stickersMap.has(clickedMesh.uuid)) {
                selectedObject = intersects[0];
                activeSticker = cube.stickersMap.get(clickedMesh.uuid);  // Set activeSticker immediately on click
                activeSticker.dim();
            }
        } else {
            controls.enabled = true;
            selectedObject = ClickFlags.ROTATION;
        }
    };   

    document.addEventListener("pointerdown", onDocumentMouseDown, false);

    /**
     * Function to handle pointer up events
     */
    const onDocumentMouseUp = (event) => {
        let moveX = Math.abs(clickStartPosition.x - event.offsetX);
        let moveY = Math.abs(clickStartPosition.y - event.offsetY);
        hasMoved = moveX > 15 || moveY > 15;
    
        if (!hasMoved && activeSticker && !isModalOpen) {
            openModal(activeSticker.videoid);
        }
    
        // Reset interactions
        controls.enabled = true;
        dragging = false;
        selectedObject = ClickFlags.NONE;
        chosenAxis = null;
        chosenDir = 0;
    
    if (activeSticker) {
        console.log("Trying to open modal with videoID:", activeSticker.videoid); 
        openModal(activeSticker.videoid); // Always attempt to open the modal
        activeSticker.reset();
        activeSticker = null;
    }
    
        clickStartPosition = null;
    };

    document.addEventListener("pointerup", onDocumentMouseUp, false);   

    /**
     * Handle mouse move events by determining what
     * move is being requested, and pushing it to the moveBuffer.
     */
    const onDocumentMouseMove = (event) => {
    
        // do nothing if not dragging
        if (!dragging || chosenAxis !== null) {
            return;
        }
    
        // do nothing if clicked a cubie
        if (selectedObject === ClickFlags.CUBIE) {
            return;
        }
    
        // Calculate mouse movement delta
        const delta = new THREE.Vector2(
            (event.offsetX / window.innerWidth) * 2 - 1 - mouse.x,
            -(event.offsetY / getHeight()) * 2 + 1 - mouse.y
        );
    
        // Check if the movement is significant enough to consider as a swipe
        if (delta.length() <= getTolerance()) {
            return;
        }
    
        // Determine the direction of the swipe
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            chosenAxis = Axes.POSITIVE.X;
            chosenDir = delta.x > 0 ? 1 : -1;
        } else {
            chosenAxis = Axes.POSITIVE.Y;
            chosenDir = delta.y > 0 ? 1 : -1;
        }

        // check if this is a cube rotation or a turn
        if (selectedObject === ClickFlags.ROTATION) {
            // do a cube rotation
            if (chosenAxis === Axes.POSITIVE.X) {
                if (chosenDir === -1) moveBuffer.push("y");
                else if (chosenDir === 1) moveBuffer.push("y'");
            } else if (chosenAxis === Axes.POSITIVE.Y) {
                if (event.offsetX < rotationPixelCutoff) {
                    // do an x rotation if to the left of the pixel cutoff
                    if (chosenDir === -1) moveBuffer.push("x'");
                    else if (chosenDir === 1) moveBuffer.push("x");
                } else {
                    // do a z rotation if to the right
                    if (chosenDir === -1) moveBuffer.push("z");
                    else if (chosenDir === 1) moveBuffer.push("z'");
                }
            }
            return;
        }

        // user is performing a move

        // get the mesh for the selected sticker
        const selectedSticker = cube.stickersMap.get(selectedObject.object.uuid);
        // check what direction the swipe was in
        if (chosenAxis === Axes.POSITIVE.X) {
            // swiping right/left
            if (selectedSticker.fixedFacingVector.y === 1) {
                // the selected sticker is facing up
                switch (selectedSticker.fixedPositionVector.z) {
                    // piece is in the back layer
                    case -1:
                        if (-1 * chosenDir === -1) moveBuffer.push("B'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("B");
                        break;
                    // piece is in the S slice
                    case 0:
                        if (chosenDir === -1) moveBuffer.push("S'");
                        else if (chosenDir === 1) moveBuffer.push("S");
                        break;
                    // piece is in the front layer
                    case 1:
                        if (chosenDir === -1) moveBuffer.push("F'");
                        else if (chosenDir === 1) moveBuffer.push("F");
                        break;
                    default:
                        break;
                }
            } else {
                // the selected sticker is facing right or front
                switch (selectedSticker.fixedPositionVector.y) {
                    // piece is in bottom layer
                    case -1:
                        if (chosenDir === -1) moveBuffer.push("D'");
                        else if (chosenDir === 1) moveBuffer.push("D");
                        break;
                    // piece is in E slice
                    case 0:
                        if (chosenDir === -1) moveBuffer.push("E'");
                        else if (chosenDir === 1) moveBuffer.push("E");
                        break;
                    // piece is in up layer
                    case 1:
                        if (-1 * chosenDir === -1) moveBuffer.push("U'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("U");
                        break;
                    default:
                        break;
                }
            }
        } else if (chosenAxis === Axes.POSITIVE.Y) {
            // swiping up/down
            if (selectedSticker.fixedFacingVector.x === 1) {
                // selected sticker is facing right
                switch (selectedSticker.fixedPositionVector.z) {
                    // piece is in back layer
                    case -1:
                        if (chosenDir === -1) moveBuffer.push("B'");
                        else if (chosenDir === 1) moveBuffer.push("B");
                        break;
                    // piece is in S slice
                    case 0:
                        if (-1 * chosenDir === -1) moveBuffer.push("S'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("S");
                        break;
                    // piece is in front layer
                    case 1:
                        if (-1 * chosenDir === -1) moveBuffer.push("F'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("F");
                        break;
                    default:
                        break;
                }
            } else {
                // selected sticker is facing up or front
                switch (selectedSticker.fixedPositionVector.x) {
                    // piece is in left layer
                    case -1:
                        if (-1 * chosenDir === -1) moveBuffer.push("L'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("L");
                        break;
                    // piece is in M slice
                    case 0:
                        if (-1 * chosenDir === -1) moveBuffer.push("M'");
                        else if (-1 * chosenDir === 1) moveBuffer.push("M");
                        break;
                    // piece is in right layer
                    case 1:
                        if (chosenDir === -1) moveBuffer.push("R'");
                        else if (chosenDir === 1) moveBuffer.push("R");
                        break;
                    default:
                        break;
                }
            }
        }
        // set dragging to false to not trigger another move
        dragging = false;
    };
    document.addEventListener("pointermove", onDocumentMouseMove, false);

    // Start the animation loop with update function integrated
    render(renderer, scene, camera, update);

    // Return these functions so they can be called externally
    return { startRendering, stopRendering };
};