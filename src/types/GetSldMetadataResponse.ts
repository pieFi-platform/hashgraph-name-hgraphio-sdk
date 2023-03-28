export interface GetSldMetadataResponse {
  addresses: AddressResponse;
  profileData: ProfileDataResponse;
}

export interface AddressResponse {
  eth: string;
  btc: string;
  sol: string;
}

export interface ProfileDataResponse {
  avatar: string;
  twitter: string;
  email: string;
  url: string;
  description: string;
  keywords: string;
  discord: string;
  github: string;
  reddit: string;
  telegram: string;
  extras: string;
}

export const getSldMetadataResponse = (addressArr: string[], profileDataArr: string[]): GetSldMetadataResponse => {
  const addresses: AddressResponse = getAddressResponse(addressArr);
  const profileData: ProfileDataResponse = getProfileDataResponse(profileDataArr);

  const response: GetSldMetadataResponse = {
    addresses: addresses,
    profileData: profileData
  };

  return response;
}

export const getAddressResponse = (arr: string[]): AddressResponse => {
  const response: AddressResponse = emptyAddressResponse();

  response.eth = arr[0]
  response.btc = arr[1]
  response.sol = arr[2]

  return response;
};

export const getProfileDataResponse = (arr: string[]): ProfileDataResponse => {
  const response: ProfileDataResponse = emptyProfileDataResponse();

  response.avatar = arr[0]
  response.twitter = arr[1]
  response.email = arr[2]
  response.url = arr[3]
  response.description = arr[4]
  response.keywords = arr[5]
  response.discord = arr[6]
  response.github = arr[7]
  response.reddit = arr[8]
  response.telegram = arr[9]
  response.extras = arr[10]

  return response;
};

export const emptyGetSldMetadataResponse = (): GetSldMetadataResponse => ({
    addresses: emptyAddressResponse(),
    profileData: emptyProfileDataResponse()
});


export const emptyAddressResponse = (): AddressResponse => ({
    eth: '',
    btc: '',
    sol: '',

});

export const emptyProfileDataResponse = (): ProfileDataResponse => ({
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
