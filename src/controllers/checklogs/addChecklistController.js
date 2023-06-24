import { ChecklistModel } from "../../models/Checklists.js"

const addChecklistController = async (req, res) => {
    try {
        const { detailChecklist, type, flightId, auth } = req.body
        
        const checklist = await ChecklistModel.findOne(
            {
                $and: [
                    { flightId: flightId },
                    { type: type }
                ]
            }
        )

        if (checklist) {
            return res.status(400).json({ error: "Flights & Checklist already registered" })
        }


        const newChecklist = new ChecklistModel({
            detailChecklist,
            type,
            flightId,
            auth
        })

        await newChecklist.save()
        return newChecklist
    } catch (e) {
        res.status(500).json({ e, error: "Internal server error" })
    }
}

export default addChecklistController