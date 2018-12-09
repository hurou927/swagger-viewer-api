module.exports = class LambdaStorage {
    constructor() {
        this.storage = {};
    }
    setItem(key, value) {
        this.storage[key] = {
            value,
            time: Math.floor((new Date()).getTime() / 1000)
        }
    }

    getItem(key) {
        return this.storage[key];
    }

    getItemTTL(key, ttl) {//ttl=second
        const now = Math.floor((new Date()).getTime() / 1000);
        const elem = this.storage[key];
        if(elem && (now-elem.time)<=ttl) {
            return elem;
        }else{
            return undefined
        }
    }

    deleteItem(key) {
        this.storage.delete(key);
    }

    deleteAllItems() {
        this.storage.clear();
    }

};
