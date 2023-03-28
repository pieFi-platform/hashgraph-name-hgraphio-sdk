"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyGetSldInfoResponse = void 0;
const emptyGetSldInfoResponse = () => ({
    name: '',
    isAvailable: false,
    tld: '',
    controller: '',
    expiration: undefined,
    provider: '',
});
exports.emptyGetSldInfoResponse = emptyGetSldInfoResponse;
