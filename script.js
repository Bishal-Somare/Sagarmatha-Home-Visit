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


const photoInput =
    document.getElementById(
        "studentPhoto"
    );


const photoPreview =
    document.getElementById(
        "photoPreview"
    );


const removePhoto =
    document.getElementById(
        "removePhoto"
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

let compressedPhoto = null;


/****************************************************
 * LOAD CONFIGURATION
 ****************************************************/

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


        if (!selectedClass) {

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
            !sections ||
            !Array.isArray(
                sections
            )
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


                sectionSelect
                    .appendChild(
                        option
                    );

            }
        );


        sectionSelect.disabled =
            false;

    }
);


/****************************************************
 * PHOTO
 ****************************************************/

photoInput.addEventListener(
    "change",
    async function () {

        const file =
            this.files[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                "Please select an image.",
                "error"
            );


            this.value = "";


            return;

        }


        try {

            compressedPhoto =
                await compressImage(
                    file,
                    1200,
                    0.75
                );


            photoPreview.innerHTML = `

                <img
                    src="${compressedPhoto.base64}"
                    alt="Student Photo"
                >

            `;


            removePhoto.classList
                .remove(
                    "hidden"
                );

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                "Unable to process photo.",
                "error"
            );

        }

    }
);


/****************************************************
 * REMOVE PHOTO
 ****************************************************/

removePhoto.addEventListener(
    "click",
    function () {

        photoInput.value =
            "";


        compressedPhoto =
            null;


        photoPreview.innerHTML = `

            <span>
                No photo selected
            </span>

        `;


        removePhoto.classList
            .add(
                "hidden"
            );

    }
);


/****************************************************
 * COMPRESS IMAGE
 ****************************************************/

function compressImage(
    file,
    maxWidth,
    quality
) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const image =
                        new Image();


                    image.onload =
                        () => {

                            let width =
                                image.width;


                            let height =
                                image.height;


                            if (
                                width >
                                maxWidth
                            ) {

                                height =
                                    height *
                                    (
                                        maxWidth /
                                        width
                                    );


                                width =
                                    maxWidth;

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            const base64 =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    quality
                                );


                            resolve({

                                base64:

                                    base64,

                                mimeType:

                                    "image/jpeg"

                            });

                        };


                    image.onerror =
                        reject;


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


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


            data.className =
                classSelect.value;


            data.section =
                sectionSelect.value;


            if (
                compressedPhoto
            ) {

                data.photo =
                    compressedPhoto;

            }


            console.log(
                "Submitting:",
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
                "Server result:",
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


            compressedPhoto =
                null;


            photoPreview.innerHTML = `
                <span>
                    No photo selected
                </span>
            `;


            removePhoto.classList
                .add(
                    "hidden"
                );


            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            );

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


/****************************************************
 * START APPLICATION
 ****************************************************/

loadConfiguration();