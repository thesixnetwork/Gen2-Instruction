import { SixDataChainConnector } from "../sdk/client"; // @sixnetwork/six-data-chain-sdk   
import { fee, ITxNFTmngr } from "../sdk"; // @sixnetwork/six-data-chain-sdk 
import { EncodeObject } from "@cosmjs/proto-signing";
import { BASE64 } from "../sdk/helper/base64"; // @sixnetwork/six-data-chain-sdk 
import ORIGINAL_METADATA from "../resources/nft-metadata-example.json";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const ORG_NAME = "MY_ORG_NAME";
const SCHEMA_NAME = "MY_SCHEMA_NAME";
const schemaCode = `${ORG_NAME}/${SCHEMA_NAME}`;
// replace with your own schema code
ORIGINAL_METADATA.nft_schema_code = schemaCode;


const token_id = "1";

// ** MINT NFT **
ORIGINAL_METADATA.token_id = token_id;

const Mint = async () => {
  console.log("Minting...");
  // console.time("Minting time");
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

  // ** CORE CONCEPT **
  const address = (await accountSigner.getAccounts())[0].address;
  const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
    gasPrice: fee.GasPrice.fromString("1.25usix"),
  });
  const apiClient = await sixConnector.connectAPIClient();
  let msgArray: Array<EncodeObject> = [];

  let encodeBase64Metadata = Buffer.from(
    JSON.stringify(ORIGINAL_METADATA)
  ).toString("base64");
  const msgCreateMetaData: ITxNFTmngr.MsgCreateMetadata = {
    creator: address,
    nftSchemaCode: schemaCode,
    tokenId: token_id,
    base64NFTData: encodeBase64Metadata,
  };

  const msgMintData = await rpcClient.nftmngrModule.msgCreateMetadata(
    msgCreateMetaData
  );

  msgArray.push(msgMintData);

  // start
  const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(msgArray, {
    fee: "auto",
    memo: "Mint NFT Metadata Token",
  });

  if (txResponse.code !== 0) {
    console.log(txResponse.rawLog);
  }
  if (txResponse.code === 0) {
    console.log(
      `gasUsed: ${txResponse.gasUsed}\ngasWanted:${txResponse.gasWanted}\nhash:${txResponse.transactionHash}\n`
    );
  }

};

// ask to enter confirmmation
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `Are you sure you want to mint ${schemaCode} ${token_id} to ${process.argv[2]} (y/n)?`,
  (answer) => {
    if (
      answer === "y" ||
      answer === "Y" ||
      answer === "yes" ||
      answer === "Yes"
    ) {
      console.log("Minting...");
        Mint().then(() => {
        console.log("Done");
        process.exit(0);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      console.log("aborting...");
      process.exit(1);
    }
    readline.close();
  }
);
