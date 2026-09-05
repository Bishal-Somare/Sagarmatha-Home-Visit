export default async function handler(
    req,
    res
) {

    if (
        req.method !== "POST"
    ) {

        return res.status(405).json({

            success: false,

            error:
                "Method not allowed."

        });

    }


    try {

        const appsScriptUrl =
            process.env.APPS_SCRIPT_URL;


        if (!appsScriptUrl) {

            return res.status(500).json({

                success: false,

                error:
                    "APPS_SCRIPT_URL environment variable is missing."

            });

        }


        const response =
            await fetch(
                appsScriptUrl,
                {

                    method:
                        "POST",

                    redirect:
                        "follow",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            req.body
                        )

                }
            );


        const text =
            await response.text();


        console.log(
            "Apps Script submission:",
            text
        );


        let data;


        try {

            data =
                JSON.parse(
                    text
                );

        }

        catch {

            return res.status(502).json({

                success: false,

                error:
                    "Apps Script did not return valid JSON.",

                responsePreview:
                    text.substring(
                        0,
                        1000
                    )

            });

        }


        return res.status(200).json(
            data
        );

    }

    catch (error) {

        console.error(
            "Submit error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }
}