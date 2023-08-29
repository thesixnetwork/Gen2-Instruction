const { SixDataChainConnector } = require("@sixnetwork/six-data-chain-sdk");
const fs = require("fs");
const { GasPrice, calculateFee } =require( "@cosmjs/stargate/build/fee");


// main functoion
// arguments:
// 1. schema file path
// 2. secret file path

async function main({
    schemaPath,
    secretPath,
}) {
    // read text from secret file arghument argv[3]
    const secret = fs.readFileSync(secretPath, "utf8");

    const sixConnector = new SixDataChainConnector();
    let accountSigner;
    sixConnector.rpcUrl = "https://rpc2.fivenet.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(secret);
    const schemaFilePath = schemaPath;
    const schema = require(schemaFilePath);

    const address = (await accountSigner.getAccounts())[0].address;
    const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
        gasPrice: GasPrice.fromString("1.25usix"),
    });

    let msgArray = [];

    let encodeBase64Schema = Buffer.from(
        JSON.stringify(schema)
    ).toString("base64");
    const msgCreateNFTSchema = {
        creator: address,
        nftSchemaBase64: encodeBase64Schema,
    };

    const msg = await rpcClient.nftmngrModule.msgCreateNFTSchema(
        msgCreateNFTSchema
    );

    msgArray.push(msg);

    const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(
        msgArray,
        {
            fee: "auto",
        }
    );
    if (txResponse.code) {
        console.log(txResponse.rawLog);
    }
    console.log(
        `gasUsed: ${txResponse.gasUsed}\ngasWanted:${txResponse.gasWanted}\n`
    );
}

// run main function
main(
    {
        schemaPath: "./concert_ticket/schema.json",
        secretPath: "./.secret",
    }
);
