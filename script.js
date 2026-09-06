const form = document.getElementById("homeVisitForm");
const classSelect = document.getElementById("className");
const sectionSelect = document.getElementById("section");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

let configuration = {};

/****************************************************
 * LOAD CONFIGURATION
 ****************************************************/
async function loadConfiguration() {
    try {
        classSelect.disabled = true;
        sectionSelect.disabled = true;
        classSelect.innerHTML = `<option value="">Loading classes...</option>`;

        const response = await fetch("/api/config", { cache: "no-store" });

        // Guard against non-JSON responses (e.g. a Vercel error page),
        // which is what used to cause "backend sent data, frontend
        // didn't take it" — response.json() would throw a cryptic
        // "Unexpected token <" instead of a useful message.
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response from /api/config:", text);
            throw new Error("Server did not return JSON. Check server logs / deployment.");
        }

        const result = await response.json();
        console.log("Configuration:", result);

        if (!result.success) {
            throw new Error(result.error || "Unable to load configuration.");
        }

        configuration = result.classes || {};
        const classes = Object.keys(configuration);

        if (classes.length === 0) {
            throw new Error("No classes found in Configuration sheet.");
        }

        populateClasses(classes);
        classSelect.disabled = false;

    } catch (error) {
        console.error(error);
        classSelect.innerHTML = `<option value="">Failed to load classes</option>`;
        showMessage(error.message, "error");
    }
}

/****************************************************
 * SORT CLASSES
 ****************************************************/
function sortClasses(classes) {
    const special = ["Nursery", "LKG", "UKG"];

    return classes.sort((a, b) => {
        const aSpecial = special.indexOf(a);
        const bSpecial = special.indexOf(b);

        if (aSpecial !== -1 && bSpecial !== -1) return aSpecial - bSpecial;
        if (aSpecial !== -1) return -1;
        if (bSpecial !== -1) return 1;

        const aNumber = Number(a);
        const bNumber = Number(b);

        if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
            return aNumber - bNumber;
        }

        return a.localeCompare(b);
    });
}

/****************************************************
 * POPULATE CLASSES
 ****************************************************/
function populateClasses(classes) {
    classSelect.innerHTML = `<option value="">Select Class</option>`;
    sortClasses(classes);

    classes.forEach(className => {
        const option = document.createElement("option");
        option.value = className;
        option.textContent = ["Nursery", "LKG", "UKG"].includes(className)
            ? className
            : `Class ${className}`;
        classSelect.appendChild(option);
    });
}

/****************************************************
 * CLASS CHANGED
 ****************************************************/
classSelect.addEventListener("change", function () {
    const selectedClass = this.value;

    sectionSelect.innerHTML = `<option value="">Select Section</option>`;
    sectionSelect.disabled = true;

    if (!selectedClass) return;

    const sections = configuration[selectedClass];

    if (!sections || !Array.isArray(sections)) {
        showMessage("No sections configured for this class.", "error");
        return;
    }

    sections.forEach(section => {
        const option = document.createElement("option");
        option.value = section;
        option.textContent = section;
        sectionSelect.appendChild(option);
    });

    sectionSelect.disabled = false;
});

/****************************************************
 * FORM SUBMISSION
 ****************************************************/
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!classSelect.value) {
        showMessage("Please select a class.", "error");
        return;
    }

    if (!sectionSelect.value) {
        showMessage("Please select a section.", "error");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        data.className = classSelect.value;
        data.section = sectionSelect.value;

        console.log("Submitting:", data);

        const response = await fetch("/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response from /api/submit:", text);
            throw new Error("Server did not return JSON. Check server logs / deployment.");
        }

        const result = await response.json();
        console.log("Server result:", result);

        if (!result.success) {
            throw new Error(result.error || "Submission failed.");
        }

        showMessage(`✓ Home visit saved successfully. Record ID: ${result.recordId}`, "success");

        form.reset();
        sectionSelect.innerHTML = `<option value="">Select Section</option>`;
        sectionSelect.disabled = true;

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error(error);
        showMessage(error.message, "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Home Visit";
    }
});

/****************************************************
 * MESSAGE
 ****************************************************/
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
}

/****************************************************
 * START APPLICATION
 ****************************************************/
loadConfiguration();