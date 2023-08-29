import { SixDataChainConnector } from "../../sdk/client";
import { EncodeObject } from "@cosmjs/proto-signing";
import { typesTxNFTManager } from "../../sdk";
import { GasPrice } from "@cosmjs/stargate/build/fee";
import dotenv from "dotenv";

dotenv.config();


const ORG_NAME = "MY_ORG_NAME";
const SCHEMA_NAME = "MY_SCHEMA_NAME";
const schemaCode = `${ORG_NAME}/${SCHEMA_NAME}`;
const systemActioner = "6x1m53akq8td5tc9gq6wge47gqglaaq649q3l7jlm";

const addSystemActioner = async () => {
  const sixConnector = new SixDataChainConnector();
  let accountSigner;
  const network = process.argv[2];

  if (network === "local") {
    // ** LOCAL TESTNET **
    sixConnector.rpcUrl = "http://localhost:26657";
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

  const addSystemAction: typesTxNFTManager.MsgRemoveSystemActioner = {
    creator: address,
    nftSchemaCode: schemaCode,
    actioner: systemActioner,
  };

  const msg = await rpcClient.nftmngrModule.msgRemoveSystemActioner(
    addSystemAction
  );
  msgArray.push(msg);
  const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(msgArray, {
    fee: "auto",
    memo: "add System To TechSauce.GlobalSummit2023Mockingv9",
  });
  console.log(txResponse);
};


// ask to enter confirmmation
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `Are you sure you want to add System actioner ${schemaCode} to ${process.argv[2]} (y/n)?`,
  (answer) => {
    if (
      answer === "y" ||
      answer === "Y" ||
      answer === "yes" ||
      answer === "Yes"
    ) {
      console.log("Adding System actioner...");
      addSystemActioner()
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      console.log("aborting...");
      process.exit(1);
    }
    readline.close();
  }
);

