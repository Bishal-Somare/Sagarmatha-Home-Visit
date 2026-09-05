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
                    "APPS_SCRIPT_URL is not configured."

            });

        }


        const response =
            await fetch(
                appsScriptUrl,
                {

                    method:
                        "POST",

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
            "Apps Script:",
            text
        );


        const data =
            JSON.parse(
                text
            );


        return res
            .status(200)
            .json(data);

    }

    catch (error) {

        console.error(
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

}