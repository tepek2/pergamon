'use strict';

const syncify = async (fn) => {
    try {
        const result = await fn();
        return () => { return result; };
    } catch (e) {
        return () => { throw e; };
    }
};

module.exports = { syncify };
