export class EmptyChecker {
    // Check if an object is empty
    static isObjectEmpty(obj) {
      return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
    }
  
    // Check if an object is NOT empty
    static isObjectNotEmpty(obj) {
      return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
    }
  
    // Check if an array is empty
    static isArrayEmpty(arr) {
      return Array.isArray(arr) && arr.length === 0;
    }
  
    // Check if an array is NOT empty
    static isArrayNotEmpty(arr) {
      return Array.isArray(arr) && arr.length > 0;
    }
  
    // Check if a string is empty (or only whitespace)
    static isStringEmpty(str) {
      return typeof str === 'string' && str.trim().length === 0;
    }
  
    // Check if a string is NOT empty
    static isStringNotEmpty(str) {
      return typeof str === 'string' && str.trim().length > 0;
    }
}
  