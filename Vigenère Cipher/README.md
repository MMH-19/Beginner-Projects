# Vigenère Cipher Application

A simple web application that implements the Vigenère cipher for encryption and decryption of text messages.

## Description

The Vigenère cipher is a classical encryption technique that uses a keyword to encrypt and decrypt messages. It's a form of polyalphabetic substitution, which means it uses multiple substitution alphabets to encrypt the plain text.

## Features

- Encrypt plain text using a key of your choice
- Decrypt encrypted messages using the same key
- Compare the original message with the decrypted message
- Preserves case and non-alphabetic characters

## How to Use

1. Open `index.html` in your web browser
2. Enter the message you want to encrypt in the "Message" field
3. Enter your encryption key in the "Encryption Key" field
4. Click "Encrypt" to encrypt your message
5. Click "Decrypt" to decrypt the message
6. Click "Compare" to verify if the original message matches the decrypted message

## How the Vigenère Cipher Works

1. **Encryption**: Each letter of the plaintext is shifted by a corresponding letter of the key. For example, if the plaintext letter is 'A' and the key letter is 'C', the encryption shifts 'A' by 2 positions (the position of 'C' in the alphabet) to get 'C'.

2. **Decryption**: Each letter of the ciphertext is shifted back by the corresponding letter of the key. For example, if the ciphertext letter is 'C' and the key letter is 'C', the decryption shifts 'C' back by 2 positions to get 'A'.

## Security Considerations

The Vigenère cipher is not secure by modern cryptographic standards. It is vulnerable to several attacks:

1. **Frequency Analysis**: If the key is short, patterns in the encrypted text can be used to break the cipher.
2. **Known-Plaintext Attack**: If an attacker knows part of the plaintext, they can easily find the key.
3. **Kasiski Examination**: This method helps determine the key length by finding repeated sequences in the ciphertext.

This application is intended for educational purposes only and should not be used for securing sensitive information. 