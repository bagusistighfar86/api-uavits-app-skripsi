import { ContactModel } from "../../models/Contacts.js"

const addContactController = async (req, res) => {
    const { header, question, desc, icon, background, phoneNumber } = req.body
    console.log(req.body)
    
    try {
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
        console.log(e)
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addContactController