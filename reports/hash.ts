const signature = (username, exp) => secret => {
  const str = username.concat(exp, secret)
  const h = [0x6295c58d, 0x62b82555, 0x07bb0102, 0x6c62272e]  //random 128bit integers
  for (var i = 0; i < str.length; i++) {
      h[i % 4] ^= str.charCodeAt(i);
      h[i % 4] *= 0x01000193 //128-bit lower constant
  }
  /* returns 4 concatenated hex representations */
  return h[0].toString(16) + h[1].toString(16) + h[2].toString(16) + h[3].toString(16);
}

export default signature