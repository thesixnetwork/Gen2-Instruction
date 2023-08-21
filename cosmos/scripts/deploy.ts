import { SixDataChainConnector } from "../sdk/client"; // @sixnetwork/six-data-chain-sdk   
import { fee, ITxNFTmngr } from "../sdk"; // @sixnetwork/six-data-chain-sdk 
import { EncodeObject } from "@cosmjs/proto-signing";
import { BASE64 } from "../sdk/helper/base64"; // @sixnetwork/six-data-chain-sdk 
import { GasPrice, calculateFee } from "@cosmjs/stargate/build/fee"; 
import dotenv from "dotenv";
dotenv.config();

import exmapleSchema from "../resources/nft-schema-example.json";

const ORG_NAME = "MY_ORG_NAME";
const SCHEMA_NAME = "MY_SCHEMA_NAME";
const schemaCode = `${ORG_NAME}.${SCHEMA_NAME}`;
exmapleSchema.code = schemaCode

export const Deploy = async () => {
  const sixConnector = new SixDataChainConnector();
  let accountSigner;
  const network = process.argv[2];

  if (network === "local") {
    // ** LOCAL TESTNET **
    sixConnector.rpcUrl = "http://localhost:26657";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(
    //   process.env.ALICE_PRIVATE_KEY
    // );
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.ALICE_MNEMONIC!
    );
  } else if (network === "fivenet") {
    // ** FIVENET **
    sixConnector.rpcUrl = "https://rpc2.fivenet.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.ADDRESS_KLANG_MNEMONIC
    );
  } else if (network === "sixnet") {
    // ** SIXNET **
    sixConnector.rpcUrl = "https://sixnet-rpc.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.TECHSAUCE_MNEMONIC
    );
  } else {
    throw new Error("Invalid network");
  }
  const address = (await accountSigner.getAccounts())[0].address;
  const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
    gasPrice: GasPrice.fromString("1.25usix"),
  });

  let msgArray: Array<EncodeObject> = [];

  let encodeBase64Schema = Buffer.from(JSON.stringify(exmapleSchema)).toString(
    "base64"
  );
  const msgCreateNFTSchema: ITxNFTmngr.MsgCreateNFTSchema = {
    creator: address,
    nftSchemaBase64: encodeBase64Schema,
  };

  const msg = await rpcClient.nftmngrModule.msgCreateNFTSchema(
    msgCreateNFTSchema
  );

  msgArray.push(msg);

  const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(msgArray, {
    fee: "auto",
  });
  if (txResponse.code) {
    console.log(txResponse.rawLog);
  }
  console.log(
    `gasUsed: ${txResponse.gasUsed}\ngasWanted:${txResponse.gasWanted}\n`
  );
  return txResponse;
};

// ask to enter confirmmation
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `Are you sure you want to deploy ${schemaCode} to ${process.argv[2]} (y/n)?`,
  (answer) => {
    if (
      answer === "y" ||
      answer === "Y" ||
      answer === "yes" ||
      answer === "Yes"
    ) {
      console.log("deploying...");
      Deploy();
    } else {
      console.log("aborting...");
      process.exit(1);
    }
    readline.close();
  }
);
