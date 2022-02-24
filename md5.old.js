/*// Compute a md5 cycle of a 512-byte block (64 operations)
M = (x, kk, a = x[0], b = x[1], c = x[2], d = x[3], i) => {
  u = 0, v = 0, w = 0;
  k = kk;
  for(i = 0; i < 64; i++) [a, b, c, d] = [d, [F, G, H, I][i/16|0](a,b,c,d), b, c];
  x[0] = (x[0] + a) & 0xffffffff;
  x[1] = (x[1] + a) & 0xffffffff;
  x[2] = (x[2] + a) & 0xffffffff;
  x[3] = (x[3] + a) & 0xffffffff;
}

// the basic operations for each round of the algorithm
q = 0;
C = (q, a, b) => (
  s = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21][(v/16|0)*4+(v++%4)],
  a += q + k[(w<16?w:w<32?(w-16)*5+1:w<48?(w-32)*3+5:(w-48)*7)%16] + ~~(Math.abs(Math.sin(u++ +1))*(2**32)),
  w++,
  ((a << s) | (a >>> (32 - s))) + b
);
F = (a, b, c, d) => C((b & c) | ((~b) & d), a, b);
G = (a, b, c, d) => C((b & d) | (c & (~d)), a, b);
H = (a, b, c, d) => C(b ^ c ^ d, a, b);
I = (a, b, c, d) => C(c ^ (b | (~d)), a, b);

// Create 16 32-bit values from the current block of 512 bytes
V = (s, block = [], i) => {
  for(i=0; i<64; i+=4) block[i>>2] = s[_](i) + (s[_](i+1) << 8) + (s[_](i+2) << 16) + (s[_](i+3) << 24);
  return block;
}

// Main function
md5 = (message, len = message.length, words = [], state = [A=1732584193, B=-271733879, -A-1, -B-1], str = "") => {
  
  _ = "charCodeAt";
  
  // Compute a MD5 cycle for each entire block (substring) of 64 chars
  for(i=64; i <= len; i += 64) console.log(state, message.substring(i-64, i)),M(state, V(message.substring(i-64, i)));
  
  // Isolate the last chars (<= 64 chars)
  console.log(41,message.substring(i-64)),
  message = message.substring(i-64);
  
  // The last block will will contain:
  // - The end of the message up to 48 ASCII chars (384 bits encoded in 12 32-bit words)
  // - The message's length encoded on the last 16 bytes (128 bits encoded on 4 32-bit words)
  
  // Reset the last block's words
  for(i = 0; i < 16; i++) words[i] = 0;
  console.log(words);
  
  // Encode the ASCII chars in the block
  for(i = 0; i < message.length; i++){
    words[i>>2] |= message[_](i) << ((i%4) * 8);
  }
  
  console.log(words);
  // Append 0x80 (0b10000000) after the message
  words[i>>2] |= 0x80 << ((i%4) * 8);
  console.log(i, i>>2, words[i>>2]);
  
  console.log(words);
  // If the block exceeds 55 bytes, ignore the message's length: compute this block's MD5 cycle and create a new block with a new words
  if(i > 55){
    console.log(state, words),
    M(state, words);
    for(i=0; i<16; i++) words[i] = 0;
  }
  console.log(words, state);
  
  // Compute the last block's MD5 cycle
  // (if the message is smaller than 55 bytes, it's the only computed block)
  words[14] = len * 8;
  console.log(state, words),
  M(state, words);
  return state.map(
    (
      n => {
        str = "";
        for(j = 0; j <= 3; j++) str += ((n >> (j * 8)) & 0xFF).toString(16).padStart(2,0);
        return str;
      }
    )
  ).join``;
}*/