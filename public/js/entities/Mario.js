import Entity from "../Entity.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import Go from "../traits/Go.js";
import Jump from '../traits/Jump.js';
import Stomper from "../traits/Stomper.js";
import Killable from "../traits/Killable.js";
import { loadSpriteSheet } from '../loaders.js';

const SLOW_DRAG = 1 / 1000;
const FAST_DRAG = 1 / 5000;

// Load functions are asynchronous and create functions are synchronous.
export function loadMario() {
    // Carga los sprites predefinidos de Mario
    // Cuando escribes .then(createMarioFactory), estás diciendo “cuando la promesa se resuelva, entonces ejecuta la función createMarioFactory”. Si escribieras .then(createMarioFactory()), estarías diciendo “ejecuta createMarioFactory ahora y pasa su resultado a .then()”, lo cual no es correcto en este contexto porque quieres que createMarioFactory se ejecute después de que la promesa se resuelva, no inmediatamente.
    return loadSpriteSheet('mario')
        .then(createMarioFactory);
}

function createMarioFactory(sprite) {
    // Scope de createMarioFactory
    const runAnim = sprite.animations.get('run');
    function routeFrame(mario) {
        if (mario.jump.falling) {
            return 'jump';
        }
        if (mario.go.distance > 0) {
            if (mario.vel.x > 0 && mario.go.dir < 0 || mario.vel.x < 0 && mario.go.dir > 0) {
                return 'break';
            }
            return runAnim(mario.go.distance);
        }
        return 'idle';
    }

    function setTurboState(turboOn) {
        this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    }

    return function createMario() {
        const mario = new Entity();
        mario.size.set(14, 16);

        mario.addTrait(new Physics());
        mario.addTrait(new Solid());
        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Stomper());
        mario.addTrait(new Killable());

        mario.killable.removeAfter = 0;

        mario.turbo =  setTurboState;

        mario.draw = drawMario;

        mario.turbo(false);

        return mario;
    }
}
