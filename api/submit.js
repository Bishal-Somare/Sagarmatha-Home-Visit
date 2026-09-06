module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed."
        });
    }

    try {
        const appsScriptUrl = process.env.APPS_SCRIPT_URL;

        if (!appsScriptUrl) {
            return res.status(500).json({
                success: false,
                error: "APPS_SCRIPT_URL environment variable is missing."
            });
        }

        const response = await fetch(appsScriptUrl, {
            method: "POST",
            headers: {
                // Kept as text/plain on purpose: Apps Script web apps
                // don't handle CORS preflight (OPTIONS) requests, so
                // application/json from a browser would fail. text/plain
                // avoids the preflight; Code.gs still JSON.parses the body.
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();
        console.log("Apps Script submission response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(
                "Apps Script did not return valid JSON. Check that the " +
                "web app deployment is set to 'Anyone' access and the URL is current."
            );
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};