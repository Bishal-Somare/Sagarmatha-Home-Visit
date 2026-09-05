export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error: "Method not allowed."

        });

    }


    const APPS_SCRIPT_URL =
        process.env.APPS_SCRIPT_URL;


    if (!APPS_SCRIPT_URL) {

        return res.status(500).json({

            success: false,

            error:
                "APPS_SCRIPT_URL is not configured."

        });

    }


    try {

        const response =
            await fetch(
                APPS_SCRIPT_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(req.body)

                }
            );


        const text =
            await response.text();


        const data =
            JSON.parse(text);


        return res.status(200).json(
            data
        );

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

}