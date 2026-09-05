export default async function handler(
    req,
    res
) {

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
                `${appsScriptUrl}?action=config`,
                {
                    cache: "no-store"
                }
            );


        const text =
            await response.text();


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