import keccak256 from 'keccak256';

import { fetchContractLogs, fetchTopicMessages, getTokenHolder, fetchNFTsHeld } from './hgraphio.service';
import { loadSldFunctionAbi, decodeResponse} from './abi.service';

import {
  GetSldMetadataResponse,
  AddressResponse,
  ProfileDataResponse,
  getSldMetadataResponse,
  getAddressResponse,
  getProfileDataResponse,
  emptyGetSldMetadataResponse,
  emptyAddressResponse,
  emptyProfileDataResponse
} from './types/GetSldMetadataResponse';

import { GetSldInfoResponse } from './types/GetSldInfoResponse';
import { TopicMessage } from './types/TopicMessage';
import { TopLevelDomain, SecondLevelDomain } from './types/Domains';
import { TLD_TOPIC_ID, HBAR_TOKEN_ID, BOO_TOKEN_ID, CREAM_TOKEN_ID } from './constants';

const hex2ascii = require('hex2ascii');


const extendExpirySigHash: any = '\\\\x' + keccak256("ExtendExpiry(bytes32,uint256,uint256)").toString('hex');
const extendExpiryParameters: any = loadSldFunctionAbi("ExtendExpiry").inputs;
const setSLDInfoSigHash = '\\\\x' + keccak256("SetSLDInfo(bytes32,string[],string[])").toString('hex');
const setSLDInfoParameters = loadSldFunctionAbi("SetSLDInfo").inputs;


// PRIMARY METHODS

export const getSldInfo = async (sldName: string, hgraphioToken: string): Promise<GetSldInfoResponse> => {
  const name: string = sldName;
  const tld: string = sldName.split('.')[1];

  const sldMessage: SecondLevelDomain | undefined = await getSld(sldName, hgraphioToken);
  if(!sldMessage) return {
    name: name,
    isAvailable: true,
    tld: tld,
    controller: "",
    expiration: "",
    provider: ""
  };

  const [tokenId, serialNumber]: string[] = sldMessage.nftId.split(':');

  const isAvailable: boolean = false;
  const controller: string = await getTokenHolder(tokenId, serialNumber, hgraphioToken);
  const provider: string = sldMessage.provider;
  let expiration: string = sldMessage.expiration;
  if(provider !== 'piefi labs') expiration = '';

  const response: GetSldInfoResponse = {
    name: name,
    isAvailable: isAvailable,
    tld: tld,
    controller: '0.0.' + controller,
    expiration: expiration,
    provider: provider,
  };

  return response;
};

export async function getSldMetadata(sldName:string, hgraphioToken: string): Promise<GetSldMetadataResponse> {
  const sld: SecondLevelDomain | undefined = await getSld(sldName, process.env.HGRAPHIO_TOKEN || "");
  if(!sld?.providerData?.contractId || !sld?.nameHash?.sldHash) throw new Error('Error getting sld contract ID and SLD hash');

  if(!sld.provider || sld.provider !== "piefi labs") throw new Error('Domain metadata only available for hashgraph names');

  const contractAddress = sld.providerData.contractId.split(".")[2];
  const sldHash = '0x'+sld.nameHash.sldHash

  const { errors, data } = await fetchContractLogs(contractAddress, setSLDInfoSigHash, hgraphioToken);
  if (errors) console.error(errors);

  const logs = data.contract_log.map((log: any) => {
    if(log.data) log.data = decodeResponse(setSLDInfoParameters, log.data.toString().split("\\x")[1]);
    return log;
  });
  const results = logs.find((log: any) => log.data["0"] === sldHash);
  if(!results || !results.data) return emptyGetSldMetadataResponse();

  const response: GetSldMetadataResponse = getSldMetadataResponse(results.data["1"], results.data["2"]);

  return response;
}

