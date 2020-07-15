$(function() {

    const db = firebase.firestore();
    let dataTable = $('#userViewTable').DataTable({
        destroy: true,
        scrollX: true,
        searching: false,

    });
    //hide some columns
    dataTable.columns(1).visible(false);
    dataTable.columns(8).visible(false);

    $("#formAddUser").validate({
        rules: {
            txtFName: "required",
            txtLName: "required",
            txtEmail: {
                required: true,
                email: true
            },
            txtaddress: {
                required: true,
            },
            txtmobileNo: {
                required: true,
                minlength: 9,
            },
            password: {
                required: true,
                minlength: 6,
            },
            confirmPassword: {
                equalTo: "#password"
            },
        },
        messages: {
            txtFName: " Enter First Name",
            txtLName: " Enter Last Name",
            txtEmail: " Enter Valid Email Address!",
            txtaddress: " Enter Address",
            txtmobileNo: " Enter your Phone number",
            password: " Enter Password",
            confirmPassword: " Enter Confirm Password Same as Password",
            userRole: {
                required: "Please select an option from the list!",
            },
            userBloodGroup: {
                required: "Please select an option from the list!",
            },
        }
    });


    $('#formAddUser').ready(function() {
        $(document).on("click", "#btnRegister", () => {

            if ($("#formAddUser").valid()) {
                firebase.auth().createUserWithEmailAndPassword($("#txtEmail").val(), $("#password").val())
                    .then(

                        result => {
                            //check whether there is a user
                            try {
                                let user = result.user;

                                var fName = $("#txtFName").val();
                                var lName = $("#txtLName").val();
                                var email = $("#txtEmail").val();
                                var userRole = $("#userRole").val();
                                var address = '';
                                var bloodGroup = '';
                                var mobileNo = $("#txtmobileNo").val();;

                                db.collection(COLLECTION_USERS).doc(user.uid).set({
                                    uid: user.uid,
                                    firstName: fName,
                                    lastName: lName,
                                    email: email,
                                    address: address,
                                    bloodGroup: bloodGroup,
                                    mobileNo: mobileNo,
                                    userRole: userRole,
                                    disabled: false

                                })
                                alert("User is successfuly registred!");

                                $("#formAddUser").trigger("reset");
                            } catch (error) {

                                var errorMessage = error.message;
                                window.alert("Error:" + errorMessage);
                            }

                        }).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        window.alert("Error:" + errorMessage);
                    })
            }

        });

    });
    //clear once form is submitted
    $('#formAddUser').ready(function() {
        $(document).on("click", "#btnClear", () => {
            $("#formAddUser").trigger("reset");
        });
    });

    //call the function that that add data to the rows
    dataAdd();

    function dataAdd() {
        usersRef.onSnapshot(function(querySnapshot) {
            dataTable.clear().draw();
            let rowCount = 1;

            querySnapshot.forEach(function(doc) {
                let data = doc.data();
                let btnDisable;

                if (data.disabled) {
                    //To enable it again (disable = false)
                    btnDisable =
                        '<button id="uid"' +
                        data.uid +
                        '" type="button" class="btn btn-success btnDelete">Enable</button>';

                } else {
                    btnDisable =
                        '<button id=""' +
                        data.uid +
                        '" type="button" class="btn btn-danger btnDelete">Disable</button>';
                }

                dataTable.row.add(
                    [
                        rowCount++,
                        data.uid,
                        data.firstName + " " + data.lastName,
                        data.email,
                        data.userRole,
                        data.address,
                        data.bloodGroup,
                        data.mobileNo,
                        data.disabled,
                        '<div class="buttons" id="btn-group"  role="group">' + btnDisable + "</div>"
                    ]).draw();
            })
        });
    }


    $('#userViewTable tbody').on('click', '.btnDelete', function() {

        console.log("press");
        var data = dataTable.row($(this).parents('tr')).data();
        var uid = data[1];
        var disabled = data[8];

        let userData = {
            uid: uid,
            disabled: disabled

        };
        Swal.fire({
            title: "Are you sure?",
            text: "You can always change your mind later!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            allowOutsideClick: false
        }).then(result => {
            if (result.value) {
                $.ajax({
                    type: 'POST',
                    url: '/api/disabled',
                    data: JSON.stringify(userData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {
                        Swal.fire(
                            'User Updated!',
                            'Your file has been Updated.',
                            'success'
                        )
                    },
                    error: function() {
                        Swal.fire(
                            "User Updated!",
                            "The user updated failed!",
                            "error"
                        );
                        console.log('error');
                    }
                });
            }

        });
    });

});