export default function decrypt(inputPw: string) {

    // let encryptedPassword: string = req.body.password;

    let encryptedPasswordArray: any[] = inputPw.split('');

    for (let i = 0; i < encryptedPasswordArray.length; i++) {
        if ((encryptedPasswordArray[i] == '!') || (encryptedPasswordArray[i] == '@') ||
            (encryptedPasswordArray[i] == '#') || (encryptedPasswordArray[i] == '$') ||
            (encryptedPasswordArray[i] == '%') || (encryptedPasswordArray[i] == '^') ||
            (encryptedPasswordArray[i] == '&') || (encryptedPasswordArray[i] == '*')) {
            // replace delimiters by ' '
            encryptedPasswordArray[i] = ' ';
        }
    }

    // console.log('encryptedPassword: ' + encryptedPassword);
    // console.log('encryptedPassword.length: ' + encryptedPassword.length);

    // console.log('encryptedPasswordArray: ' + encryptedPasswordArray);
    // console.log('encryptedPasswordArray.length: ' + encryptedPasswordArray.length);

    inputPw = encryptedPasswordArray.join('');

    // console.log('encryptedPassword: ~ ' + encryptedPassword);
    // console.log('encryptedPassword.length: ' + encryptedPassword.length);

    // console.log('encryptedPassword: ' + encryptedPassword);

    // split encryptedPassword into an array of strings
    let tempArray: any[] = inputPw.split(' ');
    tempArray.pop();    // remove the last element

    console.log('tempArray: ' + tempArray);
    // tempArray.forEach((element, i) => { console.log(`tempArray[${i}]: ${element}`) });
    console.log('tempArray.length: ' + tempArray.length);

    let decrypted: any = '';

    for (let element of tempArray) {
        let tempString: any = '';
        for (let eachChar of element) {
            if ((eachChar >= 'a') && (eachChar <= 'z')) {
                // if eachChar is [a-z]
                tempString += '1';
            } else if ((Number(eachChar) >= 0) && (Number(eachChar) <= 9)) {
                // if eachChar is [0-9]
                tempString += '0';
            }
        }

        // console.log('tempString: ' + tempString);
        tempString = Number(tempString);                // convert from string to number
        tempString = parseInt(tempString, 2);           // convert from binary to decimal
        tempString = String.fromCharCode(tempString);   // convert from decimal to char
        console.log('tempString: ' + tempString);
        decrypted += tempString;
        // console.log('decrypted: ' + decrypted);
    }

    console.log(decrypted);
    console.log(decrypted.length);

    return decrypted;
}