$(function() {
    $("#formSignIn").validate({
        rules: {
            txtEmail: {
                required: true,
                email: true

            },
            txtPassword: {
                required: true,
                minlength: 6,
            }
        },
        messages: {
            txtEmail: " Enter Valid Email Address!",
            txtPassword: " Enter Password",
        }
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // window.location.href = window.location.origin + "/main/events";
            // user is sign-in
            db.collection(COLLECTION_USERS)
                .where("uid", "==", user.uid)
                .onSnapshot(
                    function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            let userData = doc.data();
                            var userRole = userData.userRole
                            if (userRole == 'Admin') {
                                window.location.href = window.location.origin + "/main/events";
                            } else {
                                Swal.fire(
                                    "You are not an vaild user!",
                                    "",
                                    "error"
                                );
                            }
                        });
                    },

                );

        }

    });

    $('#formSignIn').ready(function() {
        $(document).on("click", "#btnLogin", () => {
            var data = {
                email: $("#txtEmail").val(),
                password: $("#txtPassword").val()
            };
            if ($("#formSignIn").valid()) {
                // try {
                firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                    .then(result => {
                        let user = result.user;
                        db.collection(COLLECTION_USERS)
                            .where("uid", "==", user.uid)
                            .onSnapshot(
                                function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        let userData = doc.data();
                                        var userRole = userData.userRole
                                        if (userRole == 'Admin') {
                                            window.location.href = window.location.origin + "/main/events";
                                        } else {
                                            Swal.fire(
                                                "You are not an vaild user!",
                                                "",
                                                "error"
                                            );
                                        }
                                    });
                                },

                            );
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        Swal.fire(
                            "User login failed!",
                            errorMessage,
                            "error"
                        );
                    });
            }
        });

    });




});