import { SixDataChainConnector } from "../../sdk/client";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const queryAddress = "6x1m53akq8td5tc9gq6wge47gqglaaq649q3l7jlm"

const Balance = async () => {
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
      process.env.MNEMONIC
    );
  } else {
    throw new Error("Invalid network");
  }

  const apiClient = await sixConnector.connectAPIClient();
    try {
      const balance = await apiClient.cosmosBankModule.queryBalance(queryAddress, {
        denom: "usix"
      });
      // if token has been minted, skip to next token
      // update to key
      if (balance.data) {
        const token = parseInt(balance.data?.balance.amount) / 1000000;
        console.log(token);
      }
    } catch (e) {
      console.log("token not found", e.error);
    }
};

// create one metadata for test on production which is token_id = 2531
Balance().then(() => {
  console.log("Done");
  process.exit(0);
}).catch((e) => {
  console.log(e);
  process.exit(1);
});