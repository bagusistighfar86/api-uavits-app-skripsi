import multer from "multer"
import { ContactModel } from "../../models/Contacts.js"

const getContactController = async (req, res) => {
    const upload = multer()
    try {
        const contacts = await ContactModel.find()
        upload.single("file1")(req, res, function (err) {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: "File upload error" });
            }

            const { test, text } = req.body; // Access the string fields from req.body
            const file1 = req.file; // Access the uploaded file from req.file

            console.log(test, text);
            console.log(file1);

            return res.status(200).json(contacts);
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getContactController