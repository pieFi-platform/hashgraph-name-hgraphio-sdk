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
Object.defineProperty(exports, "__esModule", { value: true });
const domains_service_1 = require("./domains.service");
const hgraphio_service_1 = require("./hgraphio.service");
// NOTE: These tests are integration tests, there is no stubbing and they will hit the hgraph.io server
// PRIMARY FUNCTION TESTS
beforeAll(() => {
    require('dotenv').config();
});
describe('getSldInfo function', () => {
    test('successfully gets SLD info for hashgraph name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("nostradaomus.hbar");
        expect(sldInfo.isAvailable).toBeFalsy;
        expect(sldInfo.provider).toBe("piefi labs");
        expect(sldInfo.tld).toBe("hbar");
        expect(sldInfo.controller).toBe('0.0.1046752');
        expect(sldInfo.expiration).toBe('Mon, 08 Sep 2025 20:13:52 GMT');
    }));
    test('successfully gets SLD info for Web23 name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("gogogo.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("gogogo.hbar");
        expect(sldInfo.isAvailable).toBeFalsy;
        expect(sldInfo.provider).toBe("Web23");
        expect(sldInfo.tld).toBe("hbar");
        expect(sldInfo.controller).toBe('0.0.1317128');
        expect(sldInfo.expiration).toBe('');
    }));
    test('successfully gets SLD info for .cream name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("monke.cream", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("monke.cream");
        expect(sldInfo.isAvailable).toBeFalsy;
        expect(sldInfo.provider).toBe("piefi labs");
        expect(sldInfo.tld).toBe("cream");
    }));
    test('successfully gets SLD info for .boo name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("led.boo", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("led.boo");
        expect(sldInfo.isAvailable).toBeFalsy;
        expect(sldInfo.provider).toBe("piefi labs");
        expect(sldInfo.tld).toBe("boo");
    }));
    test('successfully gets SLD info for unextended name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("nftnick.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("nftnick.hbar");
        expect(sldInfo.isAvailable).toBeFalsy;
        expect(sldInfo.provider).toBe("piefi labs");
        expect(sldInfo.tld).toBe("hbar");
        expect(sldInfo.expiration).toBe("Thu, 05 Oct 2023 01:21:00 GMT");
    }));
    test('successfully gets SLD info for an available name', () => __awaiter(void 0, void 0, void 0, function* () {
        const sldInfo = yield (0, domains_service_1.getSldInfo)("cnadsoiglkasdjnfoi.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(sldInfo.name).toBe("cnadsoiglkasdjnfoi.hbar");
        expect(sldInfo.isAvailable).toBeTruthy;
        expect(sldInfo.provider).toBe("");
        expect(sldInfo.tld).toBe("hbar");
        expect(sldInfo.expiration).toBe("");
        expect(sldInfo.controller).toBe("");
    }));
});
describe('getSldMetadata function', () => {
    test('successfully gets SLD metadata from contracts', () => __awaiter(void 0, void 0, void 0, function* () {
        const metadata = yield (0, domains_service_1.getSldMetadata)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(metadata.addresses.eth).toBe('0xNosWasHere');
        expect(metadata.profileData.twitter).toBe('@nostradaomus');
    }));
    test('successfully returns empty data for name that has never set values', () => __awaiter(void 0, void 0, void 0, function* () {
        const metadata = yield (0, domains_service_1.getSldMetadata)("marit.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(metadata.addresses.eth).toBe("");
        expect(metadata.profileData.twitter).toBe("");
    }));
});
describe('getDomainsHeld function', () => {
    test('successfully gets domains held by an account', () => __awaiter(void 0, void 0, void 0, function* () {
        const domainCIDs = yield (0, domains_service_1.getDomainsHeldCIDs)('0.0.1046752', process.env.HGRAPHIO_TOKEN || "");
        // Should write real test.
        expect(true).toBeTruthy;
    }));
});
// SUPPORTING FUNCTION TESTS
describe('getDomainHolder function', () => {
    test('successfully gets holder of domain', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, domains_service_1.getDomainHolder)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(result.toString()).toBe("1046752");
    }));
});
describe('getTld function', () => {
    test('successfully gets TLD', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield (0, domains_service_1.getTld)("hbar", process.env.HGRAPHIO_TOKEN || "");
        expect((_a = result === null || result === void 0 ? void 0 : result.nameHash) === null || _a === void 0 ? void 0 : _a.domain).toBe("hbar");
    }));
});
describe('getSld function', () => {
    test('successfully gets SLD', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield (0, domains_service_1.getSld)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect((_a = result === null || result === void 0 ? void 0 : result.nameHash) === null || _a === void 0 ? void 0 : _a.domain).toBe("nostradaomus.hbar");
    }));
});
describe('getTokenHolder function', () => {
    test('successfully gets holder of token', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, hgraphio_service_1.getTokenHolder)("0.0.1234197", "58", process.env.HGRAPHIO_TOKEN || "");
        expect(result.toString()).toBe("1046752");
    }));
});
describe('getDomainHolder function', () => {
    test('successfully gets holder of domain', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, domains_service_1.getDomainHolder)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect(result.toString()).toBe("1046752");
    }));
});
describe('getTldInfo function', () => {
    test('successfully gets TLD info', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield (0, domains_service_1.getTld)("hbar", process.env.HGRAPHIO_TOKEN || "");
        expect((_a = result === null || result === void 0 ? void 0 : result.nameHash) === null || _a === void 0 ? void 0 : _a.domain).toBe("hbar");
    }));
});
describe('getSldInfo function', () => {
    test('successfully gets SLD info', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield (0, domains_service_1.getSld)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        expect((_a = result === null || result === void 0 ? void 0 : result.nameHash) === null || _a === void 0 ? void 0 : _a.domain).toBe("nostradaomus.hbar");
    }));
});
describe('getTokenHolder function', () => {
    test('successfully gets holder of token', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, hgraphio_service_1.getTokenHolder)("0.0.1234197", "58", process.env.HGRAPHIO_TOKEN || "");
        expect(result.toString()).toBe("1046752");
    }));
});
describe('getExtendedExpiry function', () => {
    test('successfully gets SLD expiry from contracts', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const sld = yield (0, domains_service_1.getSld)("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
        if (!((_a = sld === null || sld === void 0 ? void 0 : sld.providerData) === null || _a === void 0 ? void 0 : _a.contractId))
            throw new Error('Error getting sld contract ID');
        const expiryEpochTime = yield (0, domains_service_1.getExtendedExpiry)((_b = sld === null || sld === void 0 ? void 0 : sld.providerData) === null || _b === void 0 ? void 0 : _b.contractId, '0x' + ((_c = sld === null || sld === void 0 ? void 0 : sld.nameHash) === null || _c === void 0 ? void 0 : _c.sldHash), process.env.HGRAPHIO_TOKEN || "");
        expect(expiryEpochTime === null || expiryEpochTime === void 0 ? void 0 : expiryEpochTime.toString()).toBe('Mon Sep 08 2025 14:13:52 GMT-0600 (Mountain Daylight Time)');
    }));
});
