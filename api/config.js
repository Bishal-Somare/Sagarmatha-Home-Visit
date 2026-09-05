export default async function handler(req, res) {

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


        const url =
            new URL(
                appsScriptUrl
            );


        url.searchParams.set(
            "action",
            "config"
        );


        const result =
            await fetchAppsScript_(
                url.toString()
            );


        let data;


        try {

            data =
                JSON.parse(
                    result.body
                );

        }

        catch (error) {

            console.error(
                "Invalid Apps Script response:",
                result.body
            );


            return res.status(502).json({

                success: false,

                error:
                    "Apps Script did not return valid JSON.",

                appsScriptStatus:
                    result.status,

                responsePreview:
                    result.body.substring(
                        0,
                        2000
                    )

            });

        }


        return res.status(200).json(
            data
        );

    }

    catch (error) {

        console.error(
            "Config API error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                error.message

        });

    }
}


/****************************************************
 * APPS SCRIPT FETCH WITH MANUAL REDIRECT HANDLING
 ****************************************************/

async function fetchAppsScript_(
    initialUrl
) {

    let currentUrl =
        initialUrl;


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        console.log(
            "Requesting:",
            currentUrl
        );


        const response =
            await fetch(
                currentUrl,
                {
                    method: "GET",

                    redirect: "manual",

                    cache: "no-store"
                }
            );


        const status =
            response.status;


        /*
         * Normal response.
         */

        if (
            status >= 200 &&
            status < 300
        ) {

            const body =
                await response.text();


            return {

                status:
                    status,

                body:
                    body

            };

        }


        /*
         * Google Apps Script may return
         * a redirect to script.googleusercontent.com.
         */

        if (
            status >= 300 &&
            status < 400
        ) {

            const location =
                response.headers.get(
                    "location"
                );


            if (!location) {

                throw new Error(
                    `Apps Script returned HTTP ${status} without a redirect location.`
                );

            }


            currentUrl =
                new URL(
                    location,
                    currentUrl
                ).toString();


            continue;

        }


        const body =
            await response.text();


        throw new Error(
            `Apps Script returned HTTP ${status}: ${body.substring(0, 500)}`
        );

    }


    throw new Error(
        "Too many redirects while contacting Apps Script."
    );
}