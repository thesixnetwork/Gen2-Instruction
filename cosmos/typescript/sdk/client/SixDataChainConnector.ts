

import { Accounts } from "./Accounts"
import { SigningStargateClientOptions} from "@cosmjs/stargate";
import { OfflineSigner } from "@cosmjs/proto-signing";
import * as nftmngrModuleGenerate from "../modules/sixnft/thesixnetwork.sixnft.nftmngr/module/index"
import * as nftoracleModuleGenerate from "../modules/sixnft/thesixnetwork.sixnft.nftoracle/module/index"
import * as nftadminModuleGenerate from "../modules/sixnft/thesixnetwork.sixnft.nftadmin/module/index"
import * as sixprotocolprotocoladminModuleGenerate from "../modules/six-protocol/thesixnetwork.sixprotocol.protocoladmin/module/index"
import * as sixprotocoltokenmngrModuleGenerate from "../modules/six-protocol/thesixnetwork.sixprotocol.tokenmngr/module/index"

// Ethermint 
import * as evmModuleGenerate from "../modules/evmos/ethermint/ethermint.evm.v1/module/index"
import * as erc20ModuleGenerate from "../modules/evmos/v6/evmos.erc20.v1/module/index"

// Cosmos
import * as cosmosbankModuleGenerate from "../modules/cosmos/cosmos-sdk/cosmos.bank.v1beta1/module/index"
import * as cosmosstakingModuleGenerate from "../modules/cosmos/cosmos-sdk/cosmos.staking.v1beta1/module/index"
import * as cosmosgovModuleGenerate from "../modules/cosmos/cosmos-sdk/cosmos.gov.v1beta1/module/index"
import * as cosmosdistributionModuleGenerate from "../modules/cosmos/cosmos-sdk/cosmos.distribution.v1beta1/module/index"


type Module = {
    txClient: (wallet: any, options: any) => Promise<any>
    queryClient: (options: any) => Promise<any>
}

export class SixDataChainConnector {
    // public rpcClient: RPCClient = new RPCClient();
    // public api: ApiClient
    // public rpc: RpcClient
    // public nodeUrl: string = "http://localhost"
    public apiUrl: string;
    public rpcUrl: string;
    public accounts: Accounts = new Accounts();

     /** 
    * @param _nodeUrl is the url of the node to connect default is http://localhost
    * @param _portApi default is 1317
    * @param _portRpc default is 26657
    **/
    constructor(
        _nodeUrl: string = "http://localhost",
        _portApi: number = 1317,
        _portRpc: number = 26657
    ) {
        const url = this.removeSLash(_nodeUrl)
        this.apiUrl = url + ":" + _portApi
        this.rpcUrl = url + ":" + _portRpc
    }

    connectAPIClient = async () => {
        const [
            nftmngrModule, // 1
            nftoracleModule, //2 
            nftAdminModule, //3
            sixprotocolProtocolAdminModule, //4
            sixprotocolTokenmngrModule, //5
            // cosmos
            cosmosBankModule, //6
            cosmosStakingModule, //7
            cosmosGovModule, //8
            cosmosDistributionModule, //9
            // ethermint
            evmModule, //10
            erc20Module //11
        ] = await Promise.all([
            nftmngrModuleGenerate.queryClient({ addr: this.apiUrl }), // 1
            nftoracleModuleGenerate.queryClient({ addr: this.apiUrl }), //2 
            nftadminModuleGenerate.queryClient({ addr: this.apiUrl }), //3
            sixprotocolprotocoladminModuleGenerate.queryClient({ addr: this.apiUrl }), //4
            sixprotocoltokenmngrModuleGenerate.queryClient({ addr: this.apiUrl }), //5
            // cosmos 
            cosmosbankModuleGenerate.queryClient({ addr: this.apiUrl }), //6
            cosmosstakingModuleGenerate.queryClient({ addr: this.apiUrl }), //7
            cosmosgovModuleGenerate.queryClient({ addr: this.apiUrl }), //8
            cosmosdistributionModuleGenerate.queryClient({ addr: this.apiUrl }), //9
            // ethermint
            evmModuleGenerate.queryClient({ addr: this.apiUrl }), //10
            erc20ModuleGenerate.queryClient({ addr: this.apiUrl }), //11
        ])
        return {
            nftmngrModule, // 1
            nftoracleModule, //2
            nftAdminModule, //3
            sixprotocolProtocolAdminModule, //4
            sixprotocolTokenmngrModule, //5
            // cosmos
            cosmosBankModule,
            cosmosStakingModule,
            cosmosGovModule,
            cosmosDistributionModule,
            // ethermint
            evmModule,
            erc20Module
        }
    }

    /** 
    * @param accountSigner OfflineSigner
    * @example 
    * const signer = await sixConnector.accounts.privateKeyToAccount("priveteKey")
    * const txClient = await sixConnector.connectRPCClient(signer)
    * @description connect to RPC client use for send transaction
    **/
    connectRPCClient = async (accountSigner: OfflineSigner,options?:SigningStargateClientOptions) => {
        const [
            nftmngrModule,
            nftadminModule,
            nftoracleModule,
            sixprotocolProrocolAdminModule,
            sixprotocolTokenmngrModule,
            // cosmos
            cosmosBankModule,
            cosmosStakingModule,
            cosmosGovModule,
            cosmosDistributionModule,
            // ethermint
            evmModule,
            erc20Module
        ] = await Promise.all([
            nftmngrModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            nftadminModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            nftoracleModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            sixprotocolprotocoladminModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            sixprotocoltokenmngrModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            // cosmos
            cosmosbankModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            cosmosstakingModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            cosmosgovModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            cosmosdistributionModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            // ethermint
            evmModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
            erc20ModuleGenerate.txClient(accountSigner, { addr: this.rpcUrl },options),
        ])
        return {
            nftmngrModule,
            nftadminModule,
            nftoracleModule,
            sixprotocolProrocolAdminModule,
            sixprotocolTokenmngrModule,
            // cosmos
            cosmosBankModule,
            cosmosStakingModule,
            cosmosGovModule,
            cosmosDistributionModule,
            // ethermint
            evmModule,
            erc20Module
        }
    }

    private removeSLash = (url: string) => {
        if (url[url.length - 1] === "/") return url.slice(0, -1)
        return url
    }
}


