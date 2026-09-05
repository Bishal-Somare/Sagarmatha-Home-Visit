export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });

    }


    const appsScriptUrl =
        process.env.APPS_SCRIPT_URL;


    if (!appsScriptUrl) {

        return res.status(500).json({

            success: false,

            error:
                "APPS_SCRIPT_URL is not configured."

        });

    }


    try {

        const url =
            `${appsScriptUrl}?action=config`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Google Apps Script returned ${response.status}`
            );

        }


        const data =
            await response.json();


        return res.status(200).json(
            data
        );


    } catch (error) {

        console.error(
            "Configuration error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Unable to retrieve school configuration."

        });

    }

}