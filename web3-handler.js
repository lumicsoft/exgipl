let provider, signer, contract, usdtContract;

// --- CONFIGURATION ---
const CONTRACT_ADDRESS = "0x5e5349C0212196B96e7Df8dca42D861ffA7f78A0"; // Apna naya address yahan dalein
const USDT_ADDRESS = "0x3b66b1e08f55af26c8ea14a73da64b6bc8d799de"; // BSC Mainnet USDT
const CHAIN_ID = 97; 

// --- RANK CONFIG ---
const RANK_DETAILS = [
    { name: "USER", roi: "Standard", targetTeam: 0 },
    { name: "STAR", roi: "Level 1 Boost", targetTeam: 1 },
    { name: "LEADER", roi: "Level 2 Boost", targetTeam: 2 },
    { name: "DIRECTOR", roi: "Level 3 Boost", targetTeam: 3 }
];

// --- COMPLETE ABI ---
const CONTRACT_ABI = [
    "function invest(string _username, string _sponsorUsername, uint256 _amount) external",
    "function withdrawWorking() external",
    "function withdrawMaturity(uint256 _idx) external",
    "function transferFund(string _toUsername, uint256 _amount) external",
    "function compound() external",
    "function getUserDashboard(address _user) view returns (tuple(uint256 totalLevelIncome, uint256 totalLevelROIIncome, uint256 totalDirectActive, uint256 totalDirectInactive, uint256 totalTeamActive, uint256 totalTeamInactive, uint256 totalIncome, uint256 totalROIIncome, uint256 totalWithdrawal, uint256 availableBalance))",
    "function users(address) view returns (string username, address sponsor, uint256 directCount, uint256 workingBalance, uint256 totalWithdrawn, uint256 statLevelIncome, uint256 statLevelROIIncome)",
    "function usernameToAddress(string) view returns (address)",
    "function getTransactionHistory(address _user) view returns (tuple(uint8 tType, uint256 amount, uint256 timestamp, string remarks)[])",
    "function getLevelTeamDetails(address _account, uint256 _level) view returns (tuple(address userAddress, string username, uint256 package, uint256 joinTime, uint256 teamCount)[])"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)"
];

// --- INITIALIZATION ---
async function init() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            signer = provider.getSigner();
            
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);

            if (accounts.length > 0) {
                await setupApp(accounts[0]);
            }

            window.ethereum.on('accountsChanged', () => location.reload());
            window.ethereum.on('chainChanged', () => location.reload());

        } catch (error) { console.error("Initialization Failed:", error); }
    } else {
        console.log("No Web3 Provider found.");
    }
}

// --- CORE ACTIONS ---

window.handleRegister = async function() {
    const userField = document.getElementById('reg-username');
    const refField = document.getElementById('reg-referrer');
    const regBtn = document.getElementById('reg-btn');

    if (!userField.value) return alert("Please enter a username");
    
    try {
        regBtn.disabled = true;
        regBtn.innerText = "PROCESSING...";

        const userAddress = await signer.getAddress();
        const minInvestment = ethers.utils.parseUnits("10", 18);

        const balance = await usdtContract.balanceOf(userAddress);
        if (balance.lt(minInvestment)) throw new Error("Insufficient USDT Balance");

        const allowance = await usdtContract.allowance(userAddress, CONTRACT_ADDRESS);
        if (allowance.lt(minInvestment)) {
            regBtn.innerText = "APPROVING...";
            const txApp = await usdtContract.approve(CONTRACT_ADDRESS, ethers.constants.MaxUint256);
            await txApp.wait();
        }

        regBtn.innerText = "REGISTERING...";
        const sponsor = refField.value.trim() || "Admin";
        const tx = await contract.invest(userField.value.trim(), sponsor, minInvestment);
        
        await tx.wait();
        alert("Success!");
        window.location.href = "index1.html"; // Updated to .html
        
    } catch (err) {
        alert(err.message || "Failed");
        regBtn.disabled = false;
        regBtn.innerText = "REGISTER NOW";
    }
}

window.handleLogin = async function() {
    try {
        const address = await signer.getAddress();
        const userData = await contract.users(address);
        if (userData.username !== "") {
            window.location.href = "index1.html"; // Updated to .html
        } else {
            alert("Please register first.");
            window.location.href = "register.html"; // Updated to .html
        }
    } catch (e) { alert("Connect Wallet First"); }
}

// --- DATA FETCHING ---
async function fetchAllData(address) {
    try {
        const [dash, userData] = await Promise.all([
            contract.getUserDashboard(address),
            contract.users(address)
        ]);

        updateText('user-name-display', userData.username);
        updateText('connect-btn', address.substring(0,6) + "..." + address.substring(38));
        
        updateText('available-balance', parseFloat(format(dash.availableBalance)).toFixed(2));
        updateText('total-earned', parseFloat(format(dash.totalIncome)).toFixed(2));
        updateText('total-withdrawn', parseFloat(format(dash.totalWithdrawal)).toFixed(2));
        updateText('level-earnings', parseFloat(format(dash.totalLevelIncome)).toFixed(2));
        updateText('roi-earnings', parseFloat(format(dash.totalLevelROIIncome)).toFixed(2));

        updateText('direct-count', userData.directCount.toString());
        updateText('team-active', dash.totalTeamActive.toString());
        updateText('team-inactive', dash.totalTeamInactive.toString());

        // Updated Referral Link to .html
        const refUrl = `${window.location.origin}/register.html?ref=${userData.username}`;
        if(document.getElementById('refURL')) {
            document.getElementById('refURL').value = refUrl;
        }

        let rankIdx = userData.directCount >= 3 ? 3 : (userData.directCount >= 2 ? 2 : (userData.directCount >= 1 ? 1 : 0));
        updateText('rank-display', RANK_DETAILS[rankIdx].name);

    } catch (err) { console.error(err); }
}

// --- APP ROUTING & SECURITY ---
async function setupApp(address) {
    const userData = await contract.users(address);
    const path = window.location.pathname;
    const isRegistered = userData.username !== "";

    // Redirect to register if trying to access internal pages without account
    if (!isRegistered && (path.includes('index1.html') || path.includes('referral.html'))) {
        window.location.href = "register.html";
        return;
    }
    
    if (path.includes('index1.html') || path.includes('referral.html')) {
        fetchAllData(address);
        startCountdown();
    }

    if (path.includes('history.html')) {
        if(window.showHistory) window.showHistory('deposit');
    }
}

// --- UTILS ---
const format = (val) => ethers.utils.formatUnits(val || 0, 18);
const updateText = (id, val) => { 
    const el = document.getElementById(id);
    if(el) el.innerText = val; 
};

function startCountdown() {
    const timerEl = document.getElementById('next-timer');
    if(!timerEl) return;
    setInterval(() => {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diff = next - now;
        const h = Math.floor(diff / 3600000).toString().padStart(2,'0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2,'0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2,'0');
        timerEl.innerText = `${h}:${m}:${s}`;
    }, 1000);
}


window.addEventListener('load', init);
