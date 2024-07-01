import * as THREE from 'three';
import getRotationMatrix from "./RotationMatrices.js";
import { Axes, AxisVectors } from "./Constants.js";
import { gsap } from 'gsap';

/**
 * Rounded Rectangle code taken from three.js examples: https://threejs.org/examples/#webgl_geometry_shapes
 */
// create a new shape and manually construct a rounded square
const shape = new THREE.Shape();
const pos = 0; // the initial x and y coordinate of the square
const size = 0.925; // side length of the rounded square
const radius = 0.1; // radius of the curves in the corners of the square
// draw left side
shape.moveTo(pos, pos + radius);
shape.lineTo(pos, pos + size - radius);
// curve and draw top side
shape.quadraticCurveTo(pos, pos + size, pos + radius, pos + size);
shape.lineTo(pos + size - radius, pos + size);
// curve and draw right side
shape.quadraticCurveTo(pos + size, pos + size, pos + size, pos + size - radius);
shape.lineTo(pos + size, pos + radius);
// curve and draw bottom side
shape.quadraticCurveTo(pos + size, pos, pos + size - radius, pos);
shape.lineTo(pos + radius, pos);
// draw final curve connecting to left side
shape.quadraticCurveTo(pos, pos, pos, pos + radius);

// create a geometry from the rounded square shape
const roundedSquareGeometry = new THREE.ShapeBufferGeometry(shape);
roundedSquareGeometry.center();

// Utility function to extract videoID
function extractVideoID(url) {
    const match = url.match(/videoscenes\/(.*?)_Scene/);
    return match ? match[1] : '';
}

/**
 * Class for an individual sticker on the cube.
 */
