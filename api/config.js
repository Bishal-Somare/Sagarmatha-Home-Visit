export default async function handler(req, res) {
    try {
        const appsScriptUrl = process.env.APPS_SCRIPT_URL;

        if (!appsScriptUrl) {
            return res.status(500).json({
                success: false,
                error: "APPS_SCRIPT_URL environment variable is missing."
            });
        }

        const url = new URL(appsScriptUrl);
        url.searchParams.set("action", "config");

        const response = await fetch(url.toString(), {
            method: "GET",
            redirect: "follow",
            cache: "no-store"
        });

        const text = await response.text();

        console.log("Status:", response.status);
        console.log("Final URL:", response.url);
        console.log("Response:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            return res.status(502).json({
                success: false,
                error: "Apps Script did not return valid JSON.",
                status: response.status,
                contentType: response.headers.get("content-type"),
                responsePreview: text.substring(0, 2000)
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}