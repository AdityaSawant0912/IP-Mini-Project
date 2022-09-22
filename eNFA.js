class eNFA {
    constructor(expression) {
        this.expression = expression;
        this.tree = [];
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
            this.connections.push([EPSILON,a[a.length -1].id, this.count])
            
        }
        if (isOperand(b)) {
            this.connections.push([b, this.count, this.count + 1])
            arr.push(new State(this.count++))
        }
        else {
            this.connections.push([EPSILON,this.count, b[0].id])
            b.forEach(state => {
                arr.push(state);
            });
        }
        arr.push(new State(this.count++))
        return arr;
    }
    
    or(b, a){
        let arr = [];
        let start;
        let aEnd;
        let bEnd;
        if(isOperand(a))
            this.connections.push([EPSILON, this.count, this.count + 1])
        start = this.count
        arr.push(new State(this.count++))
        
        if(isOperand(a)){
            this.connections.push([a, this.count, this.count + 1])
            arr.push(new State(this.count++))
            aEnd = this.count;
            arr.push(new State(this.count++))
        }else{
            this.connections.push([EPSILON,start, a[0].id]);
            a.forEach(state => {
                arr.push(state);
            });
            aEnd = a[a.length - 1].id;
        }
        if(isOperand(b)){
            this.connections.push([EPSILON, start, this.count])
            this.connections.push([b, this.count, this.count + 1])
            arr.push(new State(this.count++))
            bEnd = this.count;
            arr.push(new State(this.count++))
        }else{
            this.connections.push([a, this.count, b[0].id]);
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
    
    closure(a){
        let arr = [];
        let start;
        if(isOperand(a)){
            this.connections.push([EPSILON, this.count, this.count + 1])
        }
        start = this.count;
        arr.push(new State(this.count++))
        if(isOperand(a)){
            this.connections.push([a, this.count, this.count + 1])
            this.connections.push([EPSILON, this.count + 1, this.count])
            arr.push(new State(this.count++))
            this.connections.push([EPSILON, this.count, this.count + 1])
            this.connections.push([EPSILON, start, this.count + 1])
            arr.push(new State(this.count++))
            arr.push(new State(this.count++))
            
        }else{
            this.connections.push([EPSILON,start, a[0].id]);
            this.connections.push([EPSILON,a[a.length - 1].id, a[0].id]);
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
}