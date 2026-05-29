// FORCE_DEPLOY_CACHE_BUSTER_V5: DEBUG_MODE_ENABLED
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const REPO_OWNER = "smyrnaandsable"; 
    const REPO_NAME = "lab.smyrnaandsable";
    const TOKEN = process.env.ORACLE_TOKEN; 

    if (!TOKEN) {
        return res.status(500).json({ error: 'Environment Variable ORACLE_TOKEN not detected by serverless function.' });
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json", // v3 sürümü daha kararlıdır
                "Authorization": `token ${TOKEN.trim()}`,   // Bearer yerine "token" anahtar kelimesini deniyoruz
                "User-Agent": "Vercel-Serverless-Gateway"   // Basit bir User-Agent
            },
            body: JSON.stringify({
                event_type: "waste_oracle_signal",
                client_payload: {
                    source: "Vercel_Gateway_Debug",
                    timestamp: new Date().toISOString()
                }
            })
        });

        // HATA YAKALAMA VE DETAYLANDIRMA
        const responseText = await response.text();
        
        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Pipeline successfully activated!' });
        } else {
            return res.status(response.status).json({ 
                error: `GitHub API rejected request. Status: ${response.status}`,
                debug_details: responseText // BURASI BİZE HATANIN GERÇEK SEBEBİNİ (404, 401, 403) SÖYLEYECEK
            });
        }
    } catch (error) {
        return res.status(500).json({ error: 'System error', details: error.message });
    }
}