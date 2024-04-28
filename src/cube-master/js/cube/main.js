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

// CubeMasterInit function encapsulates the cube setup to be called with videoURLs
export function CubeMasterInit(videoURLs) {

    let holdingW = false;
    const mouse = new THREE.Vector2();
    const delta = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

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

    let moveBuffer = []; // FIFO buffer for storing moves
    let animating = false; // Animation state flag
    let solving = false; // Cube solving state flag

    const domElement = document.getElementById("three"); // Targeting the DOM element for rendering

    const scene = new THREE.Scene(); // Creating a new THREE.js scene
    scene.background = null; // Setting the scene background color

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / getHeight(), 0.1, 1000);
    camera.position.set(5, 4, 8); // Setting camera position

    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Creating the renderer with antialiasing
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, getHeight());
    domElement.appendChild(renderer.domElement); // Adding the renderer to the DOM

    const controls = new OrbitControls(camera, renderer.domElement); // Configuring orbit controls
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.update();

    // Set minimum and maximum zoom distances
    controls.minDistance = 5;  // Minimum zoom distance
    controls.maxDistance = 20;   // Maximum zoom distance

    const cube = new Cube(scene, videoURLs); // Create the cube and pass videoURLs

    let rotationPixelCutoff; // Variable to store cutoff pixel location for changing cube rotations

    // Function to update the rotation pixel cutoff
    const updateRotationPixelCutoff = () => {
        const halfWidth = window.innerWidth / 2;
        cube.cubies.forEach((cubie) => {
            if (cubie.fixedPositionVector.x === 1 && cubie.fixedPositionVector.y === -1 && cubie.fixedPositionVector.z === 1) {
                const pos = cubie.fixedPositionVector.clone();
                pos.project(camera);
                rotationPixelCutoff = pos.x * halfWidth + halfWidth;
            }
        });
    };
    updateRotationPixelCutoff();
    controls.addEventListener("change", updateRotationPixelCutoff); // Updating rotation pixel cutoff on zoom

    const solveCube = () => {
        // Functionality for solving the cube
        console.log("Cube solving functionality has been disabled.");
        solving = false;
    };

    const clock = new THREE.Clock(); // Clock for tracking time

    // Function for making updates per tick
    const update = () => {
        const delta = clock.getDelta();

        if (!animating && moveBuffer.length > 0) {
            const move = moveBuffer.shift();

            if (move === MoveFlags.SOLUTION_END) {
                solving = false;
                animating = false;
            } else if (move === MoveFlags.SOLUTION_START) {
                solveCube();
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
                    cubie.angle += delta * ANIMATION_SPEED;
                }
            }
        });
    };

    // Animation function to be called with requestAnimationFrame
    const animate = () => {
        requestAnimationFrame(animate);
        update();
        renderer.render(scene, camera);
    };
    animate(); // Start the animation loop

    // Event handlers for keyboard and mouse events, resize, and touch

    /**
     * Handle key press event
     */
    const onKeyPress = (event) => {
        // do nothing if solving
        if (solving) return;

        // append 'w' if holding w
        const key = holdingW ? "w" + event.key : event.key;

        if (KeysToMoves[key] !== undefined) {
            // push normal move if key is in KeysToMoves map
            moveBuffer.push(KeysToMoves[key]);
        } else if (event.key === "Enter") {
            // set solving to true and queue a solve request
            solving = true;
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

    /**
     * Handle clicks by finding the mesh that was clicked.
     */
    const onDocumentMouseDown = (event) => {
        // only handle events targeting the canvas
        if (event.target.tagName.toLowerCase() !== "canvas") return;
    
        // update mouse location
        mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.offsetY / getHeight()) * 2 + 1;
    
        // use raycaster to find what cube meshes intersect mouse position
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cube.meshes, true);
    
        if (intersects.length > 0) {
            // Mesh was clicked: disable OrbitControls and handle face rotation
            controls.enabled = false;
            dragging = true;
    
            // Determine which part of the cube was clicked
            if (cube.stickersMap.has(intersects[0].object.uuid)) {
                selectedObject = intersects[0];
            } else {
                // Handle case where a cubie but not a sticker is clicked
                selectedObject = ClickFlags.CUBIE;
            }
        } else {
            // No mesh was clicked: enable OrbitControls for full cube rotation
            controls.enabled = true;
            selectedObject = ClickFlags.ROTATION;
        }
    };    
    document.addEventListener("pointerdown", onDocumentMouseDown, false);

    /**
     * Handle mouse release by unsetting chosen axis, direction, and selected object.
     */
    const onDocumentMouseUp = (event) => {
        // Always enable OrbitControls on mouse up to allow rotation freedom when not dragging
        controls.enabled = true;
    
        // Reset interaction states
        dragging = false;
        selectedObject = ClickFlags.NONE;
        chosenAxis = null;
        chosenDir = 0;
    };
    document.addEventListener("pointerup", onDocumentMouseUp, false);

    /**
     * Handle mouse move events by determining what
     * move is being requested, and pushing it to the moveBuffer.
     */
    const onDocumentMouseMove = (event) => {
        // do nothing if not dragging, or if solving
        if (!dragging || chosenAxis !== null || solving) return;

        // do nothing if clicked a cubie
        if (selectedObject === ClickFlags.CUBIE) return;

        // find the difference of the current mouse position from where the click began
        delta.x = (event.offsetX / window.innerWidth) * 2 - 1 - mouse.x;
        delta.y = -(event.offsetY / getHeight()) * 2 + 1 - mouse.y;

        // do nothing if mouse hasn't moved far enough
        if (delta.length() <= getTolerance()) return;

        // determine if swipe is up/down or left/right
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            // if change was more in X direction than Y, then moving left/right
            chosenAxis = Axes.POSITIVE.X;
            chosenDir = delta.x > 0 ? 1 : -1;
        } else {
            // if change was more in Y direction than X, then moving up/down
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
};