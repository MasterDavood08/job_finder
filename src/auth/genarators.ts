import * as RandomString from 'crypto-random-string';

export const generateActivationCode = (Length = 5) => {
    let code = RandomString({
        length: Length,
        characters: '1234567890'
    })
    return code
}
