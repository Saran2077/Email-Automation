import jwt from 'jsonwebtoken';

class JsonWebToken {
  sign(payload, expiry = '24h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
  }

  verify(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return false;
    }
  }

  decode(token) {
    return jwt.decode(token, { complete: true });
  }
}

export default JsonWebToken; 