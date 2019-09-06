const fs = require('fs');

// Settings

var stdin = process.stdin;
stdin.setRawMode( true );
stdin.resume();

const arr_size = 30000;
const code = fs.readFileSync('./code.txt', function(err){
    if (err) throw err;
}).toString();

let size = code.length;
let pointer = 0;
let loop_stack = [];

let arr = [];
for (let i = 0; i < arr_size; i++)
    arr[i] = 0;


// Main part

function afterAll() {
    pointer = (pointer + arr_size) % arr_size;
}

function main() {

    for (let i = 0; i < size; i++){
        switch (code[i]){
            case '>': pointer++; break;
            case '<': pointer--; break;
            case '+': arr[pointer]++; break;
            case '-': arr[pointer]--; break;
            case '.': {
                process.stdout.write(String.fromCharCode(arr[pointer]))
            }; break;
            case ',': {
                console.log('READ CHAR');
            }; break;
            case '[': {
                if (arr[pointer] == 0)
                    while(arr[i] != ']')
                        i++;
                else
                    loop_stack.push(i);
            }; break;
            case ']': {
                if (arr[pointer] != 0)
                    i = loop_stack[loop_stack.length - 1];
                else
                    loop_stack.pop();
                
            }; break;
        }
        afterAll();
    }

    process.exit();
}


main();