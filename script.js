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


/****************************************************
 * LOAD CONFIGURATION
 ****************************************************/

async function loadConfiguration() {

    classSelect.disabled = true;

    sectionSelect.disabled = true;

    classSelect.innerHTML = `
        <option value="">
            Loading classes...
        </option>
    `;

    sectionSelect.innerHTML = `
        <option value="">
            Select Section
        </option>
    `;


    try {

        const response =
            await fetch(
                "/api/config",
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        const text =
            await response.text();


        console.log(
            "Config HTTP status:",
            response.status
        );


        console.log(
            "Config response:",
            text
        );


        let result;


        try {

            result =
                JSON.parse(text);

        }

        catch (error) {

            throw new Error(
                "Configuration server returned invalid JSON: " +
                text.substring(0, 300)
            );

        }


        if (
            !response.ok
        ) {

            throw new Error(
                result.error ||
                `Configuration request failed (${response.status}).`
            );

        }


        if (
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
                "No classes found in the Configuration sheet."
            );

        }


        populateClasses(
            classes
        );


        classSelect.disabled =
            false;


        clearMessage();


        console.log(
            "Classes loaded:",
            configuration
        );

    }

    catch (error) {

        console.error(
            "Configuration error:",
            error
        );


        classSelect.innerHTML = `
            <option value="">
                Unable to load classes
            </option>
        `;


        sectionSelect.innerHTML = `
            <option value="">
                Unable to load sections
            </option>
        `;


        classSelect.disabled =
            true;


        sectionSelect.disabled =
            true;


        showMessage(
            error.message,
            "error"
        );

    }
}


/****************************************************
 * SORT CLASSES
 ****************************************************/

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
                !Number.isNaN(aNumber) &&
                !Number.isNaN(bNumber)
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


/****************************************************
 * POPULATE CLASSES
 ****************************************************/

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


            option.textContent =
                [
                    "Nursery",
                    "LKG",
                    "UKG"
                ].includes(
                    className
                )
                    ? className
                    : `Class ${className}`;


            classSelect.appendChild(
                option
            );

        }
    );
}


/****************************************************
 * CLASS CHANGED
 ****************************************************/

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


        if (
            !selectedClass
        ) {

            return;

        }


        const sections =
            configuration[
                selectedClass
            ];


        console.log(
            "Selected class:",
            selectedClass
        );


        console.log(
            "Sections:",
            sections
        );


        if (
            !Array.isArray(
                sections
            ) ||
            sections.length === 0
        ) {

            showMessage(
                "No sections configured for this class.",
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


        clearMessage();

    }
);


/****************************************************
 * FORM SUBMISSION
 ****************************************************/

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
                                "application/json",

                            "Accept":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                data
                            )

                    }
                );


            const text =
                await response.text();


            let result;


            try {

                result =
                    JSON.parse(
                        text
                    );

            }

            catch {

                throw new Error(
                    "Server returned invalid JSON: " +
                    text.substring(0, 300)
                );

            }


            console.log(
                "Server result:",
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
                `✓ Home visit saved successfully. Record ID: ${result.recordId}`,
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
                "Submission error:",
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


/****************************************************
 * MESSAGE
 ****************************************************/

function showMessage(
    text,
    type
) {

    message.textContent =
        text;


    message.className =
        `message ${type}`;

}


function clearMessage() {

    message.textContent =
        "";


    message.className =
        "message";

}


/****************************************************
 * START
 ****************************************************/

loadConfiguration();