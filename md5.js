// Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
A=(x, y)=>{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

// Bitwise rotate a 32-bit number to the left
R=(num, cnt)=>(num << cnt) | (num >>> (32 - cnt));

// These functions implement the basic operation for each round of the algorithm.
C=(q, a, b, x, s, t)=>A(R(A(A(a, q), A(x, t)), s), b);
F=(a, b, c, d, x, s, t)=>C((b & c) | ((~b) & d), a, b, x, s, t);
G=(a, b, c, d, x, s, t)=>C((b & d) | (c & (~d)), a, b, x, s, t);
H=(a, b, c, d, x, s, t)=>C(b ^ c ^ d, a, b, x, s, t);
I=(a, b, c, d, x, s, t)=>C(c ^ (b | (~d)), a, b, x, s, t);
K = u => ~~(Math.abs(Math.sin(u+1))*(2**32));
L = v => [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21][(v/16|0)*4+(v%4)];
M = w => (w<16?w:w<32?(w-16)*5+1:w<48?(w-32)*3+5:(w-48)*7)%16;

// Take a string and return the hex representation of its MD5.
md5=(str, n = str.length, nblk, x, i, olda, oldb, oldc, oldd) =>{

  nblk = ((n + 8) >> 6) + 1;
  x = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) x[i] = 0;
  for(i = 0; i < n; i++) x[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  x[i >> 2] |= 0x80 << ((i % 4) * 8);
  x[nblk * 16 - 2] = n * 8;
  
  S = [
    a =  1732584193,
    b = -271733879,
    c = -a-1,
    d = -b-1
  ];
  
  for(i = 0; i < x.length; i += 16)
  {
    olda = S[0];
    oldb = S[1];
    oldc = S[2];
    oldd = S[3];
    
    k = 0;
    l = 0;
    m = 0;
    for(op=0;op<64;op++)
      S[(4-(op%4))%4] = [F, G, H, I][op/16|0](S[(4-(op%4))%4], S[(4-(op%4)+1)%4], S[(4-(op%4)+2)%4], S[(4-(op%4)+3)%4], x[i+M(m++)], L(l++), K(k++));

    S[0] = A(S[0], olda);
    S[1] = A(S[1], oldb);
    S[2] = A(S[2], oldc);
    S[3] = A(S[3], oldd);
  }
  return S.map(
    (
      n => {
        str = "";
        for(j = 0; j <= 3; j++) str += ((n >> (j * 8)) & 0xFF).toString(16).padStart(2,0);
        return str;
      }
    )
  ).join``;
}