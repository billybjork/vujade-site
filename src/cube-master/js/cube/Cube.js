import Cubie from "./Cubie.js";
import { Axes } from "./Constants.js";

/**
 * Class to store the meshes for the cubies and stickers comprising a Rubik's Cube.
 */
class Cube {
    /**
     * Construct a new cube.
     * @param {*} scene threejs scene the cube is a part of
     */
    constructor(scene, videoURLs, allVideosLoadedCallback, progressCallback) {
        this.cubies = [];  // Array to store every Cubie object
        this.meshes = [];  // Array to store all the meshes comprising the cube
        this.stickersMap = new Map();  // Map from sticker's mesh uuid to the mesh itself
        this.videoURLs = videoURLs; // Store video URLs

        let videoIndex = 0; // index to track video assignment
        let loadedVideosCount = 0;

        this.videoLoaded = (success = true) => {
            loadedVideosCount++;
            // Calculate the percentage of loaded videos
            const progressPercent = Math.floor((loadedVideosCount / videoURLs.length) * 100);
            progressCallback(progressPercent); // Call the progress callback with the new percentage

            if (loadedVideosCount === videoURLs.length) {
                allVideosLoadedCallback();
            }
        };

        this.videoLoaded = this.videoLoaded.bind(this);

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x !== 0 || y !== 0 || z !== 0) { // ignore the very center cubie
                        let numStickers = (x !== 0) + (y !== 0) + (z !== 0); // calculate number of stickers
                        const cubieVideoURLs = this.videoURLs.slice(videoIndex, videoIndex + numStickers);
                        this.cubies.push(new Cubie(x, y, z, cubieVideoURLs, this.videoLoaded));
                        videoIndex += numStickers;
                    }
                }
            }
        }

        this.cubies.forEach((cubie) => {
            scene.add(cubie.mesh);
            this.meshes.push(cubie.mesh);
            cubie.stickers.forEach((sticker, i) => {
                scene.add(sticker.mesh);
                this.meshes.push(sticker.mesh);
                this.stickersMap.set(sticker.mesh.uuid, sticker);
            });
        });
    }

    /**
     * Perform a given function on every cubie in the cube.
     * @param {*} fn - Function to perform on each cubie.
     */
    forEach(fn) {
        this.cubies.forEach(fn);
    }

    /**
     * Generate and return a unique string representation of the cube state.
     * @returns string representation of the cube state
     */
    repr() {
        // first figure out what stickers are where by examining the cubies array

        // stickers[face][x][y] = sticker at x, y on that face,
        // where faces are ordered up, down, front, back, right, left
        const stickers = [
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
            [
                ["B", "B", "B"],
                ["B", "B", "B"],
                ["B", "B", "B"],
            ],
        ];

        // construct the repr from the extracted stickers data
        let cubeRepr = "";
        stickers.forEach((sticker) => {
            sticker.forEach((line) => {
                cubeRepr += line.join("");
            });
        });

        return cubeRepr;
    }

    /**
     * Initiate the animation for the requested move.
     *
     * The move string should correspond to standard cube notation.
     *
     * @param {string} moveStr Move to perform
     */
    move(moveStr) {
        switch (moveStr) {
            case "U":
                this.moveLayer(Axes.POSITIVE.Y, 1, 1);
                return;
            case "U'":
                this.moveLayer(Axes.POSITIVE.Y, 1, -1);
                return;
            case "u":
                this.moveLayer(Axes.POSITIVE.Y, 1, 1);
                this.moveLayer(Axes.POSITIVE.Y, 0, -1);
                return;
            case "u'":
                this.moveLayer(Axes.POSITIVE.Y, 1, -1);
                this.moveLayer(Axes.POSITIVE.Y, 0, 1);
                return;
            case "D":
                this.moveLayer(Axes.POSITIVE.Y, -1, 1);
                return;
            case "D'":
                this.moveLayer(Axes.POSITIVE.Y, -1, -1);
                return;
            case "d":
                this.moveLayer(Axes.POSITIVE.Y, -1, 1);
                this.moveLayer(Axes.POSITIVE.Y, 0, 1);
                return;
            case "d'":
                this.moveLayer(Axes.POSITIVE.Y, -1, -1);
                this.moveLayer(Axes.POSITIVE.Y, 0, -1);
                return;
            case "F":
                this.moveLayer(Axes.POSITIVE.Z, 1, 1);
                return;
            case "F'":
                this.moveLayer(Axes.POSITIVE.Z, 1, -1);
                return;
            case "f":
                this.moveLayer(Axes.POSITIVE.Z, 1, 1);
                this.moveLayer(Axes.POSITIVE.Z, 0, 1);
                return;
            case "f'":
                this.moveLayer(Axes.POSITIVE.Z, 1, -1);
                this.moveLayer(Axes.POSITIVE.Z, 0, -1);
                return;
            case "B":
                this.moveLayer(Axes.POSITIVE.Z, -1, 1);
                return;
            case "B'":
                this.moveLayer(Axes.POSITIVE.Z, -1, -1);
                return;
            case "b":
                this.moveLayer(Axes.POSITIVE.Z, -1, 1);
                this.moveLayer(Axes.POSITIVE.Z, 0, -1);
                return;
            case "b'":
                this.moveLayer(Axes.POSITIVE.Z, -1, -1);
                this.moveLayer(Axes.POSITIVE.Z, 0, 1);
                return;
            case "R":
                this.moveLayer(Axes.POSITIVE.X, 1, 1);
                return;
            case "R'":
                this.moveLayer(Axes.POSITIVE.X, 1, -1);
                return;
            case "r":
                this.moveLayer(Axes.POSITIVE.X, 1, 1);
                this.moveLayer(Axes.POSITIVE.X, 0, -1);
                return;
            case "r'":
                this.moveLayer(Axes.POSITIVE.X, 1, -1);
                this.moveLayer(Axes.POSITIVE.X, 0, 1);
                return;
            case "L":
                this.moveLayer(Axes.POSITIVE.X, -1, 1);
                return;
            case "L'":
                this.moveLayer(Axes.POSITIVE.X, -1, -1);
                return;
            case "l":
                this.moveLayer(Axes.POSITIVE.X, -1, 1);
                this.moveLayer(Axes.POSITIVE.X, 0, 1);
                return;
            case "l'":
                this.moveLayer(Axes.POSITIVE.X, -1, -1);
                this.moveLayer(Axes.POSITIVE.X, 0, -1);
                return;
            case "M":
                this.moveLayer(Axes.POSITIVE.X, 0, 1);
                return;
            case "M'":
                this.moveLayer(Axes.POSITIVE.X, 0, -1);
                return;
            case "E":
                this.moveLayer(Axes.POSITIVE.Y, 0, 1);
                return;
            case "E'":
                this.moveLayer(Axes.POSITIVE.Y, 0, -1);
                return;
            case "S":
                this.moveLayer(Axes.POSITIVE.Z, 0, 1);
                return;
            case "S'":
                this.moveLayer(Axes.POSITIVE.Z, 0, -1);
                return;
            case "x":
            case "X":
                this.moveLayer(Axes.POSITIVE.X, -1, -1);
                this.moveLayer(Axes.POSITIVE.X, 0, -1);
                this.moveLayer(Axes.POSITIVE.X, 1, 1);
                return;
            case "x'":
            case "X'":
                this.moveLayer(Axes.POSITIVE.X, -1, 1);
                this.moveLayer(Axes.POSITIVE.X, 0, 1);
                this.moveLayer(Axes.POSITIVE.X, 1, -1);
                return;
            case "y":
            case "Y":
                this.moveLayer(Axes.POSITIVE.Y, -1, -1);
                this.moveLayer(Axes.POSITIVE.Y, 0, -1);
                this.moveLayer(Axes.POSITIVE.Y, 1, 1);
                return;
            case "y'":
            case "Y'":
                this.moveLayer(Axes.POSITIVE.Y, -1, 1);
                this.moveLayer(Axes.POSITIVE.Y, 0, 1);
                this.moveLayer(Axes.POSITIVE.Y, 1, -1);
                return;
            case "z":
            case "Z":
                this.moveLayer(Axes.POSITIVE.Z, -1, -1);
                this.moveLayer(Axes.POSITIVE.Z, 0, 1);
                this.moveLayer(Axes.POSITIVE.Z, 1, 1);
                return;
            case "z'":
            case "Z'":
                this.moveLayer(Axes.POSITIVE.Z, -1, 1);
                this.moveLayer(Axes.POSITIVE.Z, 0, -1);
                this.moveLayer(Axes.POSITIVE.Z, 1, -1);
                return;
            default:
                console.warn(`Unhandled move: ${moveStr}`);
                // Handle the unexpected moveStr, e.g., by ignoring it or logging a warning.
                break;
        }
    }

    /**
     * Initiate the animation for the given layer of the cube.
     *
     * dir = -1 indicates a counter clockwise turn, and
     * dir = 1 indicates a clockwise turn.
     *
     * @param {*} axis axis used to identify pieces to turn
     * @param {*} axisValue sign (-1, 0, or 1) of the axis to identify pieces to turn
     * @param {*} dir direction (-1 or 1) to turn pieces
     * @returns a function that triggers the requested outer layer turn
     */
    moveLayer(axis, axisValue, dir) {
        // have axisValue change animDir only if non-zero
        let animDir = dir;
        // performing an outer layer turn
        if (axisValue !== 0) animDir *= -1 * axisValue;
        // performing a slice move, so the dir is a bit trickier to determine
        else if (axis === Axes.POSITIVE.Z) {
            // S slice gets the opposite sign
            animDir *= -1;
        }

        // turn all pieces who are positioned in the correct layer
        this.cubies.forEach((cubie) => {
            if (cubie.positionVector[axis] === axisValue) {
                cubie.animating = true;
                cubie.angle = 0;
                cubie.animateAxis = axis;
                cubie.animateDir = animDir;
            }
        });
    }
}

export default Cube;