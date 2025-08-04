export function laodDashboard(): void {
    const content = document.getElementById("dashboard-content");
    const buttons = document.querySelectorAll(".tab-button");
    
    const views = {
        stats: `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/controller.svg" alt="Partie jouées" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pink-300">Parties jouées</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">128</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/trophy.svg" alt="Victoires" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pink-300">Victoires</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">74</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/broken-heart.svg" alt="Broken heart" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Loose</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">54</p>             
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/bar-chart.svg" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Win rate</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">57.8%</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/flamme.png" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Win streak</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">3</p>
                </div>
                <div class="bg-[#1a1a2e]/70 p-6 rounded-xl shadow-neon flex flex-col items-center transistion-transform transform hover:scale-105 duration-300">
                    <img src="assets/medal.png" alt="Win rate" class="w-10 h-10 mb-4" />
                    <p class="text-xl font-bold text-pinj-300">Rank</p>
                    <p class="text-3xl font-extrabold mt-2 text-white">1</p>
                </div>
            <div>
        `,
        history: `
            <div class="space-y-4">
                <div class="bg-[#1a1a2e]/60 p-4 rounded-md shadow">Victoire contre Alice (11-8)</div>
                <div class="bg-[#1a1a2e]/60 p-4 rounded-md shadow">Défaute contre Bob (7-11)</div>
                <div class="bg-[#1a1a2e]/60 p-4 rounded-md shadow">Victoire contre Charlie (11-9)</div>
            </div>
        `,
        ranking: `
            <table class="w-full text-left table-auto border-separate border-spacing-y-4">
                <thread class="text-pink-300">
                    <tr>
                        <th>#</th><th>Joueur</th><th>Score</th>
                    </th>
                </thread>
                <tbody class="text-white">
                    <tr><td>1</td><td>Alice</td><td>2350</td></tr>
                    <tr><td>2</td><td>Charlie</td><td>2280</td></tr>
                    <tr><td>3</td><td>Bob</td><td>2175</td></tr>
                </tbody>
            </table>
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