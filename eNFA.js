let pX = 100;
let pY = 100;
let alast;
const SPACE = 100;

class eNFA {
    constructor(expression) {
        this.expression = expression;
        this.tree = [];
        this.finalTree = [];
        this.connections = [];
        this.count = 0;
        this.arrows = [];
    }

    union(b, a) {
        let arr = []
        console.log(a);
        let aEnd;
        let bEnd;
        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            // arr.push(new State(this.count++))
            this.createState(arr, this.count++, this.count - 1, pX, pY)
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
            aEnd = arr[arr.length - 1].id
            // arr.push(new State(this.count++))
        }
        else {
            a.forEach(state => {
                arr.push(state);
            });
            aEnd = arr[arr.length - 1].id
            this.connections.push([EPSILON, a[a.length - 1].id, this.count])

        }
        if (isOperand(b)) {
            this.connections.push([EPSILON, aEnd,this.count])
            this.connections.push([b, this.count, this.count + 1])
            // arr.push(new State(this.count++))
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, pY)
        }
        else {
            this.connections.push([EPSILON, aEnd, b[0].id])
            let tempX = b[0].x
            let tempY = b[0].y
            b[0].x = arr[arr.length - 1].x + SPACE;
            b[0].y = arr[arr.length - 1].y;
            arr.push(b[0])
            for (let i = 1; i < b.length; i++) {
                let state = b[i];
                state.x = b[0].x + state.x - tempX;
                state.y = b[0].y + state.y - tempY;
                arr.push(state)
            }
        }
        // arr.push(new State(this.count++))
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
        this.createState(arr, this.count++, this.count - 1, pX, pY)
        // arr.push(new State(this.count++))
        let xL = arr[arr.length - 1].x
        let yL = arr[arr.length - 1].y
        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            // arr.push(new State(this.count++))
            this.createState(arr, this.count++, this.count - 1, xL + SPACE, yL - SPACE)
            aEnd = this.count;
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
            aEnd = this.count - 1;
        } else {
            this.connections.push([EPSILON, start, a[0].id]);
            
            let aB = a[0].y;
            
            for (let i = 1; i < a.length; i++) {
                if(a[i].y > aB){
                    aB = a[i].y;
                }
            }
            
            let tempX = a[0].x
            let tempY = a[0].y
            a[0].x = xL + SPACE;
            a[0].y = yL - SPACE + tempY - aB;
            arr.push(a[0])
            for (let i = 1; i < a.length; i++) {
                let state = a[i];
                state.x = a[0].x + state.x - tempX;
                state.y = a[0].y + state.y - tempY;
                arr.push(state)
            }
            aEnd = a[a.length - 1].id;
        }
        alast = arr[arr.length - 1].x
        if (isOperand(b)) {
            this.connections.push([EPSILON, start, this.count])
            this.connections.push([b, this.count, this.count + 1])
            this.createState(arr, this.count++, this.count - 1, xL + SPACE, yL + SPACE)
            bEnd = this.count;
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
        } else {
            this.connections.push([EPSILON, this.count, b[0].id]);
            
            let bB = b[0].y;
            
            for (let i = 1; i < b.length; i++) {
                if(a[i].y < bB){
                    bB = b[i].y;
                }
            }

            let tempX = b[0].x
            let tempY = b[0].y
            b[0].x = xL + SPACE;
            b[0].y = yL + SPACE + SPACE + tempY - bB;
            arr.push(b[0])
            for (let i = 1; i < b.length; i++) {
                let state = b[i];
                state.x = b[0].x + state.x - tempX;
                state.y = b[0].y + state.y - tempY;
                arr.push(state)
            }
            bEnd = b[b.length - 1].id;
        }
        if (alast < arr[arr.length - 1].x) 
            alast = arr[arr.length - 1].x
        console.log(aEnd, bEnd);
        this.connections.push([EPSILON, aEnd, this.count])
        this.connections.push([EPSILON, bEnd, this.count])
        this.createState(arr, this.count++, this.count - 1, alast + SPACE, yL)
        return arr;
    }

    closure(a) {
        let arr = [];
        let start;
        if (isOperand(a)) {
            this.connections.push([EPSILON, this.count, this.count + 1])
        }
        start = this.count;
        this.createState(arr, this.count++, this.count - 1, pX, pY)
        if (isOperand(a)) {
            this.connections.push([a, this.count, this.count + 1])
            this.connections.push([EPSILON, this.count + 1, this.count])
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
            this.connections.push([EPSILON, this.count, this.count + 1])
            this.connections.push([EPSILON, start, this.count + 1])
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)

        } else {
            this.connections.push([EPSILON, start, a[0].id]);
            this.connections.push([EPSILON, a[a.length - 1].id, a[0].id]);
            let tempX = a[0].x
            let tempY = a[0].y
            a[0].x = arr[arr.length - 1].x + SPACE;
            a[0].y = arr[arr.length - 1].y;
            arr.push(a[0])
            for (let i = 1; i < a.length; i++) {
                let state = a[i];
                state.x = a[0].x + state.x - tempX;
                state.y = a[0].y + state.y - tempY;
                arr.push(state)
            }
            this.connections.push([EPSILON, a[a.length - 1].id, this.count])
            this.connections.push([EPSILON, start, this.count])
            this.createState(arr, this.count++, this.count - 1, arr[arr.length - 1].x + SPACE, arr[arr.length - 1].y)
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
        for (let i = 0; i < this.tree.length; i++) {
            this.tree[i].show = i;
        }
    }
    
    reID(){
        if (this.tree[0].id == 0)
            return;
        else{
            let id = this.tree[0].id;
            for (let i = 0; i < id ; i++) {
                console.log(this.tree[this.getID(this.tree, i)].id);
                this.tree[this.getID(this.tree, i)].id += 1;
            }
            this.tree[this.getID(this.tree, id)].id = 0;
            console.log("Asd");
            console.log(this.tree);
        }
    }

    
    
    createState(tree, id, show, x, y){
        // console.log(show);
        tree.push(new State(id, false, false));
        tree[tree.length - 1].show = show;
        tree[tree.length - 1].x = x;
        tree[tree.length - 1].y = y;
    }
    getID(tree, s){
        for (let i = 0; i < tree.length; i++) {
            if(tree[i].show == s){
                return i;
            }
        }
        return 0;
    }
    
    
    calculateArrows(){
        
    }
    
}