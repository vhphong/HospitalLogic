export default function encrypt(originalPassword: string) {

    let encrypted: any = originalPassword.split('').map(a => a.charCodeAt(0));  // convert each character to a decimal number
    // console.log(encrypted);

    const chars: string[] = [];
    for (let i = 97; i <= 122; i++) {
        // chars: ['a', ..., 'z']
        chars.push(String.fromCharCode(i));
    }
    console.log(chars);
    let delimiters = ["!", "@", "#", "$", "%", "^", "&", "*"];

    // convert encrypted to an array of binary strings
    for (let i = 0; i < encrypted.length; i++) {
        // convert each char of element to binary
        encrypted[i] = encrypted[i].toString(2);    // convert each character to a binary string
        console.log(`# encrypted[${i}]: ${encrypted[i]}`);

        encrypted[i] = encrypted[i].split('');      // convert the binary string to array of 0's and 1's
        console.log('encrypted .: ' + encrypted);

        // console.log('encrypted[i].length: ' + encrypted[i].length);
        // replace 1's with alphabetical characters, 0's with numeric characters
        for (let j = 0; j < encrypted[i].length; j++) {
            if (encrypted[i][j] === '1') {
                // replace with an alphabetical character.
                const index = (Math.floor(Math.random() * 1000)) % 26;
                encrypted[i][j] = chars[index];
            } else {
                // replace with numeric character.
                encrypted[i][j] = (Math.floor(Math.random() * 1000)) % 10;
            }

            if (j === encrypted[i].length - 1) {
                const index = (Math.floor(Math.random() * 1000)) % 8;
                encrypted[i][j] += delimiters[index];
            }
        }
        encrypted[i] = encrypted[i].join('');
    }
    encrypted = encrypted.join('');     // encrypted is fully converted

    console.log('encrypted: ' + encrypted);

    return encrypted;
}