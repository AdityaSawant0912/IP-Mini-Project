let stack = [];

function isOperand(letter) {
    return ((letter >= 'a' && letter <= 'z') || (letter >= 'A' && letter <= 'Z') || (letter >= '0' && letter <= '9'));
}


function prec(letter) {
    switch(letter) {
        case '.':
        return 1
        case '+':
        return 2
        case '*':
        return 3
            
        default:
        break;
    }
}

function InfixToPostfix(exp) {
    exp = exp.split('');
    let k = -1
    for (let i = 0; exp[i]; ++i) {
        if (isOperand(exp[i])) {
            exp[++k] = exp[i];
        }
        
        else if (exp[i] == '(')
            stack.push(exp[i]);
        
        else if (exp[i] == ')'){
            while(stack.length > 0 && stack[stack.length - 1] != '(')
                exp[++k] = stack.pop();
            if (stack.length > 0 && stack[stack.length - 1] != '(')
                return -1;
            else
                stack.pop();
        }
        else{
            while(stack.length > 0 && prec(exp[i]) <= prec(stack[stack.length - 1]) )
                exp[++k] = stack.pop();
            stack.push(exp[i]);
        }
    }
                
    while(stack.length > 0)
        exp[++k] = stack.pop();
    exp = exp.splice(0, ++k);
    exp = exp.join('')
    return exp
}