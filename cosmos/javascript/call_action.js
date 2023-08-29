const { SixDataChainConnector } = require("@sixnetwork/six-data-chain-sdk");
const fs = require("fs");
const { GasPrice, calculateFee } = require("@cosmjs/stargate/build/fee");
const { v4 } = require("uuid")

// main functoion

async function main({ schemaCode, tokenId, actionName, secretPath }) {
    // read text from secret file arghument argv[3]
    const secret = fs.readFileSync(secretPath, "utf8");

    const sixConnector = new SixDataChainConnector();
    let accountSigner;
    sixConnector.rpcUrl = "https://rpc2.fivenet.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(secret);

    const address = (await accountSigner.getAccounts())[0].address;
    const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
        gasPrice: GasPrice.fromString("1.25usix"),
    });

    let msgArray = [];
    const ref_id = v4();
    const action = {
        creator: address,
        nft_schema_code: schemaCode,
        tokenId: tokenId,
        action: actionName,
        ref_id: `${ref_id}`,
        parameters: [],
    };
    const msg = await rpcClient.nftmngrModule.msgPerformActionByAdmin(action);
    msgArray.push(msg);
    const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(
        msgArray,
        {
            fee: "auto",
            memo: `${ref_id}`,
        }
    );
    console.log(txResponse);
}

// run main function
main(
    { 
        schemaCode : "bank.concert_ticket.v0.01", 
        tokenId : "1",
        actionName : "check_in_zone1",
        secretPath: "./.secret" 
    }
);
