isNRLE = (s) => {
	if (isNaN(s)) return false;

	let nrle = s.replace(/[^\d]+/g, '')

	if (nrle.length !== 14) return false

	if (/^(\d)\1+$/.test(nrle)) return false

	let t = nrle.length - 2,
		d = nrle.substring(t),
		d1 = parseInt(d.charAt(0)),
		d2 = parseInt(d.charAt(1)),
		calc = x => {
			let n = nrle.substring(0, x),
				y = x - 7,
				s = 0,
				r = 0

				for (let i = x; i >= 1; i--) {
					s += n.charAt(x - i) * y--;
					if (y < 2) y = 9
				}

				r = 11 - s % 11
				return r > 9 ? 0 : r
		}

	return calc(t) === d1 && calc(t + 1) === d2
}

isSSN = (ssn) => {
	if (ssn == undefined || ssn == '') return false;
	if (isNaN(ssn)) return false;

	var sum = 0;
    var lo;
    
  	if (ssn == "00000000000") return false;
     
  	for (let i = 1; i <= 9; i++) sum = sum + parseInt(ssn.substring(i - 1, i)) * (11 - i);
  	lo = (sum * 10) % 11;
   
    if ((lo == 10) || (lo == 11))  lo = 0;
    if (lo != parseInt(ssn.substring(9, 10)) ) return false;
   
	sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(ssn.substring(i - 1, i)) * (12 - i);
    lo = (sum * 10) % 11;
   
    if ((lo == 10) || (lo == 11))  lo = 0;
    if (lo != parseInt(ssn.substring(10, 11) )) return false;
    return true;
}

module.exports = { isNRLE, isSSN };