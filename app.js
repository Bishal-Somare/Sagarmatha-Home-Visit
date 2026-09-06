// /******************************************************
//  * HOME VISIT FRONTEND
//  ******************************************************/

// const classSelect =
//     document.getElementById("className");

// const sectionSelect =
//     document.getElementById("section");

// const form =
//     document.getElementById("homeVisitForm");

// const submitButton =
//     document.getElementById("submitButton");

// const statusBox =
//     document.getElementById("status");


// /******************************************************
//  * LOAD CLASS CONFIGURATION
//  ******************************************************/

// async function loadConfiguration() {

//     try {

//         setStatus(
//             "Loading classes...",
//             ""
//         );

//         const response =
//             await fetch(
//                 "/api/config"
//             );

//         const result =
//             await response.json();

//         if (!result.success) {

//             throw new Error(
//                 result.error ||
//                 "Unable to load classes."
//             );

//         }

//         populateClasses(
//             result.classes
//         );

//         setStatus("", "");

//     } catch (error) {

//         console.error(error);

//         setStatus(
//             "Unable to load class configuration.",
//             "error"
//         );

//     }

// }


// /******************************************************
//  * POPULATE CLASSES
//  ******************************************************/

// function populateClasses(classes) {

//     classSelect.innerHTML =
//         `<option value="">
//             Select Class
//         </option>`;

//     Object.keys(classes).forEach(
//         className => {

//             const option =
//                 document.createElement(
//                     "option"
//                 );

//             option.value =
//                 className;

//             option.textContent =
//                 `Class ${className}`;

//             classSelect.appendChild(
//                 option
//             );

//         }
//     );

//     window.schoolClasses =
//         classes;

// }


// /******************************************************
//  * CLASS CHANGE
//  ******************************************************/

// classSelect.addEventListener(
//     "change",
//     function () {

//         const selectedClass =
//             this.value;

//         sectionSelect.innerHTML =
//             `<option value="">
//                 Select Section
//             </option>`;

//         sectionSelect.disabled =
//             true;

//         if (
//             !selectedClass ||
//             !window.schoolClasses
//         ) {
//             return;
//         }

//         const sections =
//             window.schoolClasses[
//                 selectedClass
//             ] || [];

//         sections.forEach(
//             section => {

//                 const option =
//                     document.createElement(
//                         "option"
//                     );

//                 option.value =
//                     section;

//                 option.textContent =
//                     section;

//                 sectionSelect.appendChild(
//                     option
//                 );

//             }
//         );

//         sectionSelect.disabled =
//             sections.length === 0;

//     }
// );


// /******************************************************
//  * FORM SUBMISSION
//  ******************************************************/

// form.addEventListener(
//     "submit",
//     async function (event) {

//         event.preventDefault();

//         clearStatus();


//         /**********************************************
//          * CHECK CLASS
//          **********************************************/

//         if (!classSelect.value) {

//             setStatus(
//                 "Please select a class.",
//                 "error"
//             );

//             classSelect.focus();

//             return;

//         }


//         /**********************************************
//          * CHECK SECTION
//          **********************************************/

//         if (!sectionSelect.value) {

//             setStatus(
//                 "Please select a section.",
//                 "error"
//             );

//             sectionSelect.focus();

//             return;

//         }


//         /**********************************************
//          * DISABLE BUTTON
//          **********************************************/

//         submitButton.disabled =
//             true;

//         submitButton.textContent =
//             "Submitting...";


//         try {

//             const data =
//                 collectFormData();


//             const response =
//                 await fetch(
//                     "/api/submit",
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type":
//                                 "application/json"
//                         },

//                         body:
//                             JSON.stringify(data)
//                     }
//                 );


//             const result =
//                 await response.json();


//             if (!result.success) {

//                 throw new Error(
//                     result.error ||
//                     "Submission failed."
//                 );

//             }


//             /****************************************
//              * SUCCESS
//              ****************************************/

//             setStatus(
//                 `✓ Record saved successfully to ${result.sheet}.`,
//                 "success"
//             );


//             form.reset();

//             sectionSelect.innerHTML =
//                 `<option value="">
//                     Select Section
//                 </option>`;

//             sectionSelect.disabled =
//                 true;


//         } catch (error) {

//             console.error(error);

//             setStatus(
//                 error.message ||
//                 "Something went wrong.",
//                 "error"
//             );

//         } finally {

//             submitButton.disabled =
//                 false;

//             submitButton.textContent =
//                 "Submit Home Visit";

//         }

//     }
// );


// /******************************************************
//  * COLLECT FORM DATA
//  ******************************************************/

// function collectFormData() {

//     return {

//         visitDate:
//             value("visitDate"),

    

//         studentName:
//             value("studentName"),

//         className:
//             value("className"),

//         section:
//             value("section"),

//         rollNo:
//             value("rollNo"),

//         siblings:
//             value("siblings"),

//         fatherName:
//             value("fatherName"),

//         motherName:
//             value("motherName"),

//         occupation:
//             value("occupation"),

//         address:
//             value("address"),

//         contact:
//             value("contact"),


//         readingHomework:
//             value("readingHomework"),

//         writingHomework:
//             value("writingHomework"),

//         interestedIn:
//             value("interestedIn"),


//         familyBehaviour:
//             radioValue("familyBehaviour"),

//         guestResponse:
//             radioValue("guestResponse"),

//         keepThings:
//             radioValue("keepThings"),

//         junkFood:
//             radioValue("junkFood"),

//         mobileLaptop:
//             radioValue("mobileLaptop"),

//         tvWatching:
//             radioValue("tvWatching"),

//         householdActivities:
//             radioValue("householdActivities"),

//         personalClothes:
//             radioValue("personalClothes"),

//         schoolOpinion:
//             value("schoolOpinion"),


//         guardianAppreciates:
//             radioValue(
//                 "guardianAppreciates"
//             ),

//         guardianSocialActivities:
//             radioValue(
//                 "guardianSocialActivities"
//             ),

//         guardianFamilyInformation:
//             radioValue(
//                 "guardianFamilyInformation"
//             ),

//         guardianTime:
//             radioValue(
//                 "guardianTime"
//             ),

//         guardianPrograms:
//             radioValue(
//                 "guardianPrograms"
//             ),

//         guardianMistakes:
//             radioValue(
//                 "guardianMistakes"
//             ),


//         newStudentName:
//             value("newStudentName"),

//         newStudentAddress:
//             value("newStudentAddress"),


//         remarks:
//             value("remarks")

//     };

// }


// /******************************************************
//  * NORMAL INPUT VALUE
//  ******************************************************/

// function value(id) {

//     const element =
//         document.getElementById(id);

//     return element
//         ? element.value.trim()
//         : "";

// }


// /******************************************************
//  * RADIO VALUE
//  ******************************************************/

// function radioValue(name) {

//     const selected =
//         document.querySelector(
//             `input[name="${name}"]:checked`
//         );

//     return selected
//         ? selected.value
//         : "";

// }


// /******************************************************
//  * STATUS
//  ******************************************************/

// function setStatus(
//     message,
//     type
// ) {

//     statusBox.textContent =
//         message;

//     statusBox.className =
//         "status";

//     if (type) {

//         statusBox.classList.add(
//             type
//         );

//     }

// }


// function clearStatus() {

//     setStatus("", "");

// }


// /******************************************************
//  * INITIALIZATION
//  ******************************************************/

// document.addEventListener(
//     "DOMContentLoaded",
//     function () {

//         loadConfiguration();

//     }
// );