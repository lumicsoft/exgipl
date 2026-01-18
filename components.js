document.addEventListener("DOMContentLoaded", async function () {
    // 1. Auth Page Check (Updated to .html)
    const isAuthPage = document.getElementById('auth-page') || 
                       window.location.pathname.includes('register.html') || 
                       window.location.pathname.includes('login.html');

    // 2. Inject Dots Background (Emerald/Cyan theme for USDT)
    const dotsHTML = `<div class="dots-container"><div class="dots dots-white"></div><div class="dots dots-cyan"></div></div>`;
    document.body.insertAdjacentHTML('afterbegin', dotsHTML);

    if (isAuthPage) return;

    // 3. Check Wallet Status
    let walletAddress = "";
    let isConnected = false;
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                walletAddress = accounts[0];
                isConnected = true;
            }
        } catch (e) { console.error("Wallet check error", e); }
    }

    // 4. Inject Navbar (Desktop) - Updated with USDT Branding
    const navHTML = `
        <nav class="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
            <div class="flex items-center gap-2 cursor-pointer" onclick="location.href='index1.html'">
                <div class="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <i data-lucide="layers" class="text-black w-6 h-6"></i>
                </div>
                <span class="text-xl font-black orbitron tracking-tighter uppercase">
                    Matrix <span class="text-gradient">USDT</span>
                </span>
            </div>
            
            <div class="hidden md:flex gap-4">
                <button class="gold-btn !py-2 !px-5 !border-emerald-500/30" onclick="location.href='index1.html'">Dashboard</button>
                <button class="gold-btn !py-2 !px-5 !border-emerald-500/30" onclick="location.href='deposits.html'">Position</button>
                <button class="gold-btn !py-2 !px-5 !border-emerald-500/30" onclick="location.href='referral.html'">Referral</button>
                <button class="gold-btn !py-2 !px-5 !border-emerald-500/30" onclick="location.href='leadership.html'">Leadership</button>
                <button class="gold-btn !py-2 !px-5 !border-emerald-500/30" onclick="location.href='history.html'">History</button>
            </div>
            
            <div class="relative flex flex-col items-center">
                <button id="connect-btn" onclick="handleLogin()" class="gold-btn !border-emerald-500">
                    ${isConnected ? walletAddress.substring(0, 6) + "..." + walletAddress.substring(38) : "Connect Wallet"}
                </button>
                
                <button id="logout-icon-btn" onclick="localStorage.setItem('manualLogout','true'); location.reload();" 
                    style="display: ${isConnected ? 'flex' : 'none'}; position: absolute; top: 100%; margin-top: 4px;" 
                    class="p-1 text-red-500 hover:text-red-400 transition-all cursor-pointer items-center justify-center"
                    title="Logout">
                    <i data-lucide="power" class="w-4 h-4"></i>
                </button>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // 5. Inject Premium Floating Mobile Navigation (Updated to .html)
    const mobileNavHTML = `
        <div class="fixed bottom-6 left-4 right-4 md:hidden z-[9999]">
            <div class="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <a href="index1.html" class="flex flex-col items-center gap-1 transition-all ${window.location.pathname.includes('index1.html') ? 'text-emerald-500 scale-110' : 'text-gray-400'}">
                    <div class="p-2 rounded-xl ${window.location.pathname.includes('index1.html') ? 'bg-emerald-500/10' : ''}">
                        <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[9px] font-bold orbitron">HOME</span>
                </a>
                <a href="deposits.html" class="flex flex-col items-center gap-1 transition-all ${window.location.pathname.includes('deposits.html') ? 'text-emerald-500 scale-110' : 'text-gray-400'}">
                    <div class="p-2 rounded-xl ${window.location.pathname.includes('deposits.html') ? 'bg-emerald-500/10' : ''}">
                        <i data-lucide="gem" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[9px] font-bold orbitron">STAKE</span>
                </a>
                <a href="referral.html" class="flex flex-col items-center gap-1 transition-all ${window.location.pathname.includes('referral.html') ? 'text-emerald-500 scale-110' : 'text-gray-400'}">
                    <div class="p-2 rounded-xl ${window.location.pathname.includes('referral.html') ? 'bg-emerald-500/10' : ''}">
                        <i data-lucide="users-2" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[9px] font-bold orbitron">TEAM</span>
                </a>
                <a href="leadership.html" class="flex flex-col items-center gap-1 transition-all ${window.location.pathname.includes('leadership.html') ? 'text-emerald-500 scale-110' : 'text-gray-400'}">
                    <div class="p-2 rounded-xl ${window.location.pathname.includes('leadership.html') ? 'bg-emerald-500/10' : ''}">
                        <i data-lucide="award" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[9px] font-bold orbitron">RANK</span>
                </a>
                <a href="history.html" class="flex flex-col items-center gap-1 transition-all ${window.location.pathname.includes('history.html') ? 'text-emerald-500 scale-110' : 'text-gray-400'}">
                    <div class="p-2 rounded-xl ${window.location.pathname.includes('history.html') ? 'bg-emerald-500/10' : ''}">
                        <i data-lucide="history" class="w-5 h-5"></i>
                    </div>
                    <span class="text-[9px] font-bold orbitron">LOGS</span>
                </a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', mobileNavHTML);

    // 6. Inject Luxury Footer
    const footerHTML = `
        <footer class="p-20 text-center border-t border-white/5 relative z-10 mb-20 md:mb-0">
            <p class="orbitron font-bold text-2xl mb-4 italic">Matrix <span class="text-gradient uppercase">USDT</span></p>
            <p class="text-gray-600 text-[10px] tracking-[1em] uppercase">Smart Contract Protocol © 2026</p>
        </footer>
    `;
    
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
});