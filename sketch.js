var gravity;
var shipOne;
var shipTwo;
var asteroids = [];
var lasersOne = [];
var lasersTwo = [];

var socket;
var playerType = 'spectator';
var myShip;
var remoteShip;
var myLasers;
var remoteLasers;

function setup() {
    createCanvas(windowWidth, windowHeight);
    gravity = createVector(0, 0.09);
    shipOne = new Ship(10);
    shipTwo = new Ship(70);

    for (i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }

    socket = io();
    socket.on('playerType', function(type){
        playerType = type;
        if(type === 'p1') {
            myShip = shipOne;
            myLasers = lasersOne;
            remoteShip = shipTwo;
            remoteLasers = lasersTwo;
        } else if(type === 'p2') {
            myShip = shipTwo;
            myLasers = lasersTwo;
            remoteShip = shipOne;
            remoteLasers = lasersOne;
        } else {
            myShip = shipOne;
            remoteShip = shipTwo;
            myLasers = lasersOne;
            remoteLasers = lasersTwo;
        }
    });

    socket.on('state', function(data){
        if(data.id !== playerType){
            var ship = data.id === 'p1' ? shipOne : shipTwo;
            ship.pos.x = data.state.x;
            ship.pos.y = data.state.y;
            ship.heading = data.state.heading;
            ship.rotation = data.state.rotation;
            ship.isBoosting = data.state.isBoosting;
            ship.lifebar = data.state.lifebar;
        }
    });

    socket.on('shoot', function(data){
        if(data.id !== playerType){
            var arr = data.id === 'p1' ? lasersOne : lasersTwo;
            arr.push(new Laser(createVector(data.x, data.y), data.heading));
        }
    });
}

function draw() {
    background(0);

    for (var i = lasersOne.length - 1; i >= 0; i--) {
        lasersOne[i].render();
        lasersOne[i].update();
        if (lasersOne[i].offscreen()) {
            lasersOne.splice(i, 1);
        }
        if (lasersOne.length >= 1) {
            if (pointInTriangle(lasersOne[i], shipTwo)) {
                shipTwo.lifebar -= 10;
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
                shipOne.lifebar -= 10;
                lasersTwo.splice(i, 1);
            }
        }
    }

    if (myShip) {
        myShip.render();
        myShip.turn();
        myShip.update();
        myShip.edges();
    }

    if (remoteShip && playerType !== 'spectator') {
        remoteShip.render();
    }

    if (playerType === 'p1' || playerType === 'p2') {
        socket.emit('state', {
            x: myShip.pos.x,
            y: myShip.pos.y,
            heading: myShip.heading,
            rotation: myShip.rotation,
            isBoosting: myShip.isBoosting,
            lifebar: myShip.lifebar
        });
    }
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
    if (playerType === 'p1') {
        if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
            shipOne.setRotation(0);
        } else if (keyCode == UP_ARROW) {
            shipOne.boosting(false);
        }
    } else if (playerType === 'p2') {
        if (keyCode == 65 || keyCode == 68) {
            shipTwo.setRotation(0);
        } else if (keyCode == 87) {
            shipTwo.boosting(false);
        }
    }
}

function keyPressed() {
    if (playerType === 'p1') {
        if (key == ' ') {
            lasersOne.push(new Laser(shipOne.pos.copy(), shipOne.heading));
            socket.emit('shoot', { id: 'p1', x: shipOne.pos.x, y: shipOne.pos.y, heading: shipOne.heading });
        } else if (keyCode == RIGHT_ARROW) {
            shipOne.setRotation(0.1);
        } else if (keyCode == LEFT_ARROW) {
            shipOne.setRotation(-0.1);
        } else if (keyCode == UP_ARROW) {
            shipOne.boosting(true);
        }
    } else if (playerType === 'p2') {
        if (keyCode == 48) {
            lasersTwo.push(new Laser(shipTwo.pos.copy(), shipTwo.heading));
            socket.emit('shoot', { id: 'p2', x: shipTwo.pos.x, y: shipTwo.pos.y, heading: shipTwo.heading });
        } else if (keyCode == 68) {
            shipTwo.setRotation(0.1);
        } else if (keyCode == 65) {
            shipTwo.setRotation(-0.1);
        } else if (keyCode == 87) {
            shipTwo.boosting(true);
        }
    }
}
