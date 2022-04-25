const storeData = require("../src/storeDataByLocation");

const getStores = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest)
        console.log("req.query")
        console.log(req.query)
        const query = req.query;
        var requestedPath = req.url;
        if (requestedPath.indexOf("/city") > -1) {
            storeData.getListOfStoreByCity(listRequest, res, query);
        } else if (requestedPath.indexOf("/state") > -1) {
            storeData.getListOfStoreByState(listRequest, res, query);
        } else if (requestedPath.indexOf("/country") > -1) {
            storeData.getListOfStoreByCountry(listRequest, res, query);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getStores
};