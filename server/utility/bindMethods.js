export class BindMethods{
    constructor(controller){
        this.controller = controller
    }
    bindMethods() {
        const prototype = Object.getPrototypeOf(this.controller);
        const methodNames = Object.getOwnPropertyNames(prototype).filter(
          (method) => typeof this.controller[method] === 'function' && method !== 'constructor'
        );
      
        methodNames.forEach((method) => {
            this.controller[method] = this.controller[method].bind(this.controller);
        });
      
        return this.controller;
    }
}
