import * as fs from 'fs';
import Web3 from 'web3';

const web3 = new Web3();

function loadSldAbi() {
  return JSON.parse(fs.readFileSync('./src/sldNode.abi', 'utf8'));
}

export function loadSldFunctionAbi(functionName: string): any {
  const abi = loadSldAbi();
  return abi.find((func: any) => func.name === functionName);
}

export function decodeResponse(parameters: any, result: string): any {
  return web3.eth.abi.decodeParameters(parameters, result);
};

