const itemsData = require("../src/itemsData");
const getItems = async (req, res) => {
    try {
        const listRequest = req.params;
        //console.log(listRequest)
        //console.log("req.query")
        //console.log(req.query)
        const query = req.query;
        itemsData.getItemsByStore(listRequest, res, query);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getItems
};