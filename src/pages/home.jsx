import React,{useEffect} from "react";
import {useSelector} from "react-redux";
import {setWeb3, setChainId} from '../store/actions';
import store from '../store/index';
import { networkDefault, getWeb3List } from '../utils/getWeb3List';
import ConnectWalletButton from "../components/connect-wallet-button";
import {Container} from "react-bootstrap";

const Home = () => {

    const { chainId, web3, walletAddress, shortAddress } = useSelector((state) => state);

    useEffect(() => {
        const setWeb3Default = async () => {
            await store.dispatch(setWeb3(getWeb3List(networkDefault).web3Default));
            await store.dispatch(setChainId(networkDefault));
        };
        if (!web3 || !chainId) {
            setWeb3Default();
        }
    }, [web3, chainId]);

    return (
        <Container className="text-center">
            <h1>Hello I am from Home page</h1>
            <ConnectWalletButton />
            {walletAddress && <h3>Connected Wallet Address: {walletAddress}</h3>}
            {shortAddress && <h3>Connected Wallet Address: {shortAddress}</h3>}
        </Container>
    )
}

export default Home