class Sticker {
    /**
     * Construct a new sticker at the given position facing the given
     * direction with the specified video URL.
     * @param {number} x X position of sticker
     * @param {number} y Y position of sticker
     * @param {number} z Z position of sticker
     * @param {*} facingVector Direction sticker is facing
     * @param {string} videoURL Video URL for the sticker
     */
    constructor(x, y, z, facingVector, videoURL, onVideoLoaded) {
        this.positionVector = new THREE.Vector3(x, y, z);
        this.fixedPositionVector = new THREE.Vector3(x, y, z);
        this.facingVector = facingVector;
        this.fixedFacingVector = new THREE.Vector3(facingVector.x, facingVector.y, facingVector.z);
        this.videoURL = videoURL;
        this.videoid = extractVideoID(videoURL);  // Extract and store the video ID
    
        // Tweening properties
        this.isTweening = false;
        this.tweenStart = 0;
        this.tweenDuration = 0.5; // Duration in seconds
        this.startOpacity = 1.0;
        this.targetOpacity = 1.0;
    
        // Setup video element
        const video = document.createElement('video');
        video.crossOrigin = "anonymous";
        video.muted = true;  // Ensure video is muted
        video.loop = true;
        video.setAttribute('playsinline', true);  // Ensures inline playback on iOS devices
        video.preload = "auto";
        
        this.autoplaySuccess = false;  // Initialize autoplay success tracking
    
        // Load the video and setup callbacks for when it's ready to play and for errors
        video.oncanplaythrough = () => {
            video.oncanplaythrough = null;  // Remove event listener to prevent multiple triggers
            video.play().then(() => {
                this.autoplaySuccess = true;  // Set success to true when autoplay starts
                console.log("Autoplay started!");
                onVideoLoaded();  // Call the callback function if provided
            }).catch(e => {
                this.autoplaySuccess = false;  // Set success to false on error
                console.error("Autoplay was prevented:", e);
                onVideoLoaded(false);  // Call the callback with an error indicator
                // Optionally show a user interface prompt or a play button here
            });
        };
        video.onerror = () => {
            this.autoplaySuccess = false;
            console.error("Video load error for: " + videoURL);
            onVideoLoaded(false);  // Call the callback with an error indicator
        };
        video.src = videoURL;
        video.load();  // Attempt to load the video
    
        // Create a video texture from the video element
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
    
        // Use the video texture for the material
        this.material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            shininess: 10,  // Optional, adjust for desired shininess effect
            specular: 0x222222,  // Optional, adjust the color reflected by the light
        });
    
        // Use the rounded square geometry for the mesh
        this.mesh = new THREE.Mesh(roundedSquareGeometry, this.material);
    
        // Set initial position and rotation
        this.updatePosition(this.fixedPositionVector, this.fixedFacingVector);
        this.mesh.rotation.y = Math.PI * 0.5 * Math.abs(this.facingVector.x);
        this.mesh.rotation.x = Math.PI * 0.5 * Math.abs(this.facingVector.y);

        // Add event listeners for user interactions
        ['click', 'touchstart'].forEach(eventType => {
            window.addEventListener(eventType, () => {
                if (!this.autoplaySuccess) {
                    video.play().catch(e => {
                        console.error("Manual play was prevented:", e);
                    });
                }
            });
        });
    }    
    
    /**
     * Update the position of the sticker based on the new position and facing direction.
     * @param {*} positionVector new position
     * @param {*} facingVector new facing direction
     */
    updatePosition(positionVector, facingVector) {
        // this.mesh.position is the actual position of the face
        // it is defined as the positionVector translated by the facingVector
        this.mesh.position.x = positionVector.x + 0.5 * facingVector.x;
        this.mesh.position.y = positionVector.y + 0.5 * facingVector.y;
        this.mesh.position.z = positionVector.z + 0.5 * facingVector.z;
        // translate slightly further so the sticker appears above the cubie's surface
        this.mesh.position.x += this.mesh.position.x > 0 ? 0.001 : -0.001;
        this.mesh.position.y += this.mesh.position.y > 0 ? 0.001 : -0.001;
        this.mesh.position.z += this.mesh.position.z > 0 ? 0.001 : -0.001;

        const axes = Object.values(Axes.POSITIVE);
        axes.forEach((axis) => {
            // find the axis the sticker is currently facing
            if (
                positionVector[axis] === facingVector[axis] &&
                Math.abs(positionVector[axis]) === 1
            ) {
                // for the other two axes
                for (const rest of axes.filter((elt) => elt !== axis)) {
                    // translate slightly inward on that axis (if non-zero)
                    // this centers the sticker on the cubie
                    if (positionVector[rest] === 1) {
                        this.mesh.position[rest] -= 0.025;
                    } else if (positionVector[rest] === -1) {
                        this.mesh.position[rest] += 0.025;
                    }
                }
            }
        });
    }

    /**
     * "Lock" position in place. To be called when a turn is complete.
     *
     * Assumes the fixed vectors are correct and updates the mesh's position
     * and all other vectors to reflect that
     */
    lockPosition() {
        // update position vectors
        const x = Math.round(this.fixedPositionVector.x);
        const y = Math.round(this.fixedPositionVector.y);
        const z = Math.round(this.fixedPositionVector.z);
        this.positionVector = new THREE.Vector3(x, y, z);
        this.fixedPositionVector = new THREE.Vector3(x, y, z);

        // update facing vectors
        this.facingVector = new THREE.Vector3(
            Math.round(this.fixedFacingVector.x),
            Math.round(this.fixedFacingVector.y),
            Math.round(this.fixedFacingVector.z)
        );
        this.fixedFacingVector = new THREE.Vector3(
            this.facingVector.x,
            this.facingVector.y,
            this.facingVector.z
        );

        // set mesh's rotation
        this.mesh.rotation.y = Math.PI * 0.5 * Math.abs(this.facingVector.x);
        this.mesh.rotation.x = Math.PI * 0.5 * Math.abs(this.facingVector.y);
        this.mesh.rotation.z = 0;
    }
    // perform instantaneous 90 degree turn
    turn(axis, dir) {
        var rotationMatrix = getRotationMatrix(axis, dir * Math.PI * 0.5);
        this.fixedFacingVector.applyMatrix3(rotationMatrix);
        this.fixedPositionVector.applyMatrix3(rotationMatrix);
        this.lockPosition();
        this.updatePosition(this.fixedPositionVector, this.fixedFacingVector);
        this.mesh.rotation.y = Math.PI * 0.5 * Math.abs(this.facingVector.x);
        this.mesh.rotation.x = Math.PI * 0.5 * Math.abs(this.facingVector.y);
    }
    // perform a rotation of theta radians
    rotate(axis, theta) {
        var rotationMatrix = getRotationMatrix(axis, theta);
        this.facingVector.applyMatrix3(rotationMatrix);
        this.positionVector.applyMatrix3(rotationMatrix);
        this.updatePosition(this.positionVector, this.facingVector);
        this.mesh.rotateOnWorldAxis(AxisVectors[axis], theta);
    }
    
    // Method to dim the sticker
    dim() {
        gsap.to(this.material, {
            duration: 0.5, // Duration of the dim animation in seconds
            opacity: 0.5,
            onUpdate: () => {
                this.material.transparent = true;
                this.material.needsUpdate = true;
            }
        });
    }

    // Method to reset the sticker's appearance
    reset() {
        gsap.to(this.material, {
            duration: 0.5, // Duration of the reset animation in seconds
            opacity: 1.0,
            onUpdate: () => {
                this.material.transparent = true; // Keep transparent during animation
                this.material.needsUpdate = true;
            },
            onComplete: () => {
                this.material.transparent = false; // Set transparent to false only after animation completes
            }
        });
    }    
}

export default Sticker;
