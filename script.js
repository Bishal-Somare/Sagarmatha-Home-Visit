const form =
    document.getElementById("homeVisitForm");

const classSelect =
    document.getElementById("className");

const sectionSelect =
    document.getElementById("section");

const photoInput =
    document.getElementById("studentPhoto");

const photoPreview =
    document.getElementById("photoPreview");

const removePhoto =
    document.getElementById("removePhoto");

const submitButton =
    document.getElementById("submitButton");

const message =
    document.getElementById("message");


let configuration = {};

let compressedPhoto = null;


/*
====================================================
LOAD CONFIGURATION
====================================================
*/

async function loadConfiguration() {

    try {

        const response =
            await fetch("/api/config");

        if (!response.ok) {

            throw new Error(
                "Unable to load class configuration."
            );

        }

        configuration =
            await response.json();


        populateClasses();

    }

    catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


/*
====================================================
POPULATE CLASS
====================================================
*/

function populateClasses() {

    classSelect.innerHTML = `
        <option value="">
            Select Class
        </option>
    `;


    Object.keys(configuration)
        .forEach(className => {

            const option =
                document.createElement("option");

            option.value =
                className;

            option.textContent =
                className === "Nursery" ||
                className === "LKG" ||
                className === "UKG"
                    ? className
                    : `Class ${className}`;

            classSelect.appendChild(
                option
            );

        });

}


/*
====================================================
CLASS CHANGE
====================================================
*/

classSelect.addEventListener(
    "change",
    () => {

        const selectedClass =
            classSelect.value;


        sectionSelect.innerHTML = `
            <option value="">
                Select Section
            </option>
        `;


        sectionSelect.disabled =
            !selectedClass;


        if (!selectedClass) {
            return;
        }


        const sections =
            configuration[
                selectedClass
            ] || [];


        sections.forEach(section => {

            const option =
                document.createElement("option");

            option.value =
                section;

            option.textContent =
                section;

            sectionSelect.appendChild(
                option
            );

        });

    }
);


/*
====================================================
PHOTO SELECTION
====================================================
*/

photoInput.addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) {
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


            removePhoto.classList.remove(
                "hidden"
            );

        }

        catch (error) {

            showMessage(
                "Unable to process photo.",
                "error"
            );

        }

    }
);


/*
====================================================
REMOVE PHOTO
====================================================
*/

removePhoto.addEventListener(
    "click",
    () => {

        photoInput.value = "";

        compressedPhoto = null;

        photoPreview.innerHTML = `
            <span>
                No photo selected
            </span>
        `;

        removePhoto.classList.add(
            "hidden"
        );

    }
);


/*
====================================================
IMAGE COMPRESSION
====================================================
*/

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

                    const img =
                        new Image();


                    img.onload =
                        () => {

                            let width =
                                img.width;

                            let height =
                                img.height;


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


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.drawImage(
                                img,
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

                                base64,

                                fileName:
                                    file.name,

                                mimeType:
                                    "image/jpeg"

                            });

                        };


                    img.onerror =
                        reject;


                    img.src =
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


/*
====================================================
FORM SUBMIT
====================================================
*/

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (
            !classSelect.value ||
            !sectionSelect.value
        ) {

            showMessage(
                "Please select class and section.",
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


            data.className =
                classSelect.value;


            data.section =
                sectionSelect.value;


            if (compressedPhoto) {

                data.photo =
                    compressedPhoto;

            }


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


            if (!result.success) {

                throw new Error(
                    result.error ||
                    "Submission failed."
                );

            }


            showMessage(
                `✓ Saved successfully. Record ID: ${result.recordId}`,
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


            removePhoto.classList.add(
                "hidden"
            );

        }

        catch (error) {

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


/*
====================================================
MESSAGE
====================================================
*/

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        `message ${type}`;

}


/*
====================================================
START
====================================================
*/

loadConfiguration();