export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // DOĞRU HEDEF ADRESLERİ BURASI DOSTUM
    const REPO_OWNER = "smyrnaandsable"; 
    const REPO_NAME = "lab.smyrnaandsable";
    const TOKEN = process.env.GITHUB_TOKEN; 

    if (!TOKEN) {
        return res.status(500).json({ error: 'Internal Configuration Error: Token missing in vault.' });
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${TOKEN}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify({
                event_type: "waste_oracle_signal",
                client_payload: {
                    user_agent: req.headers['user-agent'] || 'unknown',
                    timestamp: new Date().toISOString(),
                    source: "Vercel Secure Serverless Proxy"
                }
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Pipeline successfully activated!' });
        } else {
            const errData = await response.text();
            return res.status(response.status).json({ error: 'GitHub Authentication Failed', details: errData });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Infrastructure Error', details: error.message });
    }
}
