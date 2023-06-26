import fs from "fs"
import xmldom from "xmldom";
import { kml as converter } from "@tmcw/togeojson";
import { KMLModel } from "../../models/KML.js";

const addKMLController = async (req, res) => {
    let response = {
        code: "",
        message: "",
        data: {},
    }
    try {

        const DOMParser = xmldom.DOMParser;
    
        // const kmlFile = req.files['kml'][0]
        
        const kmlPath = req.kmlFile.path
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
        response.code = 500
        response.message = e.message
        response.data = {}
        return res.status(500).json(response)
    }
}

export default addKMLController