"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyProfileDataResponse = exports.emptyAddressResponse = exports.emptyGetSldMetadataResponse = exports.getProfileDataResponse = exports.getAddressResponse = exports.getSldMetadataResponse = void 0;
const getSldMetadataResponse = (addressArr, profileDataArr) => {
    const addresses = (0, exports.getAddressResponse)(addressArr);
    const profileData = (0, exports.getProfileDataResponse)(profileDataArr);
    const response = {
        addresses: addresses,
        profileData: profileData
    };
    return response;
};
exports.getSldMetadataResponse = getSldMetadataResponse;
const getAddressResponse = (arr) => {
    const response = (0, exports.emptyAddressResponse)();
    response.eth = arr[0];
    response.btc = arr[1];
    response.sol = arr[2];
    return response;
};
exports.getAddressResponse = getAddressResponse;
const getProfileDataResponse = (arr) => {
    const response = (0, exports.emptyProfileDataResponse)();
    response.avatar = arr[0];
    response.twitter = arr[1];
    response.email = arr[2];
    response.url = arr[3];
    response.description = arr[4];
    response.keywords = arr[5];
    response.discord = arr[6];
    response.github = arr[7];
    response.reddit = arr[8];
    response.telegram = arr[9];
    response.extras = arr[10];
    return response;
};
exports.getProfileDataResponse = getProfileDataResponse;
const emptyGetSldMetadataResponse = () => ({
    addresses: (0, exports.emptyAddressResponse)(),
    profileData: (0, exports.emptyProfileDataResponse)()
});
exports.emptyGetSldMetadataResponse = emptyGetSldMetadataResponse;
const emptyAddressResponse = () => ({
    eth: '',
    btc: '',
    sol: '',
});
exports.emptyAddressResponse = emptyAddressResponse;
const emptyProfileDataResponse = () => ({
    avatar: '',
    twitter: '',
    email: '',
    url: '',
    description: '',
    keywords: '',
    discord: '',
    github: '',
    reddit: '',
    telegram: '',
    extras: '',
});
exports.emptyProfileDataResponse = emptyProfileDataResponse;
