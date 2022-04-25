//before processing request un packing and validating request

const locationData = require('../src/locationData');

const countryList = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest)
        console.log("req.query")
        console.log(req.query)
        const query = req.query;
        locationData.getListOfCountryData(listRequest, res, query);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const stateList = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest)
        console.log("req.query")
        console.log(req.query)
        const query = req.query;
        locationData.getListOfStateData(listRequest, res, query);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const cityList = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest)
        console.log("req.query")
        console.log(req.query)
        const query = req.query;
        locationData.getListOfCityData(listRequest, res, query);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    countryList,
    stateList,
    cityList
};