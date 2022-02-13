// Coefficients array
K = [...Array(64).keys()].map(i=>~~(Math.abs(Math.sin(i+1))*(2**32)));

// M inputs for each round
N = [...Array(64).keys()].map(i=>(i<16?i:i<32?(i-16)*5+1:i<48?(i-32)*3+5:(i-48)*7)%16);

// Shifts for each round
S = [...Array(64).keys()].map(i=>[7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21][(i/16|0) * 4 + (i%4)])

// Compute a md5 cycle of a 512-byte block (64 operations)
md5cycle = (x, kk, a = x[0], b = x[1], c = x[2], d = x[3], i) => {
  i1 = 0, i2 = 0, i3 = 0;
  k = kk;
  for(i = 0; i < 64; i++) [a, b, c, d] = [d, [F, G, H, I][i/16|0](a,b,c,d), b, c];
  x[0] += a;
  x[1] += b;
  x[2] += c;
  x[3] += d;
}

// the basic operations for each round of the algorithm
q = 0;
cmn = (q, a, b) => (
  s = S[i2++],
  a += q + k[N[i3++]] + K[i1++],
  ((a << s) | (a >>> (32 - s))) + b
);
F = (a, b, c, d) => cmn((b & c) | ((~b) & d), a, b);
G = (a, b, c, d) => cmn((b & d) | (c & (~d)), a, b);
H = (a, b, c, d) => cmn(b ^ c ^ d, a, b);
I = (a, b, c, d) => cmn(c ^ (b | (~d)), a, b);

// Create 16 32-bit values from the current block of 512 bytes
md5blk = (s, md5blks = [], i) => {
  for(i=0; i<64; i+=4) md5blks[i>>2] = s[_ = "charCodeAt"](i) + (s[_](i+1) << 8) + (s[_](i+2) << 16) + (s[_](i+3) << 24);
  return md5blks;
}

// Main function
md5 = (s, n = s.length, tail = []) => {
  
  // Initialize A, B, C, D
  state = [A=1732584193, B=-271733879, -A-1, -B-1];
  
  // Compute a MD5 cycle for each entire block (substring) of 64 chars
  for(i=64; i<=n; i+=64) md5cycle(state, md5blk(s.substring(i-64, i)));
  
  // Isolate the last block of chars (<= 64 chars)
  s = s.substring(i-64);
  
  // The last block will will contain the end of the message up to 12 32-bit words, and 4 32-bit words to encode the message's length in bits
  for(i=0; i<16; i++) tail[i] = 0;
  for(i=0; i<s.length; i++) tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
  tail[i>>2] |= 0x80 << ((i%4) << 3);
  
  // If the block exceed 55 bytes, ignore the message's length: compute this block's MD5 cycle and create a new block with a new tail
  if(i > 55){
    md5cycle(state, tail);
    for(i=0; i<16; i++) tail[i] = 0;
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