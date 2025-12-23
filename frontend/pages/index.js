import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// --- HUMANIZE: Update these after you deploy your contracts ---
const COIN_ADDRESS = "0xYourSahayataCoinAddressHere"; 
const REGISTRY_ADDRESS = "0xYourAidTrustAddressHere";

// Simplified ABI for the hackathon (only the functions we need)
const SAHAYATA_ABI = [
    "function totalFoodDistributed() public view returns (uint256)",
    "function totalMedsDistributed() public view returns (uint256)",
    "function spentToday(address) public view returns (uint256)",
    "function DAILY_LIMIT() public view returns (uint256)",
    "function balanceOf(address) public view returns (uint256)",
    "function symbol() public view returns (string)"
];

export default function SahayataDashboard() {
    const [auditData, setAuditData] = useState({ food: '0', meds: '0' });
    const [userStats, setUserStats] = useState({ balance: '0', spent: '0', limit: '0' });
    const [account, setAccount] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. Connect Wallet (Standard for Web3 apps)
    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask!");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
    };

    // 2. THE PUBLIC AUDIT TRAIL LOGIC (As requested)
    const getAuditStats = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(COIN_ADDRESS, SAHAYATA_ABI, provider);
            
            const food = await contract.totalFoodDistributed();
            const meds = await contract.totalMedsDistributed();
            
            // Humanized console log
            console.log(`Transparency Check: ${ethers.formatEther(food)} SAH for Food, ${ethers.formatEther(meds)} SAH for Medicine.`);
            
            setAuditData({
                food: ethers.formatEther(food),
                meds: ethers.formatEther(meds)
            });
        } catch (err) {
            console.error("Audit fetch failed. Is the contract address correct?", err);
        }
    };

    // 3. Fetch Personal Aid Data (For the 'Victim' view)
    const fetchUserData = async () => {
        if (!account) return;
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(COIN_ADDRESS, SAHAYATA_ABI, provider);
            
            const bal = await contract.balanceOf(account);
            const spent = await contract.spentToday(account);
            const limit = await contract.DAILY_LIMIT();

            setUserStats({
                balance: ethers.formatEther(bal),
                spent: ethers.formatEther(spent),
                limit: ethers.formatEther(limit)
            });
        } catch (e) {
            console.log("Error loading user data - maybe not a registered victim?");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (window.ethereum) {
            getAuditStats();
            if (account) fetchUserData();
        }
    }, [account]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header Area */}
            <nav className="p-6 bg-white shadow-sm flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">🇮🇳 Sahayata Portal</h1>
                <button 
                    onClick={connectWallet}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
                >
                    {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
                </button>
            </nav>

            <main className="max-w-5xl mx-auto py-12 px-4">
                {/* SECTION 1: PUBLIC AUDIT TRAIL (The 'Winning' feature) */}
                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">📊</span> Public Transparency Dashboard (Live Audit)
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Total Food Aid Delivered</p>
                            <p className="text-4xl font-black text-green-600 mt-2">{auditData.food} <span className="text-lg">SAH</span></p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500">
                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Total Medical Aid Delivered</p>
                            <p className="text-4xl font-black text-blue-600 mt-2">{auditData.meds} <span className="text-lg">SAH</span></p>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: VICTIM VIEW (The 'Utility' feature) */}
                {account && (
                    <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                        <h2 className="text-lg font-bold mb-4">Your Relief Status</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <p className="text-gray-600 text-sm">Available Balance</p>
                                <p className="text-2xl font-bold">{userStats.balance} SAH</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Used Today</p>
                                <p className="text-2xl font-bold text-orange-600">{userStats.spent} SAH</p>
                            </div>
                            <div className="relative pt-1">
                                <p className="text-gray-600 text-sm mb-2">Daily Limit Progress</p>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                    <div 
                                        style={{ width: `${(userStats.spent / userStats.limit) * 100}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                    ></div>
                                </div>
                                <p className="text-xs mt-1 text-gray-500">Limit: {userStats.limit} SAH / day</p>
                            </div>
                        </div>
                    </section>
                )}
                
                {/* Manual Refresh for Audit */}
                <div className="mt-8 text-center">
                    <button 
                        onClick={getAuditStats}
                        className="text-sm text-blue-500 underline hover:text-blue-700"
                    >
                        Sync with Blockchain (Live Refresh)
                    </button>
                </div>
            </main>

            <footer className="py-10 text-center text-gray-400 text-sm">
                Built for EIBS 2.0 @ IIT Kharagpur | Team Sahayata 🚀
            </footer>
        </div>
    );
}
