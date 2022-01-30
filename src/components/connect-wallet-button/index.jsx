import React, {useEffect} from "react";
import {Button, Col, Container} from "react-bootstrap";
import {connectWeb3Modal, CONNECTID, disconnectWeb3Modal} from "../../connectors/web3Modal";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../store/actions";


export default function ConnectWalletButton() {
    const { walletAddress, chainId } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem(CONNECTID)) {
            connectWeb3Modal();
        }
    }, [chainId]);

    const connect = () => {
        connectWeb3Modal();
    };

    const logoutAction = () => {
        dispatch(logout());
        disconnectWeb3Modal();
    };

    return (
        <Container>
            <Col className="text-center">
                {!walletAddress ? (
                    <Button variant="primary" onClick={() => connect()}>
                        Connect Wallet
                    </Button>
                ) : (
                    <Button variant="danger" onClick={() => logoutAction()}>
                        Disconnect Wallet
                    </Button>
                )}
            </Col>
        </Container>
    );
}