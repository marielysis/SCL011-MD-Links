const fs = require('fs');
const path = require('path');


readmeMD = fs.readFile('./README.md', 'utf-8', (Error, Data) => {
    if (Error) {
        console.log(Error);
    } else(Data)
    console.log(Data);


});