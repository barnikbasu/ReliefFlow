import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SahayataAbi from "./SahayataAbi.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(p);
    }
  }, []);

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    const signer = provider.getSigner();
    const c = new ethers.Contract(CONTRACT_ADDRESS, SahayataAbi, signer);
    setContract(c);
  }

  async function fetchAll() {
    if (!contract) return;
    setLoading(true);
    try {
      const countBN = await contract.requestCount();
      const count = countBN.toNumber();
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const r = await contract.getRequest(i);
        arr.push({
          id: r.id.toNumber(),
          creator: r.creator,
          title: r.title,
          description: r.description,
          goal: ethers.utils.formatEther(r.goal),
          raised: ethers.utils.formatEther(r.raised),
          deadline: r.deadline.toNumber(),
          withdrawn: r.withdrawn
        });
      }
      setRequests(arr.reverse());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (contract) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Sahayata Protocol</h1>
      {!CONTRACT_ADDRESS && (
        <div style={{ color: "red" }}>
          No contract address set. Copy frontend/.env.example to frontend/.env and set VITE_CONTRACT_ADDRESS.
        </div>
      )}
      {!account ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <div>Connected: {account}</div>
          <div style={{ marginTop: 16 }}>
            <CreateRequest contract={contract} onCreated={fetchAll} />
          </div>

          <div style={{ marginTop: 16 }}>
            <button onClick={fetchAll} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh Requests"}
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            {requests.length === 0 && <div>No requests yet</div>}
            {requests.map((r) => (
              <div key={r.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
                <h3>{r.title} (id: {r.id})</h3>
                <p>{r.description}</p>
                <p>
                  Goal: {r.goal} ETH • Raised: {r.raised} ETH
                </p>
                <p>Deadline: {new Date(r.deadline * 1000).toLocaleString()}</p>
                <p>Status: {r.withdrawn ? "Withdrawn" : Number(r.raised) >= Number(r.goal) ? "Funded" : "Open"}</p>
                <DonateForm contract={contract} id={r.id} refresh={fetchAll} />
                <RefundButton contract={contract} id={r.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateRequest({ contract, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  async function create() {
    if (!contract) return alert("Connect wallet");
    const tx = await contract.createRequest(title, description, ethers.utils.parseEther(goal || "0"), durationHours * 3600);
    await tx.wait();
    alert("Request created");
    setTitle("");
    setDescription("");
    setGoal("");
    onCreated();
  }
  return (
    <div style={{ marginBottom: 12 }}>
      <h3>Create Request</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <br />
      <input placeholder="Goal (ETH)" value={goal} onChange={(e) => setGoal(e.target.value)} />
      <br />
      <input type="number" value={durationHours} onChange={(e) => setDurationHours(e.target.value)} /> hours
      <br />
      <button onClick={create}>Create</button>
    </div>
  );
}

function DonateForm({ contract, id, refresh }) {
  const [amount, setAmount] = useState("");

  async function donate() {
    if (!contract) return alert("Not connected");
    const val = ethers.utils.parseEther(amount || "0");
    const tx = await contract.donate(id, { value: val });
    await tx.wait();
    alert("Donation successful");
    if (refresh) refresh();
  }

  return (
    <div>
      <input placeholder="ETH amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={donate}>Donate</button>
    </div>
  );
}

function RefundButton({ contract, id }) {
  async function refund() {
    if (!contract) return alert("Not connected");
    try {
      const tx = await contract.claimRefund(id);
      await tx.wait();
      alert("Refund claimed");
    } catch (e) {
      alert("Refund failed: " + (e?.error?.message || e.message));
    }
  }

  return <button onClick={refund} style={{ marginLeft: 8 }}>Claim Refund</button>;
}
