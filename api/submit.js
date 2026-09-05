export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error:
                "Method not allowed"

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

        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;


        if (!body) {

            return res.status(400).json({

                success: false,

                error:
                    "No form data received."

            });

        }


        const response =
            await fetch(
                appsScriptUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(body)
                }
            );


        const text =
            await response.text();


        let result;


        try {

            result =
                JSON.parse(text);

        } catch {

            result = {

                success: false,

                error:
                    "Invalid response from Google Apps Script."

            };

        }


        if (!result.success) {

            return res.status(400).json(
                result
            );

        }


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Submission error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Unable to submit home visit."

        });

    }

}