const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class AuthService {
  generateTOTP() {
    const secret = speakeasy.generateSecret({ length: 32 });
    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url
    };
  }

  verifyTOTP(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token
    });
  }

  async generateQRCode(otpauth_url) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth_url);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
