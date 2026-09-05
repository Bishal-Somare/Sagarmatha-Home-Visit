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


/* ==================================================
   LOAD CONFIGURATION
================================================== */

async function loadConfiguration() {

    try {

        classSelect.disabled =
            true;

        sectionSelect.disabled =
            true;

        classSelect.innerHTML = `
            <option value="">
                Loading classes...
            </option>
        `;


        const response =
            await fetch(
                "/api/config",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to connect to server."
            );

        }


        const result =
            await response.json();


        console.log(
            "Configuration:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.error ||
                "Unable to load classes."
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

    }

    catch (error) {

        console.error(
            error
        );


        classSelect.innerHTML = `
            <option value="">
                Failed to load classes
            </option>
        `;


        showMessage(
            error.message,
            "error"
        );

    }

}


/* ==================================================
   SORT CLASSES
================================================== */

function sortClasses(
    classes
) {

    const special = [
        "Nursery",
        "LKG",
        "UKG"
    ];


    return classes.sort(
        (a, b) => {

            const aSpecial =
                special.indexOf(a);

            const bSpecial =
                special.indexOf(b);


            if (
                aSpecial !== -1 &&
                bSpecial !== -1
            ) {

                return (
                    aSpecial -
                    bSpecial
                );

            }


            if (
                aSpecial !== -1
            ) {

                return -1;

            }


            if (
                bSpecial !== -1
            ) {

                return 1;

            }


            const aNumber =
                Number(a);

            const bNumber =
                Number(b);


            if (
                !Number.isNaN(
                    aNumber
                ) &&
                !Number.isNaN(
                    bNumber
                )
            ) {

                return (
                    aNumber -
                    bNumber
                );

            }


            return a.localeCompare(
                b
            );

        }
    );

}


/* ==================================================
   POPULATE CLASS
================================================== */

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
                    `Class ${className}`;

            }


            classSelect.appendChild(
                option
            );

        }
    );

}


/* ==================================================
   CLASS CHANGE
================================================== */

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


        console.log(
            "Selected Class:",
            selectedClass
        );


        console.log(
            "Sections:",
            sections
        );


        if (
            !sections ||
            !Array.isArray(
                sections
            )
        ) {

            showMessage(
                "No sections found for this class.",
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


/* ==================================================
   SUBMIT
================================================== */

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
                new FormData(
                    form
                );


            const data = {};


            formData.forEach(
                (
                    value,
                    key
                ) => {

                    data[key] =
                        value;

                }
            );


            data.className =
                classSelect.value;


            data.section =
                sectionSelect.value;


            console.log(
                "Submitting data:",
                data
            );


            const response =
                await fetch(
                    "/api/submit",
                    {

                        method:
                            "POST",

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
                "Server response:",
                result
            );


            if (
                !result.success
            ) {

                throw new Error(
                    result.error ||
                    "Submission failed."
                );

            }


            showMessage(
                `✓ Successfully saved. Record ID: ${result.recordId}`,
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


/* ==================================================
   MESSAGE
================================================== */

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        `message ${type}`;

}


/* ==================================================
   START
================================================== */

loadConfiguration();