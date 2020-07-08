const firebaseAdmin = require("../config/firebase-admin-config");

const db = firebaseAdmin.firestore();

module.exports = async(req, res) => {
    try {
        // var data = await _getUserData(req.body);
        var data = req.body;
        console.log(data)
            //toggle the disbaled value that pass from frontend
        var disabled = data.disabled ? false : true;
        console.log(disabled)
        var userRecord = await firebaseAdmin.auth().updateUser(data.uid, {
            disabled: disabled
        });

        await db
            .collection("users")
            .doc(data.uid)
            .update({
                disabled: disabled
            });
        res.send({
            code: 200,
            data: userRecord.uid,
        });
    } catch (err) {
        console.log("Errors:", err);
        if (err) {
            res.send({
                code: 400,
                errors: err.errors,
            });
        } else {
            res.send({
                code: 400,
                errors: [err],
            });
        }
    }
};