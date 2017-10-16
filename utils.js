(function(){

  const {promisify} = require('util')
  /**
   * import functions with promisify
   * @param {string} moduleName - module's path
   * @param {string[]} functionNames - names of functions you want to import
   * @return {object} - async functions
   */
  function importWithPromisify(moduleName, functionNames){
    module = require(moduleName)
    re = new Object() 
    for(functionName of functionNames){
      re[functionName] = promisify(module[functionName])
    }
    return re
  }
  exports.importWithPromisify = importWithPromisify

  /**
   * split Buffer into chunks, these chunks share the same memory `buf`
   * @param {Buffer} buf 
   * @param {number} size
   * @return {Buffer[]} array of chunks 
   */
  function chunk(buf, size){
    let len = buf.length
    let chunks = new Array()
    for(let pos = 0; pos < len; pos += size){
      chunks.push(Buffer.from(buf.buffer, pos, size))
    }
    return chunks
  }
  exports.chunk = chunk
})()