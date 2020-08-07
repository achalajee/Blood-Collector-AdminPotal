$(function () {
   $("#btnLogout").click(function () {
      console.log("btn clicked!!!");
      $(this).prop("disabled", true);
      // add spinner to button
      $(this).html(
         `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> login out...`
      );
      firebase
         .auth()
         .signOut()
         .then((result) => {
            window.location.href = BASE_URL;
         })
         .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Error:" + errorMessage);
         });
   });
});
