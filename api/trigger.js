// FORCE_DEPLOY_CACHE_BUSTER_V4: ORACLE_TOKEN_INTEGRATION
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const REPO_OWNER = "smyrnaandsable"; 
    const REPO_NAME = "lab.smyrnaandsable";
    
    // ARTIK BURASI GÜNCELLENDİ: Vercel'deki yeni ORACLE_TOKEN değişkenini çekecek
    const TOKEN = process.env.ORACLE_TOKEN; 

    if (!TOKEN || TOKEN.trim() === "") {
        return res.status(500).json({ 
            error: 'Configuration Error', 
            details: 'ORACLE_TOKEN is missing or empty in Vercel Environment Variables.' 
        });
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${TOKEN.trim()}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "Smyrna-Sable-Vercel-Gateway"
            },
            body: JSON.stringify({
                event_type: "waste_oracle_signal",
                client_payload: {
                    source: "Vercel Secure Serverless Proxy",
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (response.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'Pipeline successfully activated with ORACLE_TOKEN!' 
            });
        } else {
            const errData = await response.text();
            return res.status(response.status).json({ 
                error: `GitHub API Rejected (Status: ${response.status})`, 
                details: errData 
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            error: 'Infrastructure Error', 
            details: error.message 
        });
    }
}