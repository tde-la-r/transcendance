export function laodDashboard(): void {
    const content = document.getElementById("dashboard-content");
    const buttons = document.querySelectorAll(".tab-button");
    
    const views = {
        stats: `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/controller.svg" alt="Partie jouées" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pink-300">Parties jouées</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">128</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/trophy.svg" alt="Victoires" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pink-300">Victoires</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">74</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/broken-heart.svg" alt="Broken heart" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Loose</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">54</p>             
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/bar-chart.svg" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Win rate</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">57.8%</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/flamme.png" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Win streak</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">3</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/dashboard/medal.png" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Rank</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">1</p>
                </div>
            <div>
        `,
        history: `
            <div class="bg-black/30 p-6 rounded-xl shadow-neon w-full mx-auto space-y-4">
                <h3 class="text-2xl font-bold text-pink-300 mb-4">📝 Historique des parties</h3>

                <div class="space-y-4">
                <!-- match 1 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <span class="w-3 h-3 rounded-full bg-green-400"></span>
                            <div>
                                <p class="text-pink-100 font-semibold">vs CyberAlice</p>
                                <p class="text-sm text-pink-400">2024-01-15</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-green-400 font-bold text-xl">5 - 3</p>
                        </div>
                    </div>
                
                <!-- match 2 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <span class="w-3 h-3 rounded-full bg-red-400"></span>
                            <div>
                                <p class="text-pink-100 font-semibold">vs CyberBob</p>
                                <p class="text-sm text-pink-400">2024-01-16</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-red-400 font-bold text-xl">4 - 5</p>
                        </div>
                    </div>
                
                <!-- match 3 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <span class="w-3 h-3 rounded-full bg-green-400"></span>
                            <div>
                                <p class="text-pink-100 font-semibold">vs CyberCharlie</p>
                                <p class="text-sm text-pink-400">2024-01-17</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-green-400 font-bold text-xl">5 - 4</p>
                        </div>
                    </div>
                </div>
            </div>

        `,
        ranking: `
            <div class="bg-black/30 p-6 rounded-xl shadow-neon w-full mx-auto space-y-4">
                <h3 class="text-2xl font-bold text-pink-300 mb-4">🏆 Classement</h3>

                <div class="space-y-3">
                    <!-- rank 1 -->
                    <div class="flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl px-6 py-4 shadow-lg">
                        <!-- Gauche : Rang + Pseudo + Win/Loss -->
                        <div class="flex items-center space-x-4">
                            <!-- Rang / Médaille -->
                            <div class="text-2xl w-8 text-center">
                            🥇
                            </div>
                            <!-- Nom + Stat -->
                            <div class="flex flex-col">
                            <span class="font-bold text-pink-100 text-lg">SynthMaster</span>
                            <span class="text-sm text-left text-pink-400">145W - 23L</span>
                            </div>
                        </div>

                        <!-- Droite : Score + WR -->
                        <div class="text-right">
                            <div class="text-yellow-400 font-extrabold text-lg">2156 pts</div>
                            <div class="text-pink-300 text-sm">86% WR</div>
                        </div>
                        </div>

                    <!-- rank 2 -->
                    <div class="flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl px-6 py-4 shadow-lg">
                        <!-- Gauche : Rang + Pseudo + Win/Loss -->
                        <div class="flex items-center space-x-4">
                            <!-- Rang / Médaille -->
                            <div class="text-2xl w-8 text-center">
                            🥈
                            </div>
                            <!-- Nom + Stat -->
                            <div class="flex flex-col">
                            <span class="font-bold text-pink-100 text-lg">CyberBob</span>
                            <span class="text-sm text-left text-pink-400">115W - 43L</span>
                            </div>
                        </div>

                        <!-- Droite : Score + WR -->
                        <div class="text-right">
                            <div class="text-yellow-400 font-extrabold text-lg">1856 pts</div>
                            <div class="text-pink-300 text-sm">70% WR</div>
                        </div>
                        </div>

                    <!-- rank 3 -->
                    <div class="flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl px-6 py-4 shadow-lg">
                        <!-- Gauche : Rang + Pseudo + Win/Loss -->
                        <div class="flex items-center space-x-4">
                            <!-- Rang / Médaille -->
                            <div class="text-2xl w-8 text-center">
                            🥉
                            </div>
                            <!-- Nom + Stat -->
                            <div class="flex flex-col">
                            <span class="font-bold text-pink-100 text-lg">CyberAlice</span>
                            <span class="text-sm text-left text-pink-400">105W - 83L</span>
                            </div>
                        </div>

                        <!-- Droite : Score + WR -->
                        <div class="text-right">
                            <div class="text-yellow-400 font-extrabold text-lg">1406 pts</div>
                            <div class="text-pink-300 text-sm">51% WR</div>
                        </div>
                        </div>

                    <!-- rank 4-->
                    <div class="flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl px-6 py-4 shadow-lg">
                        <!-- Gauche : Rang + Pseudo + Win/Loss -->
                        <div class="flex items-center space-x-4">
                            <!-- Rang / Médaille -->
                            <div class="text-2xl w-8 text-center">
                            #4
                            </div>
                            <!-- Nom + Stat -->
                            <div class="flex flex-col">
                            <span class="font-bold text-pink-100 text-lg">CyberEric</span>
                            <span class="text-sm text-left text-pink-400">100W - 83L</span>
                            </div>
                        </div>

                        <!-- Droite : Score + WR -->
                        <div class="text-right">
                            <div class="text-yellow-400 font-extrabold text-lg">1350 pts</div>
                            <div class="text-pink-300 text-sm">50% WR</div>
                        </div>
                        </div>

                    <!-- rank 5-->
                    <div class="flex items-center justify-between bg-[#1a1a2e]/70 rounded-xl px-6 py-4 shadow-lg">
                        <!-- Gauche : Rang + Pseudo + Win/Loss -->
                        <div class="flex items-center space-x-4">
                            <!-- Rang / Médaille -->
                            <div class="text-2xl w-8 text-center">
                            #5
                            </div>
                            <!-- Nom + Stat -->
                            <div class="flex flex-col">
                            <span class="font-bold text-pink-100 text-lg">CyberTeddy</span>
                            <span class="text-sm text-left text-pink-400">98W - 83L</span>
                            </div>
                        </div>

                        <!-- Droite : Score + WR -->
                        <div class="text-right">
                            <div class="text-yellow-400 font-extrabold text-lg">1300 pts</div>
                            <div class="text-pink-300 text-sm">51% WR</div>
                        </div>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        `,
    };

    function show(tab: keyof typeof views) {
        if (content) content.innerHTML = views[tab];
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = (btn as HTMLElement).dataset.tab as keyof typeof views;
            show(tab);
        });
    });

    show("stats");
}

function currentUser(): { username?: string } | null {
  try { return JSON.parse(localStorage.getItem('auth') || 'null'); }
  catch { return null; }
}

export function paintDashboardUsername() {
  const el = document.getElementById('dashUsername');
  if (!el) return;
  const user = currentUser();
  el.textContent = user?.username ?? 'Invité';
}