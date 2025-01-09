import {BindMethods} from "../utility/bindMethods.js"

import jwt from 'jsonwebtoken';

class ShopifyTokenAuth {
  constructor() {
    // Constructor initializes the secret key or the public key
    this.api_key = process.env.SHOPIFY_API_KEY
    this.secretKey = process.env.SHOPIFY_API_SECRET;
    this.shop = null
  }

  // Method to validate the Shopify token
  validateToken(req, res, next) {
    try {
      const token = req.headers['authorization']?.split(" ")[1] || null
      this.shop = req.shop.session.shop
      
      if (!token) {
        return next(new Error('Invalid token claims')) 
      }
      // Decode and verify the token using the secret key
      const decoded = this.verifyToken(token);

      // Validate token claims
      const isValid = this.validateClaims(decoded);
      
      if (!isValid) {
        return next(new Error('Invalid token claims')) 
      }

      // Return the decoded token payload if valid
      return decoded;
    } catch (err) {
      console.error('Token validation failed:', err.message);
      throw new Error('Invalid or expired token');
    }
  }

  // Method to verify the token using secret key or public key
  verifyToken(token) {
    try {
      // Decode the JWT and validate it using the secret key
      return jwt.verify(token, this.secretKey);
    } catch (err) {
      throw new Error('Token verification failed');
    }
  }

  // Method to validate token claims
  validateClaims(decodedToken) {
    // Check the claims like issuer (iss), audience (aud), etc.
    const isValid =
      decodedToken.iss === `https://${this.shop}/admin` &&
      decodedToken.aud === this.api_key;

    return isValid;
  }

  // Method to check if the token is expired
  isTokenExpired(decodedToken) {
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }
}

const binding = new BindMethods(new ShopifyTokenAuth())
export default binding.bindMethods()
