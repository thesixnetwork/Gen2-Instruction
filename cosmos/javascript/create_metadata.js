const { SixDataChainConnector } = require("@sixnetwork/six-data-chain-sdk");
const fs = require("fs");
const { GasPrice, calculateFee } = require("@cosmjs/stargate/build/fee");

// main functoion
// arguments:
// 1. metadata file path
// 2. secret file path

async function main({ metadataPath, secretPath }) {
    // read text from secret file arghument argv[3]
    const secret = fs.readFileSync(secretPath, "utf8");

    const sixConnector = new SixDataChainConnector();
    let accountSigner;
    sixConnector.rpcUrl = "https://rpc2.fivenet.sixprotocol.net:443";
    // const accountSigner = await sixConnector.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    accountSigner = await sixConnector.accounts.mnemonicKeyToAccount(secret);
    const metadata = require(metadataPath);

    const address = (await accountSigner.getAccounts())[0].address;
    const rpcClient = await sixConnector.connectRPCClient(accountSigner, {
        gasPrice: GasPrice.fromString("1.25usix"),
    });

    let msgArray = [];
    let encodeBase64Metadata = Buffer.from(
        JSON.stringify(metadata)
      ).toString("base64");
    const msgCreateMetaData = {
        creator: address,
        nftSchemaCode: metadata.nft_schema_code,
        tokenId: metadata.token_id,
        base64NFTData: encodeBase64Metadata,
    };

    const msgMintData = await rpcClient.nftmngrModule.msgCreateMetadata(
        msgCreateMetaData
    );

    msgArray.push(msgMintData);

    // start
    const txResponse = await rpcClient.nftmngrModule.signAndBroadcast(
        msgArray,
        {
            fee: "auto",
            memo: "Mint NFT Metadata Token",
        }
    );

    if (txResponse.code !== 0) {
        console.log(txResponse.rawLog);
    }
    if (txResponse.code === 0) {
        console.log(
            `gasUsed: ${txResponse.gasUsed}\ngasWanted:${txResponse.gasWanted}\nhash:${txResponse.transactionHash}\n`
        );
    }
}

// run main function
main({
    metadataPath: "./concert_ticket/metadata_token1.json",
    secretPath: "./.secret",
});
