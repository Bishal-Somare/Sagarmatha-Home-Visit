export default async function handler(req, res) {

  try {

    const appsScriptUrl =
      process.env.APPS_SCRIPT_URL;


    if (!appsScriptUrl) {

      return res.status(500).json({

        success: false,

        error:
          "APPS_SCRIPT_URL is missing from Vercel."

      });

    }


    const separator =
      appsScriptUrl.includes("?")
        ? "&"
        : "?";


    const url =
      appsScriptUrl +
      separator +
      "action=config";


    const response =
      await fetch(
        url,
        {
          method: "GET",
          redirect: "follow",
          cache: "no-store"
        }
      );


    const text =
      await response.text();


    console.log(
      "Apps Script HTTP status:",
      response.status
    );


    console.log(
      "Apps Script response:",
      text
    );


    if (!response.ok) {

      return res.status(502).json({

        success: false,

        error:
          "Google Apps Script returned HTTP " +
          response.status,

        details:
          text.substring(0, 1000)

      });

    }


    let data;

    try {

      data =
        JSON.parse(text);

    }

    catch (error) {

      return res.status(502).json({

        success: false,

        error:
          "Google Apps Script did not return JSON.",

        details:
          text.substring(0, 1000)

      });

    }


    return res
      .status(200)
      .json(data);

  }

  catch (error) {

    console.error(
      "CONFIG ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        error.message

    });

  }

}