import { SixDataChainConnector } from "../sdk/client";
import { EncodeObject } from "@cosmjs/proto-signing";
import { ITxNFTmngr } from "../sdk";
import NFTSchema from "../resources/nft-schema-example.json";
import { GasPrice, calculateFee } from "@cosmjs/stargate/build/fee";
import dotenv from "dotenv";
import { v4 } from "uuid";
import fs from "fs";
dotenv.config();

const ORG_NAME = "MY_ORG_NAME";
const SCHEMA_NAME = "MY_SCHEMA_NAME";
const schemaCode = `${ORG_NAME}.${SCHEMA_NAME}`;
const token_id = "1";


const main = async () => {
  const sixConnector = new SixDataChainConnector();
  let accountSigner;
  const network = process.argv[2];

  if (network === "local") {
    // ** LOCAL TESTNET **
    sixConnector.rpcUrl = "http://localhost:26657";
    sixConnector.apiUrl = "http://localhost:1317";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(
    //   process.env.ALICE_PRIVATE_KEY
    // );
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.ALICE_MNEMONIC!
    );
  } else if (network === "fivenet") {
    // ** FIVENET **
    sixConnector.rpcUrl = "https://rpc2.fivenet.sixprotocol.net:443";
    sixConnector.apiUrl = "https://api1.fivenet.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.MNEMONIC
    );
  } else if (network === "sixnet") {
    // ** SIXNET **
    sixConnector.rpcUrl = "https://sixnet-rpc.sixprotocol.net:443";
    sixConnector.apiUrl = "https://sixnet-api.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(
      process.env.TECHSAUCE_MNEMONIC
    );
  } else {
    throw new Error("Invalid network");
  }
  // Get index of account
  const address = (await accountSigner.getAccounts())[0].address;
  const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
    gasPrice: GasPrice.fromString("1.25usix"),
  });

  const msgArray: Array<EncodeObject> = [];
  const ref_id = v4();
  const action: ITxNFTmngr.MsgPerformActionByAdmin = {
    creator: address,
    nft_schema_code: schemaCode,
    tokenId: token_id,
    action: "check_in",
    ref_id: `${ref_id}`,
    parameters: [],
  };
  const msg = await rpcClient.nftmngrModule.msgPerformActionByAdmin(action);
  msgArray.push(msg);
  const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(msgArray, {
    fee: "auto",
    memo: `${ref_id}`,
  });
  console.log(txResponse);
};

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
