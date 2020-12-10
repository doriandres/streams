const fs = require('fs');
const Stream = require('stream');

async function readStreamToEndAsync(readable) {
    let buffer = Buffer.from([]);
    for await (const chunk of readable) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

async function run(){
    const file_stream = fs.createReadStream('./file.xml'); // Read file as stream
    const file_bytes = await readStreamToEndAsync(file_stream); // Get array of bytes from stream

    const str = file_bytes.toString('utf-8'); // Read file bytes as regular string
    const base64 = file_bytes.toString('base64'); // Convert file bytes to base46 string

    const copy_stream = Stream.Readable.from(file_bytes); // Create a stream from an array of bytes
    copy_stream.pipe(fs.createWriteStream('./copia.xml')); // Copy stream content into another stream

    Stream.Readable
        .from(Buffer.from(base64, 'base64')) // Convert base 64 string to buffer then to stream
        .pipe(fs.createWriteStream('./copia-64.xml'));  // Save stream created from base 64 stream as file
    
    console.log(file_bytes);
    console.log(str);
    console.log(base64);
}

run();