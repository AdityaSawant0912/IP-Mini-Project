


class State {
    constructor(id, isStart = false, isFinal = false){
        this.id = id;
        this.isStart = isStart;
        this.isFinal = isFinal;
        this.x = 0;
        this.y = 0;
    }
    
    draw(){
        push();
        if (this.isStart) {
            if(this.isFinal)
                drawArrow(createVector(this.x - 100, this.y), createVector(100 + FINAL_RAD - 3 - RAD,0));
            else
                drawArrow(createVector(this.x - 100, this.y), createVector(100 - RAD/2 - 5,0));
        
        }
        
        stroke(0);
        strokeWeight(4);
        if (this.isFinal) {
            fill(255);
            circle(this.x, this.y, RAD + FINAL_RAD);
        }   
        fill(200);
        circle(this.x, this.y, RAD);
        fill(255);
        textSize(RAD-15);
        textAlign(CENTER);
        fill(0);
        noStroke()
        text(`q${this.id}`, this.x, this.y + 10)
        pop();
        
    }
}