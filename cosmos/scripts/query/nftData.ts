import { SixDataChainConnector } from "../../sdk/client";
import { fee, ITxNFTmngr } from "../../sdk";
import { BASE64 } from "../../sdk/helper/base64";
import { EncodeObject } from "@cosmjs/proto-signing";
import ORIGINAL_METADATA from "../../resources/metadata_techsause/nft-data.json";
import fs from "fs";
import dotenv from "dotenv";

import ALL_EXHIBITOR from "../../resources/metadata_techsause/all-objects-exhibitor.json";
import ALL_GENERAL from "../../resources/metadata_techsause/all-objects-general.json";
import ALL_INVESTOR from "../../resources/metadata_techsause/all-objects-investor.json";
import ALL_MEDIA from "../../resources/metadata_techsause/all-objects-media.json";
import ALL_ORGANIZER from "../../resources/metadata_techsause/all-objects-organizer.json";
import ALL_PARTNER from "../../resources/metadata_techsause/all-objects-partner.json";
import ALL_SPEAKER from "../../resources/metadata_techsause/all-objects-speaker.json";
import ALL_STAFF from "../../resources/metadata_techsause/all-objects-staff.json";
import ALL_VIP from "../../resources/metadata_techsause/all-objects-VIP.json";

dotenv.config();

interface AttributeMapping {
  [key: string]: string;
}

interface AllAttribute {
  tokenId: number;
  [key: string]: any;
}

const schemaCode = "TechSauce.GlobalSummit2023";
// replace with your own schema code
ORIGINAL_METADATA.nft_schema_code = schemaCode;

// const tierMetadataArray = Object.values(ALL_VIP);
// console.log(tierMetadataArray.length);

// Define the tier ranges for the token IDs
const VIP_TIER_START = 1;
const VIP_TIER_END = 100; // 1-100
const SPEAKER_TIER_START = 101;
const SPEAKER_TIER_END = 400; // 101-400
const INVESTOR_TIER_START = 401;
const INVESTOR_TIER_END = 650; // 401-650
const PARTNER_TIER_START = 651;
const PARTNER_TIER_END = 820; // 651-820
const MEDIA_TIER_START = 821;
const MEDIA_TIER_END = 1020; // 821-1020
const EXHIBITOR_TIER_START = 1021;
const EXHIBITOR_TIER_END = 2320; // 1021-2320
const ORGANIZER_TIER_START = 2321;
const ORGANIZER_TIER_END = 2470; // 2321-2470
const STAFF_TIER_START = 2471;
const STAFF_TIER_END = 2530; // 2471-2530
const GENERAL_TIER_START = 2531;
const GENERAL_TIER_END = 7880; // 2531-7880

const TIER_FILE_NAME = {
  VIP: ALL_VIP,
  SPEAKER: ALL_SPEAKER,
  INVESTOR: ALL_INVESTOR,
  PARTNER: ALL_PARTNER,
  MEDIA: ALL_MEDIA,
  EXHIBITOR: ALL_EXHIBITOR,
  ORGANIZER: ALL_ORGANIZER,
  STAFF: ALL_STAFF,
  GENERAL: ALL_GENERAL,
};

const TIER_RANGE = {
  VIP: [VIP_TIER_START, VIP_TIER_END],
  SPEAKER: [SPEAKER_TIER_START, SPEAKER_TIER_END],
  INVESTOR: [INVESTOR_TIER_START, INVESTOR_TIER_END],
  PARTNER: [PARTNER_TIER_START, PARTNER_TIER_END],
  MEDIA: [MEDIA_TIER_START, MEDIA_TIER_END],
  EXHIBITOR: [EXHIBITOR_TIER_START, EXHIBITOR_TIER_END],
  ORGANIZER: [ORGANIZER_TIER_START, ORGANIZER_TIER_END],
  STAFF: [STAFF_TIER_START, STAFF_TIER_END],
  GENERAL: [GENERAL_TIER_START, GENERAL_TIER_END],
};


const Mint = async (TOKEN_START: number, TOKEN_END: number) => {
  console.log("Minting... from " + TOKEN_START + " to " + TOKEN_END);
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

  // ** MINT NFT **
  // loop trough all token id
  for (let i = TOKEN_START; i <= TOKEN_END; i++) {
    // find the token has been minted or not
    const apiClient = await sixConnector.connectAPIClient();
    let token;
    let isMinted = false;
    try {
        token = await apiClient.nftmngrModule.queryNftData(schemaCode,"1");
        // if token has been minted, skip to next token
        if (token.data) { 
            isMinted = true;
            continue;
        }
    }catch (e) {
        console.log("token not found", e.error);
        token = null;
        isMinted = false;
    }

    console.log(token);
    
  }
};

// create one metadata for test on production which is token_id = 2531
Mint(2531, 2531);