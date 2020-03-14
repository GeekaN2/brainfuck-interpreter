const fs = require('fs');

// Settings

const arr_size = 30000;
const code = fs.readFileSync('./code.txt', function(err){
    if (err) throw err;
}).toString();

const input_file = fs.readFileSync('./input.txt', function(err){
    if (err) throw err;
}).toString();

let size = code.length;
let pointer = 0;
let loop_stack = [];
let input_pointer = 0;

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
                arr[pointer] = input_file[input_pointer].charCodeAt(0);
                input_pointer++;
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