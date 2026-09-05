export default async function handler(req, res) {
    try {
        const appsScriptUrl = process.env.APPS_SCRIPT_URL;

        if (!appsScriptUrl) {
            return res.status(500).json({
                success: false,
                error: "APPS_SCRIPT_URL environment variable is missing."
            });
        }

        const url =
            `${appsScriptUrl}?action=config`;

        console.log("Calling Apps Script:", url);

        const response = await fetch(url, {
            method: "GET",
            redirect: "follow",
            cache: "no-store"
        });

        const text = await response.text();

        console.log("Apps Script HTTP status:", response.status);
        console.log("Apps Script content type:", response.headers.get("content-type"));
        console.log("Apps Script response:", text);

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                error: `Apps Script returned HTTP ${response.status}`,
                response: text
            });
        }

        let data;

        try {
            data = JSON.parse(text);
        } catch (parseError) {
            return res.status(502).json({
                success: false,
                error: "Apps Script did not return valid JSON.",
                responsePreview: text.substring(0, 1000)
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Configuration error:", error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}