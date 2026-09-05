export default async function handler(req, res) {

    const APPS_SCRIPT_URL =
        process.env.APPS_SCRIPT_URL;

    if (!APPS_SCRIPT_URL) {

        return res.status(500).json({
            success: false,
            error: "APPS_SCRIPT_URL is not configured."
        });

    }


    try {

        const response =
            await fetch(
                `${APPS_SCRIPT_URL}?action=config`
            );


        const data =
            await response.json();


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