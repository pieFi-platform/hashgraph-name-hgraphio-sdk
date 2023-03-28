export interface TopLevelDomain {
  nameHash: NameHash;
  topicId: string;
  contractId: string;
  tokenId: string;
}

export interface SecondLevelDomain {
  transactionId: string;
  nameHash: NameHash;
  nftId: string;
  expiry: string;
  expiration: string;
  provider: string;
  providerData: {
    contractId: string;
  }
  sequenceNumber: number;
}

export interface NameHash {
  domain: string;
  tldHash: Buffer;
  sldHash: Buffer;
}


