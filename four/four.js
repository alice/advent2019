const min = 387638;
const max = 919123;

console.log('112233', isValid('112233'));
console.log('123444', isValid('123444'));
console.log('111122', isValid('111122'));
	    
function isValid(password) {
    let foundDoubleDigit = false;
    let digits = password.split('');
    let consecutive = 1;
    let prev = parseInt(digits[0]);
    for (let i = 1; i < digits.length; i++) {
	curr = parseInt(digits[i]);
	if (curr < prev)
	    return false;

	if (curr == prev) {
	    consecutive++;
	} else {
	    if (consecutive == 2)
		foundDoubleDigit = true;
	    consecutive = 1;
	}
	prev = curr;
    }
    if (consecutive == 2)
	foundDoubleDigit = true;
    return foundDoubleDigit;
}

let validPasswords = 0;
for (let attempt = min; attempt <= max; attempt++) {
    if (isValid(String(attempt)))
	validPasswords++;
}

console.log('validPasswords: ', validPasswords);
