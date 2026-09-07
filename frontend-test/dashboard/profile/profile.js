import api from "../../assets/js/api.js";
import { initLayout } from "../../assets/js/layout.js";


// =========================================
// INITIALIZE LAYOUT
// =========================================

initLayout({
    title: "Profile"
});


// =========================================
// PAGE LOAD
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();


    const updateProfileBtn =
        document.getElementById("updateProfileBtn");


    const changePasswordBtn =
        document.getElementById("changePasswordBtn");


    if (updateProfileBtn) {

        updateProfileBtn.addEventListener(
            "click",
            updateProfile
        );

    }


    if (changePasswordBtn) {

        changePasswordBtn.addEventListener(
            "click",
            changePassword
        );

    }

});


// =========================================
// LOAD PROFILE
// =========================================

async function loadProfile() {

    try {

        const response =
            await api.get("/profile/");


        console.log(
            "PROFILE API RESPONSE:",
            response
        );


        if (!response.success) {

            throw new Error(
                response.message ||
                "Unable to load profile"
            );

        }


        // =====================================
        // USER DATA
        // =====================================

        const user =
            response.user;


        // =====================================
        // COMPANY DATA
        // =====================================

        const company =
            response.company;


        if (!user) {

            console.error(
                "User data is missing from API response"
            );

            return;

        }


        // =====================================
        // FULL NAME
        // =====================================

        const fullName =
            user.full_name || "User";


        // =====================================
        // COMPANY NAME
        // =====================================

        const companyName =
            company?.company_name ||
            "Company Name";


        console.log(
            "FULL NAME:",
            fullName
        );


        console.log(
            "COMPANY NAME:",
            companyName
        );


        // =====================================
        // PROFILE CARD
        // =====================================

        const profileName =
            document.getElementById(
                "profileName"
            );


        const profileRole =
            document.getElementById(
                "profileRole"
            );


        const profileCompanyName =
            document.getElementById(
                "profileCompanyName"
            );


        const avatar =
            document.getElementById(
                "avatar"
            );


        // User name
        if (profileName) {

            profileName.textContent =
                fullName;

        }


        // profileRole = COMPANY NAME
        if (profileRole) {

            profileRole.textContent =
                companyName;

        }


        // Company information
        if (profileCompanyName) {

            profileCompanyName.textContent =
                companyName;

        }


        // Avatar
        if (avatar) {

            avatar.textContent =
                fullName
                    .charAt(0)
                    .toUpperCase();

        }


        // =====================================
        // FORM FIELDS
        // =====================================

        const fullNameInput =
            document.getElementById(
                "fullName"
            );


        const companyNameInput =
            document.getElementById(
                "companyName"
            );


        const emailInput =
            document.getElementById(
                "email"
            );


        // Full Name
        if (fullNameInput) {

            fullNameInput.value =
                fullName;

        }


        // Company Name
        if (companyNameInput) {

            companyNameInput.value =
                companyName;

        }


        // Email
        if (emailInput) {

            emailInput.value =
                user.email || "";

        }


        // =====================================
        // HEADER
        // =====================================

        const headerUserName =
            document.getElementById(
                "headerUserName"
            );


        const headerCompanyName =
            document.getElementById(
                "headerCompanyName"
            );


        if (headerUserName) {

            headerUserName.textContent =
                fullName;

        }


        if (headerCompanyName) {

            headerCompanyName.textContent =
                companyName;

        }

    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}


// =========================================
// UPDATE PROFILE
// =========================================

async function updateProfile() {

    try {

        const fullName =
            document.getElementById(
                "fullName"
            )?.value.trim();


        const email =
            document.getElementById(
                "email"
            )?.value.trim();


        if (!fullName) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        const response =
            await api.put(
                "/profile/",
                {
                    full_name: fullName,
                    email: email
                }
            );


        console.log(
            "UPDATE RESPONSE:",
            response
        );


        if (!response.success) {

            throw new Error(
                response.message ||
                "Unable to update profile"
            );

        }


        alert(
            response.message ||
            "Profile updated successfully."
        );


        // Reload data
        await loadProfile();

    }

    catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        alert(
            error.message ||
            "Unable to update profile."
        );

    }

}


// =========================================
// CHANGE PASSWORD
// =========================================

async function changePassword() {

    alert(
        "Password change API is not available in the Flask profile route yet."
    );

}