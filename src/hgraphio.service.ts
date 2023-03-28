export function fetchQueryResults(query: string, queryName: string, hgraphioToken: string): Promise<any> {
  return fetchGraphQL(
    query,
    queryName,
    {},
    hgraphioToken
  );
}

const fetchGraphQL = async (query: string, operationName: string, variables: any, hgraphioToken: string): Promise<any> => {
  const result = await fetch(
    "https://api.hgraph.io/v1/graphql",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + hgraphioToken
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}

export const fetchTopicMessages = async (topicId:string, hgraphioToken: string): Promise<any> => {
  return await fetchQueryResults(getTopicMessagesQuery(topicId), "TopicMessages", hgraphioToken);
}

const getTopicMessagesQuery = (topicId: string): string => {
  return `
    query TopicMessages {
      topic_message(where: {topic_id: {_eq: ${topicId}}}) {
        initial_transaction_id
        payer_account_id
        valid_start_timestamp
        message
        sequence_number
        running_hash
        consensus_timestamp
      }
    }
  `
}

export const fetchContractLogs = async (contractId: string, hashedMethodSig: string, hgraphioToken: string): Promise<any> => {
  return await fetchQueryResults(getContractLogsQuery(contractId, hashedMethodSig), "ContractLogs", hgraphioToken);
}

function getContractLogsQuery(contractId: string, hashedMethodSig: string): string {
  return `
    query ContractLogs {
      contract_log(
        where: {topic0: {_eq: "${hashedMethodSig}"}, contract_id: {_eq: "${contractId}"}}
        order_by: {consensus_timestamp: desc}
      ) {
          contract_id
          data
          consensus_timestamp
        }
    }
  `
};

export const getTokenHolder = async (tokenId: string, serialNumber: string, hgraphioToken: string): Promise<string> => {
  const { errors, data } = await fetchTokenHolder(tokenId.split('.')[2], serialNumber, hgraphioToken);

  if (errors) throw new Error('Error getting token holder for tokenId: ' + tokenId + ' and serialNumber ' + serialNumber);

  const result = data?.nft_by_pk?.account_id;

  return result;
};

export const fetchTokenHolder = async (tokenId:string, serialNumber: string, hgraphioToken: string): Promise<any> => {
  return await fetchQueryResults(getTokenHolderQuery(tokenId, serialNumber), "TokenHolder", hgraphioToken);
}

const getTokenHolderQuery = (tokenId: string, serialNumber: string): string => {
  return `
    query TokenHolder {
      nft_by_pk(token_id: "${tokenId}", serial_number: "${serialNumber}" ) {
        account_id
        created_timestamp
        serial_number
        token_id
      }
    }
  `
}

export const fetchNFTsHeld = async (tokenId: string, accountId: string, hgraphioToken: string): Promise<any> => {
  return await fetchQueryResults(getNFTsHeldQuery(tokenId, accountId), "NFTsHeldQuery", hgraphioToken);
}

const getNFTsHeldQuery = (tokenId: string, accountId: string): string => {
  return `
    query NFTsHeldQuery {
      nft(where: {token_id: {_eq: "${tokenId}"}, account_id: {_eq: "${accountId}"}}) {
        account_id
        token_id
        serial_number
        metadata
      }
    }
  `
}
