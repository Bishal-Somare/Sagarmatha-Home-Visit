export default async function handler(req, res) {

  if (req.method !== "POST") {

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
          "APPS_SCRIPT_URL is missing from Vercel."

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
            JSON.stringify(
              req.body
            ),

          redirect: "follow"
        }
      );


    const text =
      await response.text();


    console.log(
      "Submit status:",
      response.status
    );


    console.log(
      "Submit response:",
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
          "Google Apps Script returned invalid JSON.",

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
      "SUBMIT ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        error.message

    });

  }

}