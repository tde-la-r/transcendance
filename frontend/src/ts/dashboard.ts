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
            <div class="bg-black/30 p-6 rounded-xl shadow-neon w-full mx-auto space-y-6 text-left">
                <h3 class="text-2xl font-bold text-pink-300 flex items-center gap-2">
                    <img src="assets/dashboard/history.png" alt="Historique" class="w-8 h-8" />
                    <span>Historique des matchs</span>
                </h3>

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
                <h3 class="text=2xl font-bold text-pink-300 mb-4">🏆 Classement</h3>

                <div class="space-y-3">
                    <!-- rank 1 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <img src="assets/dashboard/gold_medal.png" alt="Gold" class="w-8 h-8" />
                            <div>
                                <p class="text-white font-bold">SynthMaster</p>
                                <p class="text-sm text-pink-400">145W - 23L</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-yellow-400 font-bold text-xl">2156 pts</p>
                            <p class="text-sm text-yellow-300">86% WR</p>
                        </div>
                    </div>

                    <!-- rank 2 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <img src="assets/dashboard/silver_medal.png" alt="Gold" class="w-6 h-8" />
                            <div>
                                <p class="text-white font-bold">CyberAlice</p>
                                <p class="text-sm text-pink-400">132W - 45L</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-yellow-400 font-bold text-xl">1987 pts</p>
                            <p class="text-sm text-yellow-300">75% WR</p>
                        </div>
                    </div>

                    <!-- rank 3 -->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <img src="assets/dashboard/bronze_medal.png" alt="Gold" class="w-6 h-8" />
                            <div>
                                <p class="text-white font-bold">SynthMaster</p>
                                <p class="text-sm text-pink-400">98W - 32L</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-yellow-400 font-bold text-xl">1654 pts</p>
                            <p class="text-sm text-yellow-300">75% WR</p>
                        </div>
                    </div>

                    <!-- rank 4-->
                    <div class="bg-pink-900/60 border border-yellow-400 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                        <!-- Simule l’espace d'une image de médaille -->
                            <div class="w-8 h-8 flex items-center justify-center">
                                <span class="text-white font-bold text-sm">#4</span>
                            </div>
                            <div>
                                <p class="text-yellow-400 font-bold">Vous</p>
                                <p class="text-sm text-pink-400">28W - 14L</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-yellow-400 font-bold text-xl">1337 pts</p>
                            <p class="text-sm text-yellow-300">67% WR</p>
                        </div>
                    </div>
    
                    <!-- rank 5-->
                    <div class="bg-[#1a0020]/80 p-4 rounded-xl flex justify-between items-center shadow-inner">
                        <div class="flex items-center gap-4">
                            <span class="text-white font-bold text-xl">#5</span>
                            <div>
                                <p class="text-white font-bold">CyberBob</p>
                                <p class="text-sm text-pink-400">45W - 67L</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-yellow-400 font-bold text-xl">892 pts</p>
                            <p class="text-sm text-yellow-300">40% WR</p>
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