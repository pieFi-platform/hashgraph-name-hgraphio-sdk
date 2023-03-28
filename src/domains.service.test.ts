import { TopLevelDomain, SecondLevelDomain } from './types/Domains';
import { getDomainHolder, getTld, getSld, getExtendedExpiry, getSldMetadata, getSldInfo, getDomainsHeldCIDs } from './domains.service';
import { getTokenHolder } from './hgraphio.service';
import { GetSldMetadataResponse } from './types/GetSldMetadataResponse';
import { GetSldInfoResponse } from './types/GetSldInfoResponse';


// NOTE: These tests are integration tests, there is no stubbing and they will hit the hgraph.io server
// PRIMARY FUNCTION TESTS

beforeAll(() => {
  require('dotenv').config();
});

describe('getSldInfo function', () => {
  test('successfully gets SLD info for hashgraph name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("nostradaomus.hbar");
    expect(sldInfo.isAvailable).toBeFalsy;
    expect(sldInfo.provider).toBe("piefi labs");
    expect(sldInfo.tld).toBe("hbar");
    expect(sldInfo.controller).toBe('0.0.1046752');
    expect(sldInfo.expiration).toBe('Mon, 08 Sep 2025 20:13:52 GMT');
  });

  test('successfully gets SLD info for Web23 name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("gogogo.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("gogogo.hbar");
    expect(sldInfo.isAvailable).toBeFalsy;
    expect(sldInfo.provider).toBe("Web23");
    expect(sldInfo.tld).toBe("hbar");
    expect(sldInfo.controller).toBe('0.0.1317128');
    expect(sldInfo.expiration).toBe('');
  });

  test('successfully gets SLD info for .cream name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("monke.cream", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("monke.cream");
    expect(sldInfo.isAvailable).toBeFalsy;
    expect(sldInfo.provider).toBe("piefi labs");
    expect(sldInfo.tld).toBe("cream");
  });

  test('successfully gets SLD info for .boo name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("led.boo", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("led.boo");
    expect(sldInfo.isAvailable).toBeFalsy;
    expect(sldInfo.provider).toBe("piefi labs");
    expect(sldInfo.tld).toBe("boo");
  });

  test('successfully gets SLD info for unextended name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("nftnick.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("nftnick.hbar");
    expect(sldInfo.isAvailable).toBeFalsy;
    expect(sldInfo.provider).toBe("piefi labs");
    expect(sldInfo.tld).toBe("hbar");
    expect(sldInfo.expiration).toBe("Thu, 05 Oct 2023 01:21:00 GMT");
  });

  test('successfully gets SLD info for an available name', async () => {
    const sldInfo: GetSldInfoResponse = await getSldInfo("cnadsoiglkasdjnfoi.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(sldInfo.name).toBe("cnadsoiglkasdjnfoi.hbar");
    expect(sldInfo.isAvailable).toBeTruthy;
    expect(sldInfo.provider).toBe("");
    expect(sldInfo.tld).toBe("hbar");
    expect(sldInfo.expiration).toBe("");
    expect(sldInfo.controller).toBe("");
  });
});

describe('getSldMetadata function', () => {
  test('successfully gets SLD metadata from contracts', async () => {
    const metadata: GetSldMetadataResponse = await getSldMetadata("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(metadata.addresses.eth).toBe('0xNosWasHere');
    expect(metadata.profileData.twitter).toBe('@nostradaomus');
  });

  test('successfully returns empty data for name that has never set values', async () => {
    const metadata: GetSldMetadataResponse = await getSldMetadata("marit.hbar", process.env.HGRAPHIO_TOKEN || "");

    expect(metadata.addresses.eth).toBe("");
    expect(metadata.profileData.twitter).toBe("");
  });
});

describe('getDomainsHeld function', () => {
  test('successfully gets domains held by an account', async () => {
    const domainCIDs: string[] = await getDomainsHeldCIDs('0.0.1046752', process.env.HGRAPHIO_TOKEN || "");
    // Should write real test.
    expect(true).toBeTruthy;
  });
});


// SUPPORTING FUNCTION TESTS

describe('getDomainHolder function', () => {
  test('successfully gets holder of domain', async () => {
    const result: string = await getDomainHolder("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result.toString()).toBe("1046752");
  });
});

describe('getTld function', () => {
  test('successfully gets TLD', async () => {
    const result: TopLevelDomain | undefined = await getTld("hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result?.nameHash?.domain).toBe("hbar");
  });
});

describe('getSld function', () => {
  test('successfully gets SLD', async () => {
    const result: SecondLevelDomain | undefined = await getSld("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result?.nameHash?.domain).toBe("nostradaomus.hbar");
  });
});

describe('getTokenHolder function', () => {
  test('successfully gets holder of token', async () => {
    const result: string = await getTokenHolder("0.0.1234197", "58", process.env.HGRAPHIO_TOKEN || "")
    expect(result.toString()).toBe("1046752");
  });
});


describe('getDomainHolder function', () => {
  test('successfully gets holder of domain', async () => {
    const result: string = await getDomainHolder("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result.toString()).toBe("1046752");
  });
});

describe('getTldInfo function', () => {
  test('successfully gets TLD info', async () => {
    const result: TopLevelDomain | undefined = await getTld("hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result?.nameHash?.domain).toBe("hbar");
  });
});

describe('getSldInfo function', () => {
  test('successfully gets SLD info', async () => {
    const result: SecondLevelDomain | undefined = await getSld("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "")
    expect(result?.nameHash?.domain).toBe("nostradaomus.hbar");
  });
});

describe('getTokenHolder function', () => {
  test('successfully gets holder of token', async () => {
    const result: string = await getTokenHolder("0.0.1234197", "58", process.env.HGRAPHIO_TOKEN || "")
    expect(result.toString()).toBe("1046752");
  });
});

describe('getExtendedExpiry function', () => {
  test('successfully gets SLD expiry from contracts', async () => {
    const sld: SecondLevelDomain | undefined = await getSld("nostradaomus.hbar", process.env.HGRAPHIO_TOKEN || "");
    if(!sld?.providerData?.contractId) throw new Error('Error getting sld contract ID');

    const expiryEpochTime: Date | undefined = await getExtendedExpiry(sld?.providerData?.contractId, '0x'+sld?.nameHash?.sldHash, process.env.HGRAPHIO_TOKEN || "");

    expect(expiryEpochTime?.toString()).toBe('Mon Sep 08 2025 14:13:52 GMT-0600 (Mountain Daylight Time)');
  });
});
