var gravity;
var shipOne;
var shipTwo;
var asteroids = [];
var lasersOne = [];
var lasersTwo = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    gravity = createVector(0, 0.09);
    shipOne = new Ship(10);
    shipTwo = new Ship(70);

    for (i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
}

function draw() {
    background(0);

    //for (var i = 0; i < asteroids.length; i++){
    //    asteroids[i].render();
    //    asteroids[i].update();
    //    asteroids[i].edges();
    //}
    for (var i = lasersOne.length - 1; i >= 0; i--) {
        lasersOne[i].render();
        lasersOne[i].update();
        if (lasersOne[i].offscreen()) {
            lasersOne.splice(i, 1);
        }
        //if (lasersOne[i].hits(shipTwo)) {
        //    console.log("Hit!");
        //}
        if (lasersOne.length >= 1) {
            if (pointInTriangle(lasersOne[i], shipTwo)) {
                console.log("Ship Two HIT!");
                lasersOne.splice(i, 1);
            }
        }

    }

    for (var i = lasersTwo.length - 1; i >= 0; i--) {
        lasersTwo[i].render();
        lasersTwo[i].update();
        if (lasersTwo[i].offscreen()) {
            lasersTwo.splice(i, 1);
        }
        if (lasersTwo.length >= 1) {
            if (pointInTriangle(lasersTwo[i], shipOne)) {
                console.log("Ship One HIT!");
                lasersTwo.splice(i, 1);
            }
        }
    }



    shipOne.render();
    shipOne.turn();
    shipOne.update();
    //shipOne.applyForce(gravity);
    shipOne.edges();
    //ship.checkLanding();

    shipTwo.render();
    shipTwo.turn();
    shipTwo.update();
    shipTwo.edges();
    //console.log(shipOne.pos);

}

function sign(p1x, p1y, p2x, p2y, p3x, p3y) {
    return (p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y);
}

function pointInTriangle(laser, ship) {
    var b1;
    var b2;
    var b3;

    //b1 = sign(pt, v1, v2) < 0.0f;
    //b2 = sign(pt, v2, v3) < 0.0f;
    //b3 = sign(pt, v3, v1) < 0.0f;

    //return ((b1 == b2) && (b2 == b3));
    //triangle(-this.r, this.r, this.r, this.r, 0, -this.r);

    b1 = Boolean(sign(laser.pos.x, laser.pos.y, ship.pos.x - 20, ship.pos.y + 20, ship.pos.x + 20, ship.pos.y + 20) < 0.0);
    b2 = Boolean(sign(laser.pos.x, laser.pos.y, ship.pos.x + 20, ship.pos.y + 20, ship.pos.x, ship.pos.y - 20) < 0.0);
    b3 = Boolean(sign(laser.pos.x, laser.pos.y, ship.pos.x, ship.pos.y - 20, ship.pos.x - 20, ship.pos.y + 20) < 0.0);

    //console.log('B1:'+b1,'B2:'+b2,'B3:'+b3);
    return ((b1 == b2) && (b2 == b3));

}

function keyReleased() {
    if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
        shipOne.setRotation(0);
    } else if (keyCode == UP_ARROW) {
        shipOne.boosting(false);
    } else if (keyCode == 65 || keyCode == 68) {
        shipTwo.setRotation(0);
    } else if (keyCode == 87) {
        shipTwo.boosting(false);
    }
}

function keyPressed() {
    if (key == ' ') {
        lasersOne.push(new Laser(shipOne.pos, shipOne.heading));
    } else if (keyCode == RIGHT_ARROW) {
        shipOne.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW) {
        shipOne.setRotation(-0.1);
    } else if (keyCode == UP_ARROW) {
        shipOne.boosting(true);
        //shipTwo.boosting(true);
    } else if (keyCode == 48) {
        lasersTwo.push(new Laser(shipTwo.pos, shipTwo.heading));
    } else if (keyCode == 68) {
        shipTwo.setRotation(0.1);
    } else if (keyCode == 65) {
        shipTwo.setRotation(-0.1);
    } else if (keyCode == 87) {
        shipTwo.boosting(true);
    }
}
