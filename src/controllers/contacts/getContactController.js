import { ContactModel } from "../../models/Contacts.js"

const getContactController = async (req, res) => {
    try {
        const contacts = await ContactModel.find()

        return res.status(200).json(contacts)

    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}

export default getContactController