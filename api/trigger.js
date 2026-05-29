// FORCE_DEPLOY_CACHE_BUSTER_V3: TRUE
export default async function handler(req, res) {
    // 1. GÜVENLİK DUVARI: Sadece POST isteklerine izin ver
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. REPO VE KULLANICI BİLGİLERİ (DOĞRULANMIŞ)
    const REPO_OWNER = "smyrnaandsable"; 
    const REPO_NAME = "lab.smyrnaandsable";
    
    // Vercel Environment Variables'dan gelen token
    const TOKEN = process.env.GITHUB_TOKEN; 

    // 3. KASA KONTROLÜ: Token boşsa anında haber ver
    if (!TOKEN || TOKEN.trim() === "") {
        return res.status(500).json({ 
            error: 'Configuration Error', 
            details: 'GITHUB_TOKEN is missing or empty in Vercel Environment Variables.' 
        });
    }

    try {
        // 4. GITHUB REPOSITORY DISPATCH TETİKLEME OPERASYONU
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${TOKEN.trim()}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "Smyrna-Sable-Vercel-Gateway" // GitHub API'si için zorunlu kimlik tanımı
            },
            body: JSON.stringify({
                event_type: "waste_oracle_signal",
                client_payload: {
                    source: "Vercel Secure Serverless Proxy",
                    timestamp: new Date().toISOString()
                }
            })
        });

        // 5. SONUÇ DEĞERLENDİRME
        if (response.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'Pipeline successfully activated! GitHub Actions Engine is running.' 
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