import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    darkTheme as RainDark,
    connectorsForWallets,
    ConnectButton,
} from '@rainbow-me/rainbowkit';
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import {
    metaMaskWallet,
    braveWallet,
    rainbowWallet,
    walletConnectWallet,
    coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import LoginMetamask from './LoginMetamask';
export default function MetaMask(Component, pageProps) {
    const navigate = useNavigate();
    const { chains, provider } = configureChains([mainnet], [publicProvider()]);
    const connectors = connectorsForWallets([
        {
            groupName: 'Recommended',
            wallets: [
                metaMaskWallet({ chains }),
                braveWallet({ chains }),
                rainbowWallet({ chains }),
                walletConnectWallet({ chains }),
                coinbaseWallet({ chains, appName: 'Wallet APP' }),
            ],
        },
    ]);
    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });
    useEffect(() => {
        var getmeamsk = JSON.parse(localStorage.getItem("wagmi.store"));
        getmeamsk = getmeamsk.state.data.account;
        if (getmeamsk) {
            localStorage.setItem("metamask", getmeamsk);
            navigate("/login");
        }
    }, []);
    return (
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                coolMode
                // theme={myCustomTheme}
                theme={RainDark({
                    accentColor: '#7b3fe4',
                    accentColorForeground: 'white',
                    // borderRadius: 'small',
                    // fontStack: 'system',
                    overlayBlur: 'small',
                })}
            >
                <LoginMetamask />
                {/* <ConnectButton accountStatus = "address"/> */}
                {/* <Component {...pageProps} />; */}
            </RainbowKitProvider>
        </WagmiConfig>
    )
}