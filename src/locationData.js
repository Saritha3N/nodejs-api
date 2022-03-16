const lib = require('./config/config');
const user = require('./dataProcess');
const db = require("../database/models");

const getListOfCountryData = async (listRequest, res) => {
    try {
        const response = await user.find(db.Country, listRequest);
        if(response) {
            responseGenerate('200', response, res);
        } else {
            responseGenerate('404', "Failed to get country request, incomplete result", res);
        }
    } catch (error) {
        console.log(error);
        res.statusCode = 404;
        res.send("Failed to get country request");
    }
};

const getListOfStateData = async (listRequest, res) => {
    var stateList = [];
    try {
        const response = await user.findAll(db.States, listRequest);
        if (response && response.length > 0) {
            for (var key in response) {
                const countryQuery = { id: response[key].dataValues.countryId };
                (async () => {
                    try {
                        const countryResponse = await user.find(db.Country, countryQuery);
                        if (countryResponse) {
                            var mergedStateAndCountryResult = response[key].dataValues;
                            mergedStateAndCountryResult.country = countryResponse;
                            stateList.push(mergedStateAndCountryResult);

                            if (response.length == stateList.length) {
                                res.statusCode = 200;
                                res.send(stateList);
                            } else {
                                responseGenerate('404', "Incomplete result", res);
                            }
                        }
                    } catch (err) {
                        console.log(err);
                        responseGenerate('404', "Failed to get country request, incomplete result", res);
                    }
                })();
            }
        } else {
            responseGenerate('404', "No such state exist !", res);
        }
    } catch (error) {
        console.log(error);
        responseGenerate('404', "Failed to get country request", res);
    }
};


const getListOfCityData = async (listRequest, res) => {
    var cityList = [];
    try {
        const response = await user.findAll(db.Cities, listRequest);
        if (response) {
            for (var key in response) {
                var stateQuery = { id: response[key].dataValues.stateId };
                (async () => {
                    const stateResponse = await user.findAll(db.States, stateQuery);
                    if (stateResponse) {
                        for (var key2 in stateResponse) {
                            var countryQuery = { id: stateResponse[key2].dataValues.countryId };
                            (async () => {
                                var countryResponse = await user.findAll(db.Country, countryQuery);
                                if (countryResponse) {
                                    var mergedStateAndCountryResult = stateResponse[key2].dataValues;
                                    mergedStateAndCountryResult.country = countryResponse;
                                    var mergedCityAndStateResult = response[key].dataValues;
                                    mergedCityAndStateResult.state = mergedStateAndCountryResult;
                                    cityList.push(mergedCityAndStateResult);
                                    if (response.length == cityList.length) {
                                        res.statusCode = 200;
                                        res.send(cityList);
                                    } else {
                                        responseGenerate('404', "Incomplete result", res);
                                    }

                                } else {                                    
                                    responseGenerate('404', "Incomplete result, Failed to fetch country of city", res);
                                }
                            })();
                        }
                    } else {                        
                        responseGenerate('404', "Incomplete result,Failed to fetch state of City", res);
                    }

                })();

            }
        } else {
            responseGenerate('404', "Failed to fetch  City", res);
        }
    } catch (error) {
        console.log(error);
        res.statusCode = 404;
        res.send("Failed to get country request");
    }
};
const responseGenerate = (code, msg, res) => {
    res.statusCode = code;
    res.send(msg);
}
/*
const getListOfStateData = async (listRequest, res) => {
    try {
        const query = { name: listRequest.country };
        console.log(query)
        const response = await user.find(db.Country, query);
        console.log(response)
        if (response && response.id) {
            try {
                const stateQuery = { countryId: response.id , name : listRequest.state };
                const stateResponse = await user.find(db.States, stateQuery);
                stateResponse.country = response.name;
                res.statusCode = 200;
                res.send(stateResponse);
            } catch (error) {
                res.statusCode = 404;
                res.send("Failed to get given state");
            }
        } else {
            res.statusCode = 404;
            res.send("Failed to get given country");
        }
    } catch (error) {
        console.log(error);
    }
};*/

module.exports = {
    getListOfCountryData,
    getListOfStateData,
    getListOfCityData
};