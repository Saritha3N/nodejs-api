const itemsData = require("../src/itemsData");
const getItems = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest);
        itemsData.getItemsByStore(listRequest,res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getItems
};