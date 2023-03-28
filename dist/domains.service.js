"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtendedExpiry = exports.getSld = exports.getTld = exports.getDomainHolder = exports.getDomainsHeldCIDs = exports.getSldMetadata = exports.getSldInfo = void 0;
const keccak256_1 = __importDefault(require("keccak256"));
const hgraphio_service_1 = require("./hgraphio.service");
const abi_service_1 = require("./abi.service");
const GetSldMetadataResponse_1 = require("./types/GetSldMetadataResponse");
const constants_1 = require("./constants");
const hex2ascii = require('hex2ascii');
const extendExpirySigHash = '\\\\x' + (0, keccak256_1.default)("ExtendExpiry(bytes32,uint256,uint256)").toString('hex');
const extendExpiryParameters = (0, abi_service_1.loadSldFunctionAbi)("ExtendExpiry").inputs;
const setSLDInfoSigHash = '\\\\x' + (0, keccak256_1.default)("SetSLDInfo(bytes32,string[],string[])").toString('hex');
const setSLDInfoParameters = (0, abi_service_1.loadSldFunctionAbi)("SetSLDInfo").inputs;
// PRIMARY METHODS
const getSldInfo = (sldName, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    const name = sldName;
    const tld = sldName.split('.')[1];
    const sldMessage = yield (0, exports.getSld)(sldName, hgraphioToken);
    if (!sldMessage)
        return {
            name: name,
            isAvailable: true,
            tld: tld,
            controller: "",
            expiration: "",
            provider: ""
        };
    const [tokenId, serialNumber] = sldMessage.nftId.split(':');
    const isAvailable = false;
    const controller = yield (0, hgraphio_service_1.getTokenHolder)(tokenId, serialNumber, hgraphioToken);
    const provider = sldMessage.provider;
    let expiration = sldMessage.expiration;
    if (provider !== 'piefi labs')
        expiration = '';
    const response = {
        name: name,
        isAvailable: isAvailable,
        tld: tld,
        controller: '0.0.' + controller,
        expiration: expiration,
        provider: provider,
    };
    return response;
});
exports.getSldInfo = getSldInfo;
function getSldMetadata(sldName, hgraphioToken) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const sld = yield (0, exports.getSld)(sldName, process.env.HGRAPHIO_TOKEN || "");
        if (!((_a = sld === null || sld === void 0 ? void 0 : sld.providerData) === null || _a === void 0 ? void 0 : _a.contractId) || !((_b = sld === null || sld === void 0 ? void 0 : sld.nameHash) === null || _b === void 0 ? void 0 : _b.sldHash))
            throw new Error('Error getting sld contract ID and SLD hash');
        if (!sld.provider || sld.provider !== "piefi labs")
            throw new Error('Domain metadata only available for hashgraph names');
        const contractAddress = sld.providerData.contractId.split(".")[2];
        const sldHash = '0x' + sld.nameHash.sldHash;
        const { errors, data } = yield (0, hgraphio_service_1.fetchContractLogs)(contractAddress, setSLDInfoSigHash, hgraphioToken);
        if (errors)
            console.error(errors);
        const logs = data.contract_log.map((log) => {
            if (log.data)
                log.data = (0, abi_service_1.decodeResponse)(setSLDInfoParameters, log.data.toString().split("\\x")[1]);
            return log;
        });
        const results = logs.find((log) => log.data["0"] === sldHash);
        if (!results || !results.data)
            return (0, GetSldMetadataResponse_1.emptyGetSldMetadataResponse)();
        const response = (0, GetSldMetadataResponse_1.getSldMetadataResponse)(results.data["1"], results.data["2"]);
        return response;
    });
}
exports.getSldMetadata = getSldMetadata;
function getDomainsHeldCIDs(accountId, hgraphioToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const strippedAccountId = accountId.split('.')[2];
        const hbarDomainsResponse = yield (0, hgraphio_service_1.fetchNFTsHeld)(constants_1.HBAR_TOKEN_ID, strippedAccountId, hgraphioToken);
        const hbarNfts = hbarDomainsResponse.data.nft;
        const hbarDomainCIDs = hbarNfts.map((domain) => hex2ascii(domain.metadata));
        const booDomainsResponse = yield (0, hgraphio_service_1.fetchNFTsHeld)(constants_1.BOO_TOKEN_ID, strippedAccountId, hgraphioToken);
        const booNfts = booDomainsResponse.data.nft;
        const booDomainCIDs = booNfts.map((domain) => hex2ascii(domain.metadata));
        const creamDomainsResponse = yield (0, hgraphio_service_1.fetchNFTsHeld)(constants_1.CREAM_TOKEN_ID, strippedAccountId, hgraphioToken);
        const creamNfts = creamDomainsResponse.data.nft;
        const creamDomainCIDs = creamNfts.map((domain) => hex2ascii(domain.metadata));
        return hbarDomainCIDs.concat(booDomainCIDs, creamDomainCIDs);
    });
}
exports.getDomainsHeldCIDs = getDomainsHeldCIDs;
// SUPPORTING METHODS
const getDomainHolder = (sldName, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    const sldMessage = yield (0, exports.getSld)(sldName, hgraphioToken);
    if (!sldMessage)
        return "";
    const [tokenId, serialNumber] = sldMessage.nftId.split(':');
    const result = yield (0, hgraphio_service_1.getTokenHolder)(tokenId, serialNumber, hgraphioToken);
    return result;
});
exports.getDomainHolder = getDomainHolder;
const getTld = (tldName, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { errors, data } = yield (0, hgraphio_service_1.fetchTopicMessages)(constants_1.TLD_TOPIC_ID, hgraphioToken);
    if (errors)
        throw new Error('Error getting tld info');
    const domains = data.topic_message.map((message) => message.message = JSON.parse(hex2ascii(message.message)));
    const result = domains.find(message => message.nameHash.domain === tldName);
    return result;
});
exports.getTld = getTld;
const getSld = (sldName, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tld = yield (0, exports.getTld)(sldName.split('.')[1], hgraphioToken);
    if (!tld)
        throw new Error('Provided top level domain does not have a message on the topic');
    const { errors, data } = yield (0, hgraphio_service_1.fetchTopicMessages)(tld.topicId.split('.')[2], hgraphioToken);
    if (errors)
        throw new Error('Error getting sld info');
    const domains = data.topic_message.map((message) => message.message = JSON.parse(hex2ascii(message.message)));
    let sld = domains.find(message => message.nameHash.domain === sldName);
    if (!sld)
        return undefined;
    if (sld.provider === 'piefi labs') {
        const sldContractId = (_a = sld.providerData) === null || _a === void 0 ? void 0 : _a.contractId;
        const sldHash = '0x' + ((_b = sld === null || sld === void 0 ? void 0 : sld.nameHash) === null || _b === void 0 ? void 0 : _b.sldHash);
        const sldExpiry = yield getExtendedExpiry(sldContractId, sldHash, hgraphioToken);
        let expirationDate;
        sldExpiry ? expirationDate = sldExpiry : expirationDate = new Date(parseInt(sld.expiration) * 1000);
        const today = new Date();
        if (today > expirationDate)
            return undefined;
        sld.expiration = expirationDate.toUTCString();
    }
    return sld;
});
exports.getSld = getSld;
function getExtendedExpiry(contractId, sldHash, hgraphioToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const contractAddress = contractId.split(".")[2];
        const { errors, data } = yield (0, hgraphio_service_1.fetchContractLogs)(contractAddress, extendExpirySigHash, hgraphioToken);
        if (errors)
            console.error(errors);
        const logs = data.contract_log.map((log) => {
            if (log.data)
                log.data = (0, abi_service_1.decodeResponse)(extendExpiryParameters, log.data.toString().split("\\x")[1]);
            return log;
        });
        const results = logs.find((log) => log.data["0"] === sldHash);
        if (!results)
            return undefined;
        const expiryEpochTime = results === null || results === void 0 ? void 0 : results.data["2"];
        if (!expiryEpochTime)
            throw new Error('No expiry found on name');
        const date = new Date(0);
        date.setUTCSeconds(expiryEpochTime);
        return date;
    });
}
exports.getExtendedExpiry = getExtendedExpiry;
