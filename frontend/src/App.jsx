import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SahayataAbi from "./SahayataAbi.json"; // ABI will come from compilation artifacts
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
    }
  }, []);

  async function connect() {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const signer = await provider.getSigner();
    const c = new ethers.Contract(CONTRACT_ADDRESS, SahayataAbi, signer);
    setContract(c);
  }

  async function loadRequest(id) {
    const r = await contract.getRequest(id);
    return {
      id: r[0].toNumber ? r[0].toNumber() : Number(r[0]),
      creator: r[1],
      title: r[2],
      description: r[3],
      goal: ethers.formatEther(r[4]),
      raised: ethers.formatEther(r[5]),
      deadline: Number(r[6]),
      withdrawn: r[7]
    };
  }

  async function fetchAll() {
    // naive: requestCount from contract
    const count = (await contract.requestCount()).toString();
    const arr = [];
    for (let i = 1; i <= Number(count); i++) {
      const r = await loadRequest(i);
      arr.push(r);
    }
    setRequests(arr);
  }

  useEffect(() => {
    if (contract) fetchAll();
  }, [contract]);

  if (!window.ethereum) {
    return <div>Please install MetaMask</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Sahayata Protocol</h1>
      {!account ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <div>Connected: {account}</div>
          <button onClick={fetchAll}>Refresh Requests</button>
          <div style={{ marginTop: 20 }}>
            {requests.map((r) => (
              <div key={r.id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
                <h3>{r.title} (id: {r.id})</h3>
                <p>{r.description}</p>
                <p>Goal: {r.goal} ETH • Raised: {r.raised} ETH</p>
                <p>Deadline: {new Date(r.deadline * 1000).toLocaleString()}</p>
                <DonateForm contract={contract} id={r.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DonateForm({ contract, id }) {
  const [amount, setAmount] = useState("");

  async function donate() {
    if (!contract) return alert("Not connected");
    const val = ethers.parseEther(amount || "0");
    const tx = await contract.donate(id, { value: val });
    await tx.wait();
    alert("Donation tx sent");
  }

  return (
    <div>
      <input placeholder="ETH amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={donate}>Donate</button>
    </div>
  );
}
