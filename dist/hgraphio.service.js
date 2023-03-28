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
exports.fetchNFTsHeld = exports.fetchTokenHolder = exports.getTokenHolder = exports.fetchContractLogs = exports.fetchTopicMessages = exports.fetchQueryResults = void 0;
function fetchQueryResults(query, queryName, hgraphioToken) {
    return fetchGraphQL(query, queryName, {}, hgraphioToken);
}
exports.fetchQueryResults = fetchQueryResults;
const fetchGraphQL = (query, operationName, variables, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fetch("https://api.hgraph.io/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + hgraphioToken
        },
        body: JSON.stringify({
            query: query,
            variables: variables,
            operationName: operationName
        })
    });
    return yield result.json();
});
const fetchTopicMessages = (topicId, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchQueryResults(getTopicMessagesQuery(topicId), "TopicMessages", hgraphioToken);
});
exports.fetchTopicMessages = fetchTopicMessages;
const getTopicMessagesQuery = (topicId) => {
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
  `;
};
const fetchContractLogs = (contractId, hashedMethodSig, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchQueryResults(getContractLogsQuery(contractId, hashedMethodSig), "ContractLogs", hgraphioToken);
});
exports.fetchContractLogs = fetchContractLogs;
function getContractLogsQuery(contractId, hashedMethodSig) {
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
  `;
}
;
const getTokenHolder = (tokenId, serialNumber, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { errors, data } = yield (0, exports.fetchTokenHolder)(tokenId.split('.')[2], serialNumber, hgraphioToken);
    if (errors)
        throw new Error('Error getting token holder for tokenId: ' + tokenId + ' and serialNumber ' + serialNumber);
    const result = (_a = data === null || data === void 0 ? void 0 : data.nft_by_pk) === null || _a === void 0 ? void 0 : _a.account_id;
    return result;
});
exports.getTokenHolder = getTokenHolder;
const fetchTokenHolder = (tokenId, serialNumber, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchQueryResults(getTokenHolderQuery(tokenId, serialNumber), "TokenHolder", hgraphioToken);
});
exports.fetchTokenHolder = fetchTokenHolder;
const getTokenHolderQuery = (tokenId, serialNumber) => {
    return `
    query TokenHolder {
      nft_by_pk(token_id: "${tokenId}", serial_number: "${serialNumber}" ) {
        account_id
        created_timestamp
        serial_number
        token_id
      }
    }
  `;
};
const fetchNFTsHeld = (tokenId, accountId, hgraphioToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchQueryResults(getNFTsHeldQuery(tokenId, accountId), "NFTsHeldQuery", hgraphioToken);
});
exports.fetchNFTsHeld = fetchNFTsHeld;
const getNFTsHeldQuery = (tokenId, accountId) => {
    return `
    query NFTsHeldQuery {
      nft(where: {token_id: {_eq: "${tokenId}"}, account_id: {_eq: "${accountId}"}}) {
        account_id
        token_id
        serial_number
        metadata
      }
    }
  `;
};
