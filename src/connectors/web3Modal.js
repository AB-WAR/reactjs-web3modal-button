import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
    setChainId,
    setWeb3,
    setAddress,
} from "../store/actions";
import store from "../store";
import {getWeb3List} from "../utils/getWeb3List";
import {toast} from "react-toastify";
import {toastProperties} from "../utils/toast";

export const CONNECTID = 'WEB3_CONNECT_CACHED_PROVIDER';

const rpcSupport = {
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    56: 'https://bsc-dataseed.binance.org/',
    137: 'https://rpc-mainnet.maticvigil.com/',
    1666600000: 'https://api.harmony.one',
    1285: 'https://rpc.moonriver.moonbeam.network',
    336: 'https://rpc.shiden.astar.network:8545',
};

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: rpcSupport,
        },
    }
};

const paramsSwitchNetwork = {
    137: [
        {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
            blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com/'],
        },
    ],
    56: [
        {
            chainId: '0x38',
            chainName: 'Binance Smart Chain',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com/'],
        },
    ],
    97: [
        {
            chainId: '0x61',
            chainName: 'BSC-Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
    ],
    1666600000: [
        {
            chainId: '0x63564C40',
            chainName: 'Harmony Mainnet',
            nativeCurrency: {
                name: 'ONE',
                symbol: 'ONE',
                decimals: 18,
            },
            rpcUrls: ['https://api.harmony.one'],
            blockExplorerUrls: ['https://explorer.pops.one/#/'],
        },
    ],
    1285: [
        {
            chainId: '0x505',
            chainName: 'Moonriver',
            nativeCurrency: {
                name: 'MOVR',
                symbol: 'MOVR',
                decimals: 18,
            },
            rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
            blockExplorerUrls: ['https://blockscout.moonriver.moonbeam.network/'],
        },
    ],
    336: [
        {
            chainId: '0x150',
            chainName: 'Shiden',
            nativeCurrency: {
                name: 'SDN',
                symbol: 'SDN',
                decimals: 18,
            },
            rpcUrls: ['https://rpc.shiden.astar.network:8545'],
            blockExplorerUrls: ['https://blockscout.com/shiden/'],
        },
    ],
};

export const selectChain = async (chainId, walletAddress) => {
    if (!!rpcSupport[chainId]) {
        if (!!walletAddress) {
            injectNetworkNoEthereum(chainId);
        } else {
            await store.dispatch(setWeb3(getWeb3List(chainId).web3Default));
        }
        await store.dispatch(setChainId(chainId));
    } else {
        return(
            toast.error("Please Switch to Ethereum Mainnet", toastProperties)
        )
    }
};

// Switch for chains is not ETH
export const injectNetworkNoEthereum = async (chainId) => {
    if (!!chainId)
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: paramsSwitchNetwork[chainId],
        });
};

// Switch for chains in ecosystems of Ethereum
export const injectNetworkEthereum = async (chainId, web3) => {
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: web3.utils.numberToHex(chainId),
            },
        ],
    });
};

const web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
});

export const disconnectWeb3Modal = async () => {
    localStorage.removeItem(CONNECTID);
    web3Modal.clearCachedProvider();
};

export const connectWeb3Modal = async () => {
    const { chainId } = store.getState();
    if (!chainId) return;

    await injectNetworkNoEthereum(chainId);

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);

    let chainID = await web3.eth.net.getId();

    if (!!rpcSupport[chainID]) {
        let accounts = await web3.eth.getAccounts();

        store.dispatch(setChainId(chainID));
        store.dispatch(setWeb3(web3));

        if (accounts.length > 0) {
            store.dispatch(setAddress(accounts[0]));
        }
    } else {
        localStorage.removeItem(CONNECTID);
        return(
            toast.error("Please Switch to Ethereum Mainnet", toastProperties)
        )
    }

    // Subscribe to provider connection
    provider.on('connect', (info) => {
        console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error) => {
        console.log(error);
        store.dispatch(setAddress(null));
    });

    // Subscribe to account change
    provider.on('accountsChanged', async (accounts) => {
        store.dispatch(setAddress(accounts[0]));
    });

    // Subscribe to chainID change
    provider.on('chainChanged', async (chainID) => {
        chainID = parseInt(web3.utils.hexToNumber(chainID));
        if (!!rpcSupport[chainID]) {
            // let accounts = await web3.eth.getAccounts();
            store.dispatch(setChainId(chainID));
            store.dispatch(setWeb3(web3));
        } else {
            return(
                toast.error("Please Switch to Ethereum Mainnet", toastProperties)
            )
        }
    });
};