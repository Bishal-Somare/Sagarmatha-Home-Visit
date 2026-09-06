// Fixed: this file used to use `export default` (ESM syntax). Without a
// package.json declaring "type": "module", Vercel's Node runtime treats
// .js files as CommonJS, so `export default` throws a SyntaxError at
// request time. The function then never runs your code — Vercel returns
// its own HTML error page instead of JSON, which is exactly what broke
// the frontend ("backend sending data, frontend not taking it": the
// frontend was actually receiving an HTML error page, not JSON).
// module.exports works with zero extra config either way.

module.exports = async function handler(req, res) {
    try {
        const appsScriptUrl = process.env.APPS_SCRIPT_URL;

        if (!appsScriptUrl) {
            return res.status(500).json({
                success: false,
                error: "APPS_SCRIPT_URL environment variable is missing."
            });
        }

        const response = await fetch(`${appsScriptUrl}?action=config`, {
            cache: "no-store"
        });

        const text = await response.text();
        console.log("Apps Script configuration response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            // This happens if the Apps Script URL isn't deployed as
            // "Anyone can access" — Google returns an HTML login page
            // instead of JSON.
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