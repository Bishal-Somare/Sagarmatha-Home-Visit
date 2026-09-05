const form =
  document.getElementById(
    "homeVisitForm"
  );


const classSelect =
  document.getElementById(
    "className"
  );


const sectionSelect =
  document.getElementById(
    "section"
  );


const submitButton =
  document.getElementById(
    "submitButton"
  );


const message =
  document.getElementById(
    "message"
  );


let configuration = {};


/* =====================================================
   LOAD CONFIGURATION
===================================================== */

async function loadConfiguration() {

  try {

    showMessage(
      "Loading classes...",
      "success"
    );


    classSelect.disabled =
      true;

    sectionSelect.disabled =
      true;


    const response =
      await fetch(
        "/api/config",
        {
          method: "GET",
          cache: "no-store"
        }
      );


    const result =
      await response.json();


    console.log(
      "CONFIG RESPONSE:",
      result
    );


    if (!response.ok) {

      throw new Error(
        result.error ||
        "Server returned an error."
      );

    }


    if (!result.success) {

      throw new Error(
        result.error ||
        "Unable to load configuration."
      );

    }


    configuration =
      result.classes || {};


    const classes =
      Object.keys(
        configuration
      );


    if (
      classes.length === 0
    ) {

      throw new Error(
        "Configuration sheet is empty."
      );

    }


    populateClasses(
      classes
    );


    classSelect.disabled =
      false;


    message.className =
      "message";


  }

  catch (error) {

    console.error(
      "CONFIGURATION ERROR:",
      error
    );


    classSelect.innerHTML = `
      <option value="">
        Unable to load classes
      </option>
    `;


    sectionSelect.innerHTML = `
      <option value="">
        Select Section
      </option>
    `;


    showMessage(
      "Unable to load Class/Section: " +
      error.message,
      "error"
    );

  }

}


/* =====================================================
   SORT
===================================================== */

function sortClasses(classes) {

  const order = [
    "Nursery",
    "LKG",
    "UKG"
  ];


  return classes.sort(
    (a, b) => {

      const aIndex =
        order.indexOf(a);

      const bIndex =
        order.indexOf(b);


      if (
        aIndex !== -1 &&
        bIndex !== -1
      ) {

        return (
          aIndex -
          bIndex
        );

      }


      if (
        aIndex !== -1
      ) {

        return -1;

      }


      if (
        bIndex !== -1
      ) {

        return 1;

      }


      return (
        Number(a) -
        Number(b)
      );

    }
  );

}


/* =====================================================
   POPULATE CLASSES
===================================================== */

function populateClasses(
  classes
) {

  classSelect.innerHTML = `
    <option value="">
      Select Class
    </option>
  `;


  sortClasses(
    classes
  );


  classes.forEach(
    className => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        className;


      if (
        [
          "Nursery",
          "LKG",
          "UKG"
        ].includes(
          className
        )
      ) {

        option.textContent =
          className;

      }

      else {

        option.textContent =
          "Class " +
          className;

      }


      classSelect.appendChild(
        option
      );

    }
  );

}


/* =====================================================
   CLASS → SECTION
===================================================== */

classSelect.addEventListener(
  "change",
  function () {

    const selectedClass =
      this.value;


    sectionSelect.innerHTML = `
      <option value="">
        Select Section
      </option>
    `;


    sectionSelect.disabled =
      true;


    if (!selectedClass) {
      return;
    }


    const sections =
      configuration[
        selectedClass
      ];


    if (
      !sections ||
      sections.length === 0
    ) {

      showMessage(
        "No sections configured for " +
        selectedClass,
        "error"
      );

      return;

    }


    sections.forEach(
      section => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          section;

        option.textContent =
          section;


        sectionSelect.appendChild(
          option
        );

      }
    );


    sectionSelect.disabled =
      false;

  }
);


/* =====================================================
   SUBMIT
===================================================== */

form.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    if (
      !classSelect.value
    ) {

      showMessage(
        "Please select a class.",
        "error"
      );

      return;

    }


    if (
      !sectionSelect.value
    ) {

      showMessage(
        "Please select a section.",
        "error"
      );

      return;

    }


    submitButton.disabled =
      true;

    submitButton.textContent =
      "Submitting...";


    try {

      const formData =
        new FormData(form);


      const data = {};


      formData.forEach(
        (value, key) => {

          data[key] =
            value;

        }
      );


      const response =
        await fetch(
          "/api/submit",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify(data)

          }
        );


      const result =
        await response.json();


      console.log(
        "SUBMIT RESPONSE:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result.error ||
          "Submission failed."
        );

      }


      if (!result.success) {

        throw new Error(
          result.error ||
          "Submission failed."
        );

      }


      showMessage(
        "✓ Home visit saved successfully. Record ID: " +
        result.recordId,
        "success"
      );


      form.reset();


      sectionSelect.innerHTML = `
        <option value="">
          Select Section
        </option>
      `;


      sectionSelect.disabled =
        true;


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

    catch (error) {

      console.error(
        "SUBMIT ERROR:",
        error
      );


      showMessage(
        error.message,
        "error"
      );

    }

    finally {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Submit Home Visit";

    }

  }
);


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
  text,
  type
) {

  message.textContent =
    text;

  message.className =
    "message " +
    type;

}


/* =====================================================
   START
===================================================== */

loadConfiguration();