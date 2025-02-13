using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace SpiralService
{
    public static class Helper
    {
        private static readonly String SECURITY_KEY= "{83B7A66DB92B}";
        
        private static readonly String SECURITY_KEY_DATA= "{19F1A887FBCB}";
        
        private static string Encrypt(string plainText, string passPhrase, string saltValue, string initVector, string hashAlgorithm = "SHA1", int passwordIterations = 2, int keySize = 256)
        {
            byte[] initVectorBytes = Encoding.ASCII.GetBytes(initVector);
            byte[] saltValueBytes = Encoding.ASCII.GetBytes(saltValue);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, saltValueBytes, hashAlgorithm, passwordIterations);
            byte[] keyBytes = password.GetBytes(keySize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
            cryptoStream.FlushFinalBlock();
            byte[] cipherTextBytes = memoryStream.ToArray();
            memoryStream.Close();
            cryptoStream.Close();
            string cipherText = Convert.ToBase64String(cipherTextBytes);
            return cipherText;
        }

        private static string Decrypt(string cipherText, string passPhrase, string saltValue, string initVector, string hashAlgorithm = "SHA1", int passwordIterations = 2, int keySize = 256)
        {
            byte[] initVectorBytes = Encoding.ASCII.GetBytes(initVector);
            byte[] saltValueBytes = Encoding.ASCII.GetBytes(saltValue);
            byte[] cipherTextBytes = Convert.FromBase64String(cipherText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(passPhrase, saltValueBytes, hashAlgorithm, passwordIterations);
            byte[] keyBytes = password.GetBytes(keySize / 8);

            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream(cipherTextBytes);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];
            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            string plainText = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
            return plainText;
        }

        public static string Encrypt(string data, string passPhrase, string saltValue, string keyData)
        {
            if (string.IsNullOrWhiteSpace(data))
                throw new Exception("Encrypt: Data not null.");
            if (string.IsNullOrEmpty(keyData))
                throw new Exception("Encrypt: Key not null.");
            keyData = keyData.PadRight(16, '0');
            if (keyData.Length > 16)
                keyData = keyData.Substring(0, 16);
            return Helper.Encrypt(data, passPhrase, saltValue, keyData, "SHA1");
        }
        public static string Encrypt(string data, string passPhrase)
        {
            return Encrypt(data, passPhrase, SECURITY_KEY, SECURITY_KEY_DATA);
        }
        public static string Decrypt(string data, string passPhrase, string saltValue, string keyData)
        {
            if (string.IsNullOrWhiteSpace(data))
                throw new Exception("Encrypt: Data not null.");
            if (string.IsNullOrEmpty(keyData))
                throw new Exception("Encrypt: Key not null.");
            keyData = keyData.PadRight(16, '0');
            if (keyData.Length > 16)
                keyData = keyData.Substring(0, 16);
            return Helper.Decrypt(data, passPhrase, saltValue, keyData, "SHA1");
        }
        public static string Decrypt(string data, string passPhrase)
        {
            return Decrypt(data, passPhrase, SECURITY_KEY, SECURITY_KEY_DATA);
        }
    }
}