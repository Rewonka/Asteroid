function Ship(color){
    this.pos = createVector(width/2, height/2);
    this.r = 20;
    this.heading = PI/2;
    this.rotation = 0;
    this.vel = createVector(0,0);
    this.isBoosting = false;
    this.color = color;
    
    
    
    this.boosting = function(b){
        this.isBoosting = b;
    }
    
    this.applyForce = function(force) {
        this.vel.add(force);
    }
   
    //gravitácioval probálkoztam
   // this.checkLanding = function(){
   //    if ((this.pos-this.r) > (height - this.r)) {
    //        this.vel.y *= -0.9;
    //        
    //    }
    //}
    
    this.update = function() {
        if (this.isBoosting){
            this.boost();
        }
        this.pos.add(this.vel);
        this.vel.mult(0.98);
        
    }
    
    this.boost = function(){
        var force = p5.Vector.fromAngle(this.heading);
        force.mult(0.3);
        this.vel.add(force);
        
    }
    
    this.render = function() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading + PI / 2);
        fill(this.color);
        stroke(255);
        triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
        line(this.r-20,this.r-1,this.r-20,this.r-30);
        if(this.isBoosting){
            line(this.r-(this.r-3),this.r+5,this.r-(this.r),this.r);
            line(this.r-(this.r+3),this.r+5,this.r-(this.r),this.r);
        }
        pop();
    }
    
    this.edges = function(){
        if (this.pos.x > width + this.r){
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r){
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r){
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r){
            this.pos.y = height + this.r;
        }
        
    }
    
    
    this.setRotation = function(a){
        this.rotation = a;
    }
    
    this.turn = function(){
        this.heading += this.rotation;
        
    }
}