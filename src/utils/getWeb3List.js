import Web3 from "web3";

export const web3Default = {
    //BSC Mainnet
    56: {
        web3Default: new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')),
        name: 'BSC Mainnet',
        explorer: 'https://bscscan.com/',
    },
    //BSC Testnet
    97: {
        web3Default: new Web3(
            new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s3.binance.org:8545/')
        ),
        name: 'BSC Testnet',
        explorer: 'https://testnet.bscscan.com/',
    },
    //Polygon Mainnet
    137: {
        web3Default: new Web3(
            new Web3.providers.HttpProvider('https://matic-mainnet.chainstacklabs.com')
        ),
        name: 'Polygon Mainnet',
        explorer: 'https://polygonscan.com/',
    },
};

export const defaultChainId = 56;

export const networkDefault = (() => {
    const savedChainId = Number.parseInt(localStorage.getItem('chainId'));
    return savedChainId > 0 && web3Default[savedChainId] ? savedChainId : defaultChainId;
})();

export const getWeb3List = (_chainId) => {
    return web3Default[_chainId];
};