import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useSigner
} from 'wagmi';
import Login from "./Login";

export default function LoginMetamask() {
  const [intervalStop, setIntervalStop] = useState(false)

  const { address, connector, isConnected, data } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
  const navigate = useNavigate();
  
  const customStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }

  var interval = setInterval(getmetadata, 8000);
  //  var interval = setInterval(() => {
  // var getMetamask = localStorage.getItem("wagmi.connected");
  // if(getMetamask){
  //     setIntervalStop(true);
  //     clearInterval();
  // }
  // var getmeamsk = JSON.parse(localStorage.getItem("wagmi.store"));
  // getmeamsk = getmeamsk.state.data.account;
  // if(getmeamsk){
  //     localStorage.setItem("metamask", getmeamsk);
  //     setIntervalStop(true);

  // navigate("/login");
  //     }
  //   }, 8000);

  function getmetadata() {
    var getmeamsk = JSON.parse(localStorage.getItem("wagmi.store"));
    getmeamsk = getmeamsk.state.data.account;
    if (getmeamsk) {
      window.ethereum.request({method:'eth_requestAccounts'})
        .then(res=>{
            console.log(res) 
            localStorage.setItem("metamask", res[0]);
        })
      clearInterval(interval)
      setIntervalStop(true);
    }
  }
  if (intervalStop) {
    // return (
    navigate("/login")
    // )
  }
  return (
    <div className="btn-connect-wallet">
      <ConnectButton />
    </div>
    // <div>
    //   {connectors.map((connector) => (
    //     <button
    //       disabled={!connector.ready}
    //       key={connector.id}
    //       onClick={() => connect({ connector })}
    //     >
    //       {connector.name}
    //       {!connector.ready && ' (unsupported)'}
    //       {isLoading &&
    //         connector.id === pendingConnector?.id &&
    //         ' (connecting)'}
    //     </button>
    //   ))}

    //   {error && <div>{error.message}</div>}
    // </div>
  )
};
