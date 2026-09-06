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


/* ==========================================
   MESSAGE
========================================== */

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


/* ==========================================
   LOAD CONFIG
========================================== */

async function loadConfiguration() {

  try {

    classSelect.disabled = true;

    sectionSelect.disabled = true;


    classSelect.innerHTML =
      `<option>Loading classes...</option>`;


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
      "CONFIG:",
      result
    );


    if (
      !response.ok ||
      !result.success
    ) {

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
        "No classes found in Configuration sheet."
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
      error
    );


    classSelect.innerHTML =
      `<option>Unable to load classes</option>`;


    sectionSelect.innerHTML =
      `<option>Select Section</option>`;


    showMessage(
      "Unable to load Class/Section: " +
      error.message,
      "error"
    );

  }

}


/* ==========================================
   CLASS SORT
========================================== */

function classSort(
  a,
  b
) {

  const special = [
    "Nursery",
    "LKG",
    "UKG"
  ];


  const ai =
    special.indexOf(a);

  const bi =
    special.indexOf(b);


  if (
    ai !== -1 ||
    bi !== -1
  ) {

    if (
      ai === -1
    ) return 1;

    if (
      bi === -1
    ) return -1;

    return ai - bi;

  }


  return (
    Number(a) -
    Number(b)
  );

}


/* ==========================================
   POPULATE CLASS
========================================== */

function populateClasses(
  classes
) {

  classSelect.innerHTML =
    `<option value="">
       Select Class
     </option>`;


  classes
    .sort(classSort)
    .forEach(
      function(className) {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          className;


        option.textContent =
          [
            "Nursery",
            "LKG",
            "UKG"
          ].includes(
            className
          )
            ? className
            : "Class " +
              className;


        classSelect.appendChild(
          option
        );

      }
    );

}


/* ==========================================
   CLASS CHANGE
========================================== */

classSelect.addEventListener(
  "change",
  function() {

    const className =
      this.value;


    sectionSelect.innerHTML =
      `<option value="">
         Select Section
       </option>`;


    sectionSelect.disabled =
      true;


    if (!className) {
      return;
    }


    const sections =
      configuration[
        className
      ];


    if (
      !sections ||
      sections.length === 0
    ) {

      showMessage(
        "No sections found for " +
        className,
        "error"
      );

      return;

    }


    sections.forEach(
      function(section) {

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


/* ==========================================
   SUBMIT
========================================== */

form.addEventListener(
  "submit",
  async function(event) {

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
        function(value, key) {

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
              JSON.stringify(
                data
              )

          }
        );


      const result =
        await response.json();


      console.log(
        "SUBMIT:",
        result
      );


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          "Submission failed."
        );

      }


      showMessage(
        "Home visit saved successfully. Record ID: " +
        result.recordId,
        "success"
      );


      form.reset();


      sectionSelect.innerHTML =
        `<option value="">
           Select Section
         </option>`;


      sectionSelect.disabled =
        true;


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

    catch (error) {

      console.error(
        error
      );


      showMessage(
        "Submission failed: " +
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


/* ==========================================
   START
========================================== */

loadConfiguration();