//before processing request un packing and validating request

const locationData = require('../src/locationData');

const countryList = async (req, res) => {
    try {
        const listRequest = req.query;
        console.log(listRequest)
        locationData.getListOfCountryData(listRequest, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const stateList = async (req, res) => {
    try {
        const listRequest = req.query;
        console.log(listRequest)
        locationData.getListOfStateData(listRequest, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const cityList = async (req, res) => {
    try {
        const listRequest = req.query;
        console.log(listRequest)
        locationData.getListOfCityData(listRequest, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    countryList ,
    stateList ,
    cityList
};