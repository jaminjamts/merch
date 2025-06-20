import CryptoJS from 'crypto-js';

const SESSION_KEY = 'Zx8vBq3eL2NtJf0K';
const IV_KEY = 'Ym5KrQ9xC7MwHt2L';

export const decrypt = (body) => {
  const sessionKey = CryptoJS.enc.Latin1.parse(SESSION_KEY);
  const ivKey = CryptoJS.enc.Latin1.parse(IV_KEY);

  body = CryptoJS.enc.Base64.parse(body);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: body }, sessionKey, {
    mode: CryptoJS.mode.CBC,
    iv: ivKey
  }).toString(CryptoJS.enc.Utf8);
  return decrypted === 'null' || decrypted === '' ? null : decrypted;
};

export const encrypt = (body) => {
  const sessionKey = CryptoJS.enc.Latin1.parse(SESSION_KEY);
  const ivKey = CryptoJS.enc.Latin1.parse(IV_KEY);
  let encrypted = CryptoJS.AES.encrypt(body, sessionKey, {
    mode: CryptoJS.mode.CBC,
    iv: ivKey
  }).toString();
  return encrypted;
};
