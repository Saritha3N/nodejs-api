const lib = require('./config/config');
const dataProcess = require('./dataProcess');
const db = require("../database/models");

const getListOfCountryData = async (listRequest, res) => {
    var response = {};
    try {
        if (Object.keys(listRequest).length === 0) {
            response = await dataProcess.findAll(db.Country, listRequest);
        } else {
            response = await dataProcess.find(db.Country, listRequest);
        }
        if (response) {
            responseGenerate('200', { data: response }, res);
        } else {
            responseGenerate('200', "Not found", res);
        }
    } catch (error) {
        console.log(error);
        res.statusCode = 404;
        res.send("Failed to get country request");
    }
};

const getListOfStateData = async (listRequest, res) => {
    try {
        //all states list
        if (Object.keys(listRequest).length === 0) {
            try {
                const stateResponse = await dataProcess.findAll(db.States, listRequest);
                for (var key in stateResponse) {
                    stateResponse[key].dataValues.country = await dataProcess.findAll(db.Country,
                        { id: stateResponse[key].dataValues.countryId });
                    delete stateResponse[key].dataValues.countryId;
                }
                res.statusCode = 200;
                res.send({ data: stateResponse });
            } catch (error) {
                res.statusCode = 404;
                res.send("Failed to get states");
            }
        } else {
            //query by country id or name
            var query = {};
            var exclude = [];
            if (listRequest.country != undefined) {
                query.name = listRequest.country;
                exclude = ['countryId']
            }
            if (listRequest.country_id != undefined) {
                query.id = listRequest.country_id;
                exclude = ['countryId']
            }
            const response = await dataProcess.find(db.Country, query);
            if (response && response.id) {
                try {
                    const stateQuery = { countryId: response.id };
                    const stateResponse = await dataProcess.findAll(db.States, stateQuery, exclude);
                    for (var key in stateResponse) {
                        stateResponse[key].dataValues.country = response;
                    }
                    if (stateResponse) {
                        res.statusCode = 200;
                        res.send({ data: stateResponse });
                    } else {
                        res.statusCode = 200;
                        res.send("No states found");
                    }
                } catch (error) {
                    res.statusCode = 404;
                    res.send("Failed to get state");
                }
            } else {
                res.statusCode = 404;
                res.send("Failed to get given country");
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const getListOfCityData = async (listRequest, res) => {
    try {
        //all city list
        if (Object.keys(listRequest).length === 0) {
            try {
                const cityResponse = await dataProcess.findAll(db.Cities, listRequest);
                for (var key in cityResponse) {
                    if (cityResponse[key].dataValues.stateId) {
                        var stateResponse = await dataProcess.find(db.States, { id: cityResponse[key].dataValues.stateId });
                        cityResponse[key].dataValues.state = stateResponse;
                        delete cityResponse[key].dataValues.stateId;
                        if (stateResponse.countryId) {
                            cityResponse[key].dataValues.state.country = await dataProcess.find(db.Country,
                                { id: stateResponse.countryId });
                        }
                        delete stateResponse.countryId;
                    }
                }
                if (cityResponse) {
                    res.statusCode = 200;
                    res.send({ data: cityResponse });
                } else {
                    res.statusCode = 200;
                    res.send("No city response found");
                }
            } catch (error) {
                res.statusCode = 404;
                res.send("Failed to get city");
            }
        } else {
            var queryByState = {};
            var queryByCountry = {};
            if (listRequest.state != undefined) {
                queryByState.name = listRequest.state;
            }
            if (listRequest.state_id != undefined) {
                queryByState.id = listRequest.state_id;
            }
            if (listRequest.country != undefined) {
                queryByCountry.name = listRequest.country;
            }
            if (listRequest.country_id != undefined) {
                queryByCountry.id = listRequest.country_id;
            }
            var response = {};
            if (Object.keys(queryByCountry).length != 0 && Object.keys(queryByState).length != 0) {              // query by country and state
                var countryResponse = await dataProcess.find(db.Country, queryByCountry);
                if (countryResponse && countryResponse.id) {
                    queryByState.countryId = countryResponse.id;
                    const stateResponse = await dataProcess.findAll(db.States, queryByState);
                    var cityResponse = [];
                    if (stateResponse) {
                        for (var key in stateResponse) {
                            if (stateResponse[key].id) {
                                try {
                                    const cityQuery = { stateId: stateResponse[key].id };
                                    const oneStateCityResponse = await dataProcess.findAll(db.Cities, cityQuery);
                                    if (oneStateCityResponse) {
                                        // for loop for to add state and country object in city list
                                        for (key1 in oneStateCityResponse) {
                                            delete oneStateCityResponse[key1].dataValues.stateId;
                                            oneStateCityResponse[key1].dataValues.state = {};
                                            oneStateCityResponse[key1].dataValues.state = stateResponse[key].dataValues;
                                            delete oneStateCityResponse[key1].dataValues.state.countryId;
                                            oneStateCityResponse[key1].dataValues.state.country = countryResponse;
                                        }
                                        cityResponse = cityResponse.concat(oneStateCityResponse);
                                    }
                                    if (key == Object.keys(stateResponse)[Object.keys(stateResponse).length - 1]) {
                                        if (cityResponse) {
                                            res.statusCode = 200;
                                            res.send({ data: cityResponse });
                                        } else {
                                            res.statusCode = 200;
                                            res.send("No cities stored for this state");
                                        }
                                    }
                                } catch (error) {
                                    res.statusCode = 404;
                                    res.send("Failed to get city");
                                }
                            } else {
                                res.statusCode = 404;
                                res.send("Failed to get city by state");
                            }
                        }
                    } else {
                        res.statusCode = 404;
                        res.send("Failed to get city by state in given country");
                    }
                } else {
                    res.statusCode = 404;
                    res.send("Failed to get city by country");
                }

            } else if (Object.keys(queryByState).length != 0) {                // query by state id and name
                response = await dataProcess.find(db.States, queryByState);
                if (response && response.id) {
                    try {
                        const cityQuery = { stateId: response.id };
                        const cityResponse = await dataProcess.findAll(db.Cities, cityQuery);
                        // for loop for to add state and country object in city list
                        for (key in cityResponse) {
                            delete cityResponse[key].dataValues.stateId;
                            cityResponse[key].dataValues.state = response;
                            cityResponse[key].dataValues.state.country = await dataProcess.find(db.Country,
                                { id: response.countryId });
                        }
                        if (cityResponse) {
                            res.statusCode = 200;
                            res.send({ data: cityResponse });
                        } else {
                            res.statusCode = 200;
                            res.send("No cities stored for this state");
                        }
                    } catch (error) {
                        res.statusCode = 404;
                        res.send("Failed to get city");
                    }
                } else {
                    res.statusCode = 404;
                    res.send("Failed to get city by state");
                }
            } else if (Object.keys(queryByCountry).length != 0) {                // query by country id and name
                var countryResponse = await dataProcess.find(db.Country, queryByCountry);
                if (countryResponse && countryResponse.id) {
                    const stateResponse = await dataProcess.findAll(db.States, { countryId: countryResponse.id });
                    var cityResponse = [];
                    for (var key in stateResponse) {
                        if (stateResponse[key].id) {
                            try {
                                const cityQuery = { stateId: stateResponse[key].id };
                                const oneStateCityResponse = await dataProcess.findAll(db.Cities, cityQuery);
                                if (oneStateCityResponse) {
                                    // for loop for to add state and country object in city list
                                    for (key1 in oneStateCityResponse) {
                                        delete oneStateCityResponse[key1].dataValues.stateId;
                                        oneStateCityResponse[key1].dataValues.state = {};
                                        oneStateCityResponse[key1].dataValues.state = stateResponse[key].dataValues;
                                        delete oneStateCityResponse[key1].dataValues.state.countryId;
                                        oneStateCityResponse[key1].dataValues.state.country = countryResponse;
                                    }
                                    cityResponse = cityResponse.concat(oneStateCityResponse)
                                }
                                if (key == Object.keys(stateResponse)[Object.keys(stateResponse).length - 1]) {
                                    if (cityResponse) {
                                        res.statusCode = 200;
                                        res.send({ data: cityResponse });
                                    } else {
                                        res.statusCode = 200;
                                        res.send("No cities stored for this state");
                                    }
                                }
                            } catch (error) {
                                res.statusCode = 404;
                                res.send("Failed to get city");
                            }
                        } else {
                            res.statusCode = 404;
                            res.send("Failed to get city by state");
                        }
                    }
                } else {
                    res.statusCode = 404;
                    res.send("Failed to get city by country");
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

/*
const getListOfStateData = async (listRequest, res) => {
    var stateList = [];
    try {
        const response = await dataProcess.findAll(db.States, listRequest);
        if (response && response.length > 0) {
            for (var key in response) {
                const countryQuery = { id: response[key].dataValues.countryId };
                (async () => {
                    try {
                        const countryResponse = await dataProcess.find(db.Country, countryQuery);
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
        const response = await dataProcess.findAll(db.Cities, listRequest);
        if (response) {
            for (var key in response) {
                var stateQuery = { id: response[key].dataValues.stateId };
                (async () => {
                    const stateResponse = await dataProcess.findAll(db.States, stateQuery);
                    if (stateResponse) {
                        for (var key2 in stateResponse) {
                            var countryQuery = { id: stateResponse[key2].dataValues.countryId };
                            (async () => {
                                var countryResponse = await dataProcess.findAll(db.Country, countryQuery);
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
};*/
const responseGenerate = (code, msg, res) => {
    res.statusCode = code;
    res.send(msg);
}


module.exports = {
    getListOfCountryData,
    getListOfStateData,
    getListOfCityData
};