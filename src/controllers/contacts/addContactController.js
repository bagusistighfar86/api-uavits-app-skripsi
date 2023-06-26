import { ContactModel } from "../../models/Contacts.js"

const addContactController = async (req, res) => {
    try {
        const { header, question, desc, icon, background, phoneNumber } = req.body
        const newContact = new ContactModel({
            header,
            question,
            desc,
            icon,
            background,
            phoneNumber
        })

        await newContact.save()

        res.status(200).json({ message: "Contact created successfully" })
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error",detail: e.message })
    }
}

export default addContactController