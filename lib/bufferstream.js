const { Readable } = require('stream');

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
const bufferToStream = function (binary) {

    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });

    return readableInstanceStream;
}


module.exports = bufferToStream;