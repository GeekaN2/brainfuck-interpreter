const fs = require('fs');
let code = fs.readFileSync('input.txt').toString();
let output = fs.createWriteStream('output.txt');

class Befunge {
    // Items (only numbers) to be placed in the stack
    stack = [];

    // Dynamic matrix of code
    // Sometimes we will need to replace elements or add them
    map = [[]];

    // Push each character's ASCII value all the way from " to the next "
    stringMode = false;

    // Pointers
    row = 0;
    column = 0;

    // Direction: right, up, left, down
    direction = 'right';

    // Simple output string
    output = '';

    // Converting code to a map
    constructor(code) {
        for (let r = 0, c = 0, i = 0; i < code.length; i++){
            if (code[i] == '\n'){
                r++;
                c = 0;
                this.map[r] = [];
            } else {
                this.map[r][c] = code[i];
                c++;
            }
        }
    }

    // Get current element from code map
    get currentElement() {
        if (this.map[this.row] == undefined){
            this.map[this.row] = [];
        }
        if (this.map[this.row][this.column] == undefined) {
            this.map[this.row][this.column] = ' ';
        }
        return this.map[this.row][this.column];
    }

    // If the element doesn't' exist but must be
    checkAndCreateElement(x, y) {
        if (this.map[x] == undefined) {
            this.map[x] = [];
        }
        if (this.map[x][y] == undefined) {
            this.map[x][y] = ' ';
        }
    }
}

var befunge = new Befunge(code);

// a.k.a function main() {}
while(befunge.currentElement != '@' && befunge.column >= 0 && befunge.row >= 0 && befunge.column <= 80 && befunge.row <= 25) {
    if (befunge.stringMode && befunge.currentElement != '"') {
        befunge.stack.push(befunge.currentElement.charCodeAt(0));
    } else {
        if (befunge.currentElement.toString().charCodeAt() >= 48 && befunge.currentElement.toString().charCodeAt() <= 57) {
            befunge.stack.push(Number(befunge.currentElement));
        }
        let temp, rnd, x, y;
        switch(befunge.currentElement) {
            case '>': befunge.direction = 'right'; break;
            case 'v': befunge.direction = 'down'; break;
            case '<': befunge.direction = 'left'; break;
            case '^': befunge.direction = 'up'; break;
            case '*': befunge.stack.push(befunge.stack.pop() * befunge.stack.pop()); break;
            case '+': befunge.stack.push(befunge.stack.pop() + befunge.stack.pop()); break;
            case '-': temp = befunge.stack.pop(); befunge.stack.push(befunge.stack.pop() - temp); break;
            case '/': temp = befunge.stack.pop(); befunge.stack.push(temp != 0 ? Math.floor(befunge.stack.pop() / temp) : 0); break;
            case '%': temp = befunge.stack.pop(); befunge.stack.push(temp != 0 ? befunge.stack.pop() % temp: 0); break;
            case '!': befunge.stack.push(befunge.stack.pop() == 0 ? 1 : 0); break;
            case '`': befunge.stack.push(befunge.stack.pop() < befunge.stack.pop() ? 1 : 0); break;
            case '_': befunge.direction = befunge.stack.pop() == 0 ? 'right' : 'left'; break;
            case '|': befunge.direction = befunge.stack.pop() == 0 ? 'down' : 'up'; break;
            case '$': befunge.stack.pop(); break;
            case '"': befunge.stringMode = !befunge.stringMode; break;
            case ':': temp = befunge.stack.pop(); temp != undefined ? befunge.stack.push(temp, temp) : befunge.stack.push(0); break;
            case '\\': befunge.stack.length == 1 ?  befunge.push(befunge.stack.pop(), 0) : befunge.stack.push(befunge.stack.pop(), befunge.stack.pop()); break;
            case 'g':
                x = befunge.stack.pop()
                y = befunge.stack.pop()
                befunge.checkAndCreateElement(x, y);
                befunge.stack.push(befunge.map[x][y].charCodeAt(0)); 
                break;
            case '.': befunge.output += Number(befunge.stack.pop()); break;
            case ',': befunge.output += String.fromCharCode(befunge.stack.pop()); break;
            case '?': 
                rnd = ~~(Math.random() * 4); 
                switch(rnd) {
                    case 0: befunge.direction = 'left'; break;
                    case 1: befunge.direction = 'up'; break;
                    case 2: befunge.direction = 'right'; break;
                    case 3: befunge.direction = 'down'; break;
                } 
                break;
            case 'p': 
                x = befunge.stack.pop();
                y = befunge.stack.pop();
                befunge.checkAndCreateElement(x, y);
                befunge.map[x][y] = String.fromCharCode(befunge.stack.pop()); 
                break;

            case '#': 
                switch(befunge.direction) {
                    case 'left': befunge.column--; break;
                    case 'up': befunge.row-- ; break;
                    case 'right': befunge.column++; break;
                    case 'down': befunge.row++; break; 
                }
                break;
        }

        
    }
    
    switch(befunge.direction) {
        case 'left': befunge.column--; break;
        case 'up': befunge.row-- ; break;
        case 'right': befunge.column++; break;
        case 'down': befunge.row++; break; 
    }
}

output.write(befunge.output);
process.stdout.write(befunge.output);