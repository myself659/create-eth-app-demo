import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

import { Body, Button, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";
import { ethers } from 'ethers';
import Web3 from 'web3';

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = getDefaultProvider();
  // Create an instance of an ethers.js Contract
  // Read more about ethers.js on https://docs.ethers.io/v5/api/contract/contract/
  const ceaErc20 = new Contract(addresses.ceaErc20, abis.erc20, defaultProvider);
  // A pre-defined address that owns some CEAERC20 tokens
  const tokenBalance = await ceaErc20.balanceOf("0x3f8CB69d9c0ED01923F11c829BaE4D9a4CB6c82C");
  console.log({ tokenBalance: tokenBalance.toString() });
}

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </Button>
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <Image src={logo} alt="react-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
        <Button onClick={() => readOnChainData()}>
          Read On-Chain Balance
        </Button>
        <Button onClick={() => getBalanceUsingEthers(provider, "0xa5e4c94BC98c5732415A3A139f6fDE9372A2c7Ac")}>
          Get Balance Using Ethers
    </Button>
        <Button onClick={() => getAccountsUsingWeb3()}>
          Get Accounts Using Web3
    </Button>
        <Button onClick={() => getBalanceUsingWeb3("0xa5e4c94BC98c5732415A3A139f6fDE9372A2c7Ac")}>
          Get Balance Using Web3
    </Button>
        <Link href="https://ethereum.org/developers/#getting-started" style={{ marginTop: "8px" }}>
          Learn Ethereum
        </Link>
        <Link href="https://reactjs.org">Learn React</Link>
        <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link>
      </Body>
    </div>
  );
}

async function getBalanceUsingEthers(provider, address) {
  provider.getBalance(address).then((balance) => {
    let etherString = ethers.utils.formatEther(balance);
    alert("Balance: " + etherString);
    console.log("Balance: " + etherString);
  });
}
async function getAccountsUsingWeb3() {
  var web3 = window.web3;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    web3.eth.getAccounts().then((account) => {
      alert("Account: " + account);
      console.log("Account: " + account);
    });
  }
}
async function getBalanceUsingWeb3(address) {
  var web3 = window.web3;
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    web3.eth.getBalance(address).then((balance) => {
      alert("Balance: " + web3.utils.fromWei(balance, 'ether'));
      console.log("Balance: " + balance);
    });
  }
}

export default App;
