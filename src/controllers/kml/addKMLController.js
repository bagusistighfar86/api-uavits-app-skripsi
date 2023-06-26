import fs from "fs"
import xmldom from "xmldom";
import { kml as converter } from "@tmcw/togeojson";
import { KMLModel } from "../../models/KML.js";

const addKMLController = async (req, res) => {
    const DOMParser = xmldom.DOMParser;

    // const kmlFile = req.files['kml'][0]
    
    const kmlPath = req.kmlFile.path

    try {
        const parsedKML = new DOMParser().parseFromString(fs.readFileSync(kmlPath, "utf8"));
        const geojson = converter(parsedKML);
        const item = geojson.features

        let key
        let newArea = {}
        for (var i = 0; i < geojson.features.length; i++) {
            if (item[i].geometry) {
                if (item[i].geometry.type.toLowerCase() === "polygon") {
                    key = item[i]?.properties?.name || ""
                    newArea = {
                        name: item[i]?.properties?.name,
                        coordinates: item[i]?.geometry?.coordinates
                    }
                }
            }
        }

        const newKML = new KMLModel({
            key: key,
            flightId: "F000001",
            radius: 500,
            area: newArea,
        })

        await newKML.save()
    } catch (e) {
        res.status(500).json({ error: "Internal server error", detail: e.message })
    }
}

export default addKMLController