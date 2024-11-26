class Vp {
    constructor(a = {}) {
      this.Mq = 0;
      this.Mg = new Aia();
    }

    ai() {
      switch (this.Mq) {
        case 1:
          return '<gmp-internal-loading-text></gmp-internal-loading-text>';
        case 3:
          return '<gmp-internal-request-error-text></gmp-internal-request-error-text>';
        case 2:
          return this.Ig();
        default:
          return '';
      }
    }
  }

  class Yp {
    constructor() {
      this.Kv = this.generateUniqueId();
    }

    generateUniqueId() {
      const randomPart = Math.floor(Math.random() * 2147483648).toString(36);
      const timePart = Date.now().toString(36);
      return (randomPart + timePart).substring(0, 36);
    }
  }

  class Zp {
    constructor(a = {}) {
      this.Eg = {
        'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
        'Content-Type': 'application/json+protobuf',
        'X-Goog-Maps-Channel-Id': process.env.GOOGLE_MAPS_CHANNEL_ID || ''
      };
      this.headers = { ...this.Eg, ...a };
    }

    async intercept(a, b) {
      for (const [c, d] of Object.entries(this.headers)) {
        a.setHeader(c, d);
      }
      if (a.getHeader('Authorization')) {
        a.setHeader('X-Goog-Api-Key', '');
      }
      return b(a);
    }
  }

  export { Vp, Yp, Zp };