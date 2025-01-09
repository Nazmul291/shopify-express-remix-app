import crypto from 'crypto';

export class SecurityVerify {
  constructor() {
    this.secret = process.env.SHOPIFY_API_SECRET;
  }

  createSignature(data){
      try{
        const signature = crypto.createHmac('sha256', this.secret).update(data).digest('hex');
        return signature
      }catch(error){
        throw error;
      }
  }

  verifySignature(data, receivedSignature){
    try{
      const recreatedSignature = this.createSignature(data)

      return recreatedSignature === receivedSignature
    }catch(error){
      throw error
    }
  }

  verifyShopifyWebhook(req) {
    try {
      // Use raw body buffer for HMAC generation
      const generatedHmac = crypto
        .createHmac('sha256', this.secret)
        .update(req.body)
        .digest('base64');

      const shopifyHmac = req.headers['x-shopify-hmac-sha256'];
      
      return crypto.timingSafeEqual(
        Buffer.from(generatedHmac, 'base64'),
        Buffer.from(shopifyHmac, 'base64')
      );
    } catch (error) {
      throw error;
    }
  }
}
