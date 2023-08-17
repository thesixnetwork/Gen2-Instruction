import { SixDataChainConnector } from "../sdk/client";
import { EncodeObject } from "@cosmjs/proto-signing";
import { ITxNFTmngr } from "../sdk";
import NFTSchema from "../resources/metadata_techsause/nft-schema.json"
import { GasPrice, calculateFee } from "@cosmjs/stargate/build/fee";
import dotenv from "dotenv";
import { v4 } from 'uuid';
import fs from "fs";;
dotenv.config();

const schemaCode = "TechSauce.GlobalSummit2023Mockingv9";

const main = async () => {
  console.time("checkin");
  const sixConnector = new SixDataChainConnector();
  // ** LOCAL TESTNET **
  // sixConnector.rpcUrl = "http://localhost:26657";
  // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.ALICE_PRIVATE_KEY!);
  // const accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(process.env.ALICE_MNEMONIC);

  // ** FIVENET **
  sixConnector.rpcUrl = "https://rpc1.fivenet.sixprotocol.net:443";
  // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY!);
  const accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(process.env.MNEMONIC!);
  // Get index of account
  const address = (await accountSigner.getAccounts())[0].address;
  const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
    gasPrice: GasPrice.fromString("1.25usix"),
  });

  const msgArray: Array<EncodeObject> = [];
  const ref_id = v4();
  let token_id = String(64);
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

main().then(() => {
  console.log("done");
}
).catch((err) => {
  console.log(err);
});