export async function getDomainsHeldCIDs(accountId: string, hgraphioToken: string): Promise<string[]> {
  const strippedAccountId: string = accountId.split('.')[2];

  const hbarDomainsResponse: any = await fetchNFTsHeld(HBAR_TOKEN_ID, strippedAccountId, hgraphioToken);
  const hbarNfts: any[] = hbarDomainsResponse.data.nft;
  const hbarDomainCIDs = hbarNfts.map((domain: any) => hex2ascii(domain.metadata));

  const booDomainsResponse: any = await fetchNFTsHeld(BOO_TOKEN_ID, strippedAccountId, hgraphioToken);
  const booNfts: any[] = booDomainsResponse.data.nft;
  const booDomainCIDs = booNfts.map((domain: any) => hex2ascii(domain.metadata));

  const creamDomainsResponse: any = await fetchNFTsHeld(CREAM_TOKEN_ID, strippedAccountId, hgraphioToken);
  const creamNfts: any[] = creamDomainsResponse.data.nft;
  const creamDomainCIDs = creamNfts.map((domain: any) => hex2ascii(domain.metadata));

  return hbarDomainCIDs.concat(booDomainCIDs, creamDomainCIDs);
}


// SUPPORTING METHODS

export const getDomainHolder = async (sldName: string, hgraphioToken: string): Promise<string> => {
  const sldMessage: SecondLevelDomain | undefined = await getSld(sldName, hgraphioToken);
  if(!sldMessage) return "";

  const [tokenId, serialNumber]: string[] = sldMessage.nftId.split(':');
  const result: string = await getTokenHolder(tokenId, serialNumber, hgraphioToken);

  return result;
};

export const getTld = async (tldName: string, hgraphioToken: string): Promise<TopLevelDomain | undefined> => {
  const { errors, data } = await fetchTopicMessages(TLD_TOPIC_ID, hgraphioToken);

  if (errors) throw new Error('Error getting tld info');

  const domains: TopLevelDomain[] = data.topic_message.map((message: TopicMessage) => message.message = JSON.parse(hex2ascii(message.message)));
  const result: TopLevelDomain | undefined = domains.find(message => message.nameHash.domain === tldName);

  return result;
}

export const getSld = async (sldName: string, hgraphioToken: string): Promise<SecondLevelDomain | undefined> => {
  const tld: TopLevelDomain | undefined = await getTld(sldName.split('.')[1], hgraphioToken);
  if(!tld) throw new Error('Provided top level domain does not have a message on the topic');

  const { errors, data } = await fetchTopicMessages(tld.topicId.split('.')[2], hgraphioToken);

  if (errors) throw new Error('Error getting sld info');

  const domains: SecondLevelDomain[] = data.topic_message.map((message: TopicMessage) => message.message = JSON.parse(hex2ascii(message.message)));
  let sld: SecondLevelDomain | undefined = domains.find(message => message.nameHash.domain === sldName);
  if(!sld) return undefined;

  if(sld.provider === 'piefi labs') {
    const sldContractId: string = sld.providerData?.contractId;
    const sldHash: string = '0x'+sld?.nameHash?.sldHash;
    const sldExpiry: Date | undefined = await getExtendedExpiry(sldContractId, sldHash, hgraphioToken);

    let expirationDate: Date;
    sldExpiry ? expirationDate = sldExpiry : expirationDate = new Date(parseInt(sld.expiration) * 1000);
    const today: Date = new Date();
    if(today > expirationDate) return undefined;
    sld.expiration = expirationDate.toUTCString();
  }

  return sld;
}

export async function getExtendedExpiry(contractId: string, sldHash: string, hgraphioToken: string): Promise<Date | undefined> {
  const contractAddress: string = contractId.split(".")[2];

  const { errors, data } = await fetchContractLogs(contractAddress, extendExpirySigHash, hgraphioToken);
  if (errors) console.error(errors);

  const logs: any = data.contract_log.map((log: any) => {
    if(log.data) log.data = decodeResponse(extendExpiryParameters, log.data.toString().split("\\x")[1]);
    return log;
  });
  const results: any = logs.find((log: any) => log.data["0"] === sldHash);
  if(!results) return undefined;

  const expiryEpochTime: any = results?.data["2"];
  if(!expiryEpochTime) throw new Error('No expiry found on name');

  const date: Date = new Date(0);
  date.setUTCSeconds(expiryEpochTime);

  return date;
}
