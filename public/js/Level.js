import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./EntityCollider.js";

export default class Level {
    constructor() {
        this.gravity = 1500;
        this.totalTime = 0;

        this.comp = new Compositor();
        this.entities = new Set();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime) {
        // Update
        this.entities.forEach(entity => {
            entity.update(deltaTime, this);
        });

        // Test Collision
        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        // Finalize
        this.entities.forEach(entity => {
            entity.finalize();
        });

        this.totalTime += deltaTime;
    }
}