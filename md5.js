// Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
z=65535;A=(A,a,b=(z&A)+(z&a))=>(A>>16)+(a>>16)+(b>>16)<<16|z&b;

// These functions implement the basic operation for each round of the algorithm.
C=(C,a,h,s,t,M,b=A(A(a,C),A(s,M)))=>A(b<<t|b>>>32-t,h);
F=(A,a,h,s,t,M,b)=>C(a&h|~a&s,A,a,t,M,b);
G=(A,a,h,s,t,M,b)=>C(a&s|h&~s,A,a,t,M,b);
H=(A,a,h,s,t,M,b)=>C(a^h^s,A,a,t,M,b);
I=(A,a,h,s,t,M,b)=>C(h^(a|~s),A,a,t,M,b);

// Take a string and return the hex representation of its MD5.
md5=(r,t=r.length,o=[])=>{for(n=0;n<t;n++)o[n>>2]|=r.charCodeAt(n)<<n%4*8;for(o[n>>2]|=128<<n%4*8,o[16*(1+(t+8>>6))-2]=8*t,S=[a=1732584193,b=-271733879,c=-a-1,d=-b-1],n=0;n<o.length;n+=16){for(e=S[0],f=S[1],g=S[2],h=S[3],k=0,l=0,m=0,i=0;i<64;i++)S[(4-i%4)%4]=[F,G,H,I][i/16|0](S[(4-i%4)%4],S[(4-i%4+1)%4],S[(4-i%4+2)%4],S[(4-i%4+3)%4],o[n+((m<16?m++:m<32?5*(m++-16)+1:m<48?3*(m++-32)+5:7*(m++-48))%16)],[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21][l/4&~3|l++%4],(Math.abs(Math.sin(k+++1))*2**32));S[0]=A(S[0],e),S[1]=A(S[1],f),S[2]=A(S[2],g),S[3]=A(S[3],h)}return S.map((S=>{for(r=``,j=0;j<=3;j++)r+=(S>>8*j&255).toString(16).padStart(2,0);return r})).join``}