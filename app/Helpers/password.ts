import CryptoJS from 'crypto-js';
const key = "2b7e151628aed2a6abf7158809cf4f3c"
/**
 * @method encryptPassword 密码加密
 * @param password 原始密码
 */
export function encryptPassword(password: string): string {
    let encrypted = CryptoJS.AES.encrypt(password, key).toString();
    return encrypted;
}
/**
 * @method decryptPassword 密码解密
 * @param password 加密后密码
 */
export function decryptPassword(password: string): string {
    const decrypted = CryptoJS.AES.decrypt(password,key).toString(CryptoJS.enc.Utf8);
    return decrypted;
}
