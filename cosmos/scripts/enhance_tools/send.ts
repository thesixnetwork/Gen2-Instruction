import { ethers } from "ethers";
import { SixDataChainConnector } from "../../sdk/client";
import { EncodeObject } from "@cosmjs/proto-signing";
import { typesTxBank } from "../../sdk";
import { GasPrice, calculateFee } from "@cosmjs/stargate/build/fee";
import dotenv from "dotenv";

dotenv.config();
const network = process.argv[2]; // input network
const amount = process.argv[3]; // input six amount
const six_amount = parseInt(amount) * 1_000_000; // convert to usix

const dst_address = "6x1m53akq8td5tc9gq6wge47gqglaaq649q3l7jlm"; // replace with your own destination address

const cosmosSend = async () => {
  const sixConnector = new SixDataChainConnector();
  let accountSigner;

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
      process.env.ADDRESS_KLANG_MNEMONIC
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

  const address = (await accountSigner.getAccounts())[0].address;
  const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
    gasPrice: GasPrice.fromString("1.25usix"),
  });

  let msgArray: Array<EncodeObject> = [];

  const send: typesTxBank.MsgSend = {
    from_address: address,
    to_address: dst_address,
    amount: [
      {
        denom: "usix",
        amount: six_amount.toString(),
      },
    ],
  };

  const msg = await rpcClient.cosmosBankModule.msgSend(send);
  msgArray.push(msg);

  const txResponse = await rpcClient.cosmosBankModule.signAndBroadcast(
    msgArray,
    {
      fee: "auto",
      memo: "send to system actioner",
    }
  );
  console.log(txResponse);
};

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `Are you sure you want to send ${amount} SIX ON ${process.argv[2]} to all actionSigner? (y/n)?`,
  (answer) => {
    if (
      answer === "y" ||
      answer === "Y" ||
      answer === "yes" ||
      answer === "Yes"
    ) {
      console.log("Sending coint to system actioner ...");
      cosmosSend()
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
