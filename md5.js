
// Coefficients array
K = [...Array(64).keys()].map(i=>~~(Math.abs(Math.sin(i+1))*(2**32)));

// M inputs for each round
N = [
  ...n0 = [...Array(16).keys()],
  ...(n0.map(a=>(a*5+1)%16)),
  ...(n0.map(a=>(a*3+5)%16)),
  ...(n0.map(a=>(a*7)%16))
];

// Shifts for each round
S = [
  ...s0 = [7, 12, 17, 22], ...s0, ...s0, ...s0,
  ...s1 = [5,  9, 14, 20], ...s1, ...s1, ...s1,
  ...s2 = [4, 11, 16, 23], ...s2, ...s2, ...s2,
  ...s3 = [6, 10, 15, 21], ...s3, ...s3, ...s3
];

// Compute a md5 cycle of a 512-byte block (64 operations)
md5cycle = (x, kk) => {
  var a = x[0], b = x[1], c = x[2], d = x[3];
  i1 = 0, i2 = 0, i3 = 0;
  k = kk;
  for(var i = 0; i < 64; i++) [a, b, c, d] = [d, [ff, gg, hh, ii][i/16|0](a,b,c,d),b, c];
  x[0] = a + x[0];
  x[1] = b + x[1];
  x[2] = c + x[2];
  x[3] = d + x[3];
}

// the basic operations for each round of the algorithm
q = 0;
cmn = (q, a, b) => (
  s = S[i2++],
  a += q + k[N[i3++]] + K[i1++],
  ((a << s) | (a >>> (32 - s))) + b
);
ff = (a, b, c, d) => cmn((b & c) | ((~b) & d), a, b);
gg = (a, b, c, d) => cmn((b & d) | (c & (~d)), a, b);
hh = (a, b, c, d) => cmn(b ^ c ^ d, a, b);
ii = (a, b, c, d) => cmn(c ^ (b | (~d)), a, b);

// Create 16 32-bit values from the current block of 512 bytes
md5blk = s => {
  var md5blks = [], i;
  for (i=0; i<64; i+=4) md5blks[i>>2] = s.charCodeAt(i) + (s.charCodeAt(i+1) << 8) + (s.charCodeAt(i+2) << 16) + (s.charCodeAt(i+3) << 24);
  return md5blks;
}

// Main function
md5 = s => {

  // Message length (ASCII chars)
  var n = s.length,

  // Initialize A, B, C, D
  state = [A=1732584193, B=-271733879, -A-1, -B-1];
  
  // Compute a MD5 cycle for each entire block (substring) of 64 chars
  for (i=64; i<=s.length; i+=64) md5cycle(state, md5blk(s.substring(i-64, i)));
  
  // Isolate the last block of chars (<= 64 chars)
  s = s.substring(i-64);
  
  // The last block will will contain the end of the message up to 12 32-bit words, and 4 32-bit words to encode the message's length in bits
  var tail = [];
  for(i=0; i<16; i++) tail[i] = 0;
  for (i=0; i<s.length; i++) tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
  tail[i>>2] |= 0x80 << ((i%4) << 3);
  
  // If the block exceed 55 bytes, ignore the message's length: compute this block's MD5 cycle and create a new block with a new tail
  if (i > 55) {
    md5cycle(state, tail);
    for (i=0; i<16; i++) tail[i] = 0;
  }
  
  // Compute the last block's MD5 cycle
  // (if the message is smaller than 55 bytes, it's the only computed block)
  tail[14] = n*8;
  md5cycle(state, tail);
  return state.map(
    (
      n => {
        str = "";
        for(j = 0; j <= 3; j++) str += ((n >> (j * 8)) & 0xFF).toString(16);
        return str;
      }
    )
  ).join('');
}