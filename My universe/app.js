// Dynamic Presence Engine Configuration Matrix
const CONFIG = {
    DISCORD_NODE_ID: '373322710174138371',
    DOM_MOUNT_ELEMENT: document.getElementById('live-presence-node')
};

// Precise asynchronous image asset routing resolution algorithm
const resolveImage = async (image, id = null) => {
    if (!image) {
        if (!id) return null;
        try {
            const res = await fetch(`https://discord.com/api/v10/applications/${id}/rpc`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.icon
                ? `https://cdn.discordapp.com/app-icons/${id}/${data.icon}.png?size=512`
                : null;
        } catch {
            return null;
        }
    }

    if (image.startsWith("mp:external/")) {
        return image.replace("mp:external/", "https://media.discordapp.net/external/");
    }

    if (image.startsWith("spotify:")) {
        return `https://i.scdn.co/image/${image.replace("spotify:", "")}`;
    }

    if (!id) return null;

    return /^\d+\$/.test(image)
        ? `https://cdn.discordapp.com/app-assets/${id}/${image}.png?size=512`
        : `https://cdn.discordapp.com/app-icons/${id}/${image}.png?size=512&keep_aspect_ratio=false`;
};

function initializePresenceStream() {
    console.log("Connecting to advanced dynamic activity pipeline...");
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

    socket.onmessage = async (payload) => {
        const structuralPackage = JSON.parse(payload.data);

        // Opcode 1: Client-Server Handshake Core Process
        if (structuralPackage.op === 1) {
            socket.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: CONFIG.DISCORD_NODE_ID }
            }));
            
            setInterval(() => { 
                socket.send(JSON.stringify({ op: 3 })); 
            }, structuralPackage.d.heartbeat_interval);
        }

        // Opcode 0: Live State & Presence Update Event Parsing Engine
        if (structuralPackage.t === 'INIT_STATE' || structuralPackage.t === 'PRESENCE_UPDATE') {
            const platformData = structuralPackage.d;
            
            // Re-zero current container view nodes
            CONFIG.DOM_MOUNT_ELEMENT.innerHTML = "";
            let activityFound = false;

            // TRACKER PIPELINE 1: Spotify Media Tracking Stream
            if (platformData.listening_to_spotify && platformData.spotify) {
                activityFound = true;
                const trackTitle = platformData.spotify.song;
                const leadArtist = platformData.spotify.artist;
                
                // Construct fallback identifier key matching image context definitions
                const rawTrackImage = `spotify:${platformData.spotify.album_art_url.split('/').pop()}`;
                const resolvedSpotifyArt = await resolveImage(rawTrackImage);

                CONFIG.DOM_MOUNT_ELEMENT.innerHTML = `
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <img src="${resolvedSpotifyArt || platformData.spotify.album_art_url}" style="width: 65px; height: 65px; border: 1px solid #ef4444;" alt="Album Cover">
                        <div>
                            <div style="font-size: 0.75rem; color: #ef4444; letter-spacing: 1px; margin-bottom: 2px;">LISTENING TO SPOTIFY</div>
                            <div style="font-weight: 700; font-size: 1.05rem; color: #ffffff; letter-spacing: 0.5px;">${trackTitle}</div>
                            <div style="font-size: 0.8rem; color: #777777; margin-top: 2px;">by ${leadArtist}</div>
                        </div>
                    </div>
                `;
            } 
            
            // TRACKER PIPELINE 2: Comprehensive Multi-Activity & Rich Presence Router
            else if (platformData.activities && platformData.activities.length > 0) {
                // Filter out standard type 4 chat text bubbles
                const trueActivities = platformData.activities.filter(act => act.type !== 4);
                
                if (trueActivities.length > 0) {
                    activityFound = true;
                    const game = trueActivities[0];
                    const gameName = game.name;
                    const gameDetails = game.details || "In the zone...";
                    const gameState = game.state || "";
                    const appId = game.application_id || null;

                    // Pull image key configurations based on asset availability hierarchy
                    let rawImageKey = null;
                    if (game.assets) {
                        rawImageKey = game.assets.large_image || game.assets.small_image || null;
                    }

                    // Dynamically await resolution map matching
                    const resolvedGameIcon = await resolveImage(rawImageKey, appId);
                    const finalIconUrl = resolvedGameIcon || "https://discordapp.com";

                    CONFIG.DOM_MOUNT_ELEMENT.innerHTML = `
                        <div style="display: flex; gap: 20px; align-items: center;">
                            <img src="${finalIconUrl}" style="width: 65px; height: 65px; border: 1px solid #ef4444; border-radius: 4px;" alt="Activity Icon">
                            <div>
                                <div style="font-size: 0.75rem; color: #ef4444; letter-spacing: 1px; margin-bottom: 2px;">CURRENTLY ACTIVE</div>
                                <div style="font-weight: 700; font-size: 1.05rem; color: #ffffff; letter-spacing: 0.5px;">${gameName}</div>
                                <div style="font-size: 0.8rem; color: #777777; margin-top: 2px;">${gameDetails} ${gameState ? `| \${gameState}` : ''}</div>
                            </div>
                        </div>
                    `;
                }
            }

            // FALLBACK SYSTEM: Empty state static idle handler
            if (!activityFound) {
                CONFIG.DOM_MOUNT_ELEMENT.innerHTML = `
                    <span style="color: #444444; font-size: 0.85rem; letter-spacing: 1px;">
                        // AMBIENT CONNECTION ONLINE // OFFLINE
                    </span>
                `;
            }
        }
    };

    socket.onclose = () => { 
        setTimeout(initializePresenceStream, 5000); 
    };
}

initializePresenceStream();
