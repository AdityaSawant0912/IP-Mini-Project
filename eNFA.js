class eNFA {
    constructor(expression) {
        this.expression = expression;
        this.tree = [];
        this.finalTree = [];
        this.connections = [];
        this.count = 0;
    }

    union(b, a) {
        let arr = []
        console.log(a);
        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            arr.push(new State(this.count++))
            this.connections.push([EPSILON, this.count, this.count + 1])
            arr.push(new State(this.count++))
        }
        else {
            a.forEach(state => {
                arr.push(state);
            });
            this.connections.push([EPSILON, a[a.length - 1].id, this.count])

        }
        if (isOperand(b)) {
            this.connections.push([b, this.count, this.count + 1])
            arr.push(new State(this.count++))
        }
        else {
            this.connections.push([EPSILON, this.count, b[0].id])
            b.forEach(state => {
                arr.push(state);
            });
        }
        arr.push(new State(this.count++))
        return arr;
    }

    or(b, a) {
        let arr = [];
        let start;
        let aEnd;
        let bEnd;
        if (isOperand(a))
            this.connections.push([EPSILON, this.count, this.count + 1])
        start = this.count
        arr.push(new State(this.count++))

        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            arr.push(new State(this.count++))
            aEnd = this.count;
            arr.push(new State(this.count++))
        } else {
            this.connections.push([EPSILON, start, a[0].id]);
            a.forEach(state => {
                arr.push(state);
            });
            aEnd = a[a.length - 1].id;
        }
        if (isOperand(b)) {
            this.connections.push([EPSILON, start, this.count])
            this.connections.push([b, this.count, this.count + 1])
            arr.push(new State(this.count++))
            bEnd = this.count;
            arr.push(new State(this.count++))
        } else {
            this.connections.push([EPSILON, this.count, b[0].id]);
            b.forEach(state => {
                arr.push(state);
            });
            bEnd = b[b.length - 1].id;
        }
        console.log(aEnd, bEnd);
        this.connections.push([EPSILON, aEnd, this.count])
        this.connections.push([EPSILON, bEnd, this.count])
        arr.push(new State(this.count++))
        return arr;
    }

    closure(a) {
        let arr = [];
        let start;
        if (isOperand(a)) {
            this.connections.push([EPSILON, this.count, this.count + 1])
        }
        start = this.count;
        arr.push(new State(this.count++))
        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            this.connections.push([EPSILON, this.count + 1, this.count])
            arr.push(new State(this.count++))
            this.connections.push([EPSILON, this.count, this.count + 1])
            this.connections.push([EPSILON, start, this.count + 1])
            arr.push(new State(this.count++))
            arr.push(new State(this.count++))

        } else {
            this.connections.push([EPSILON, start, a[0].id]);
            this.connections.push([EPSILON, a[a.length - 1].id, a[0].id]);
            a.forEach(state => {
                arr.push(state);
            });
            this.connections.push([EPSILON, a[a.length - 1].id, this.count])
            this.connections.push([EPSILON, start, this.count])
            arr.push(new State(this.count++))
        }
        return arr;
    }

    calculateTree() {
        let stack = [];
        let exp = this.expression.split('')
        exp.forEach(letter => {
            if (isOperand(letter))
                stack.push(letter)
            else {
                switch (letter) {
                    case '.':
                        stack.push(this.union(stack.pop(), stack.pop()))
                        break;
                    case '+':
                        stack.push(this.or(stack.pop(), stack.pop()))
                        break;
                    case '*':
                        stack.push(this.closure(stack.pop()))
                        break;

                    default:
                        break;
                }
            }
        })

        this.tree = stack[0]
    }

    generateTree() {
        let cState = 0;
        let states1 = [];
        let states2 = [];
        let pX = 125;
        let pY = 150;
        let j;
        let curr, newState;
        for (let i = 0; i < this.connections.length; i++) {

            if (!this.finalTree[this.connections[i][1]]) {
                newState = new State(i, false, false);
                newState.show = cState;
                newState.x = pX;
                newState.y = pY;
                this.finalTree.push(newState);
                states1.push(cState)
                cState++
                pX += 125
            }
            
            if(states2.includes(this.connections[i][1]) && states2.includes(this.connections[i][2])){
                this.finalTree[this.connections[i][2]].y += 100
            }
            
            if (!this.finalTree[this.connections[i][2]]) {
                newState = new State(i, false, false);
                newState.show = cState;
                newState.x = pX;
                newState.y = pY;
                pX += 125
                console.log(i, this.connections[i][1], states2.includes(2));
                if (states2.includes(this.connections[i][1])) {
                    console.log("here");
                    newState.x = this.finalTree[this.connections[i][1]].x + 125;
                    newState.y = this.finalTree[this.connections[i][1]].y;
                }
                this.finalTree.push(newState);
                states2.push(cState)
                cState++
            }

            if (this.finalTree[this.connections[i][1]] && states1.includes(this.connections[i][1]) && i > 0) {
                j = i - 1;
                while (this.connections[j][1] != this.connections[i][1] && j > 0) {
                    this.finalTree[this.connections[j][1]].y -= 100;
                    this.finalTree[this.connections[j][2]].y -= 100;
                    // this.finalTree[this.connections[j][2]].y -= 50;
                    j--;
                }
                this.finalTree[this.connections[i][2]].y += 100;
                this.finalTree[this.connections[i][2]].x = this.finalTree[this.connections[i][1]].x + 125;
                pX = this.finalTree[this.connections[i][2]].x + 125;
                pY = this.finalTree[this.connections[i][2]].y;
            }
            

        }
        this.finalTree[0].isStart = true;
        this.finalTree[this.finalTree.length - 1].isFinal = true;
    }

}