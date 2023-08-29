import fetch from 'node-fetch'

globalThis.fetch = fetch

export * from "./client/SixDataChainConnector"
export * from "./helper/base64"
// legacy code will be replicated and replaced with typesTxNFTManager
export * as ITxNFTmngr from "./modules/sixnft/thesixnetwork.sixnft.nftmngr/module/types/nftmngr/tx"
// legacy code will be replicated and replaced with typesTxNFTAdmin
export * as ITxNFTadmin from "./modules/sixnft/thesixnetwork.sixnft.nftadmin/module/types/nftadmin/tx"
// legacy code will be replicated and replaced with typesTxNFTOracle
export * as ITxNFToracle from "./modules/sixnft/thesixnetwork.sixnft.nftoracle/module/types/nftoracle/tx" 
export * as fee from "@cosmjs/stargate/build/fee"
export * as typesTxNFTManager from "./modules/sixnft/thesixnetwork.sixnft.nftmngr/module/types/nftmngr/tx"
export * as typesQueryNFTManager from "./modules/sixnft/thesixnetwork.sixnft.nftmngr/module/types/nftmngr/query"
export * as typesTxNFTAdmin from "./modules/sixnft/thesixnetwork.sixnft.nftadmin/module/types/nftadmin/tx"
export * as typesQueryNFTAdmin from "./modules/sixnft/thesixnetwork.sixnft.nftadmin/module/types/nftadmin/query"
export * as typesTxNFTOracle from "./modules/sixnft/thesixnetwork.sixnft.nftoracle/module/types/nftoracle/tx"
export * as typesQueryNFTOracle from "./modules/sixnft/thesixnetwork.sixnft.nftoracle/module/types/nftoracle/query"
export * as typesTxTokenManager from "./modules/six-protocol/thesixnetwork.sixprotocol.tokenmngr/module/types/tokenmngr/tx"
export * as typesQueryTokenManager from "./modules/six-protocol/thesixnetwork.sixprotocol.tokenmngr/module/types/tokenmngr/query"
export * as typesTxProtocolAdmin from "./modules/six-protocol/thesixnetwork.sixprotocol.protocoladmin/module/types/protocoladmin/tx"
export * as typesQueryProtocolAdmin from "./modules/six-protocol/thesixnetwork.sixprotocol.protocoladmin/module/types/protocoladmin/query"

// Ethermint
export * as typesTxEVM from "./modules/evmos/ethermint/ethermint.evm.v1/module/types/ethermint/evm/v1/tx"
export * as typesQueryEVM from "./modules/evmos/ethermint/ethermint.evm.v1/module/types/ethermint/evm/v1/query"
export * as typeTxERC20 from "./modules/evmos/v6/evmos.erc20.v1/module/types/evmos/erc20/v1/tx"
export * as typeQueryERC20 from "./modules/evmos/v6/evmos.erc20.v1/module/types/evmos/erc20/v1/query"

// Cosmos
export * as typesTxBank from "./modules/cosmos/cosmos-sdk/cosmos.bank.v1beta1/module/types/cosmos/bank/v1beta1/tx"
export * as typesQueryBank from "./modules/cosmos/cosmos-sdk/cosmos.bank.v1beta1/module/types/cosmos/bank/v1beta1/query"
export * as typesTxStaking from "./modules/cosmos/cosmos-sdk/cosmos.staking.v1beta1/module/types/cosmos/staking/v1beta1/tx"
export * as typesQueryStaking from "./modules/cosmos/cosmos-sdk/cosmos.staking.v1beta1/module/types/cosmos/staking/v1beta1/query"
export * as typesTxDistribution from "./modules/cosmos/cosmos-sdk/cosmos.distribution.v1beta1/module/types/cosmos/distribution/v1beta1/tx"
export * as typesQueryDistribution from "./modules/cosmos/cosmos-sdk/cosmos.distribution.v1beta1/module/types/cosmos/distribution/v1beta1/query"
export * as typesTxGov from "./modules/cosmos/cosmos-sdk/cosmos.gov.v1beta1/module/types/cosmos/gov/v1beta1/tx"
export * as typesQueryGov from "./modules/cosmos/cosmos-sdk/cosmos.gov.v1beta1/module/types/cosmos/gov/v1beta1/query"