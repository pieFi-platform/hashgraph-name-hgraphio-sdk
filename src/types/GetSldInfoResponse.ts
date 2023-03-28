export interface GetSldInfoResponse {
  name: string;
  isAvailable: boolean;
  tld: string;
  controller: string;
  expiration: string | undefined;
  provider: string;
}

export const emptyGetSldInfoResponse = (): GetSldInfoResponse => ({
    name: '',
    isAvailable: false,
    tld: '',
    controller: '',
    expiration: undefined,
    provider: '',
});


