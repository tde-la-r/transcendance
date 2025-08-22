type Friend = {
    id: string;
    username: string;
    alias?: string;
    avatar_url?: string;
    online: boolean;
};

const FRIENDS_KEY = "friends";

function readFriends(): Friend[] {
    try { return JSON.parse(localStorage.getItem(FRIENDS_KEY) || "[]"); }
    catch { return []; }
}
function saveFriends(list: Friend[]) {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(list));
}

