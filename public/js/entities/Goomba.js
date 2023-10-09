import Entity, {Sides} from "../Entity.js";
import PendulumWalk from "../traits/PendulumWalk.js"; 
import { loadSpriteSheet } from '../loaders.js';

// Load functions are asynchronous and create functions are synchronous.
export function loadGoomba() {
    return loadSpriteSheet('goomba')
        .then(createGoombaFactory);
}

function createGoombaFactory(sprite) {
    // Scope de createGoombaFactory

    const walkAnim = sprite.animations.get('walk');

    function drawGoomba(context) {
        sprite.draw(walkAnim(this.lifetime), context, 0, 0);
    }

    return function createGoomba() {
        const goomba = new Entity();
        goomba.size.set(16, 16);

        goomba.addTrait(new PendulumWalk());

        goomba.draw = drawGoomba;

        return goomba;
    }
}