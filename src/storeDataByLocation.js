
const dataProcess = require('./dataProcess');
const db = require("../database/models");

const getListOfStoreByCity = async (listRequest, res) => {
    try {
        var query = {};
        if (listRequest.city != undefined) {
            query = { name: listRequest.city };
        } else if (listRequest.id != undefined) {
            query = { id: listRequest.id };
        }
        var cityResponse = await dataProcess.find(db.Cities, query);
        if (cityResponse) {
            var storeQuery = { cityId: cityResponse.id };
            try {
                storeResponse = await dataProcess.findAll(db.Store, storeQuery);
                getAndDefineStoreResponse(storeResponse, cityResponse, res, 'city');
            } catch (err) {
                responseGenerate(404, "Failed to get requested store", res);
            }
        } else {
            responseGenerate('404', "No such cities Found!", res);
        }
    } catch (error) {
        responseGenerate(404, "Failed to get requested city", res);
    }
};
const getAndDefineStoreResponse = async (storeResponse, cityResponse, res, callFrom) => {
    if (storeResponse) {
        for (var key in storeResponse) {
            storeResponse[key].dataValues.city = cityResponse;//add city data in store
            delete storeResponse[key].dataValues.cityId;
            if (callFrom == 'city') {
                console.log("cityyyyyyyy");
                try {
                    storeResponse[key].dataValues.city.state = await dataProcess.find(db.States, { id: cityResponse.stateId });//add state data in store
                    storeResponse[key].dataValues.city.state.country = await dataProcess.find(db.Country,
                        { id: storeResponse[key].dataValues.city.state.countryId },
                        ['dial_code']);//add country data in store
                    console.log(cityResponse)
                    delete cityResponse.stateId;
                    delete cityResponse.state.countryId;
                } catch (error) {

                }
            }
            try {
                var userQuery = { uid: storeResponse[key].dataValues.userUid };
                var userResponse = await dataProcess.find(db.User, userQuery);
                storeResponse[key].dataValues.user = userResponse;//add user data in store
                delete storeResponse[key].dataValues.userUid;
                delete userResponse.password;
                if (key == storeResponse.length - 1 && (callFrom == 'state' || callFrom == 'country')) {
                    return storeResponse;
                } else if (key == storeResponse.length - 1) {
                    responseGenerate(200, { data: storeResponse }, res);
                }
            } catch (error) {
                responseGenerate(404, "Failed to get user details", res);
            }
        }
    } else {
        responseGenerate(202, "No stores in given city", res);
    }
};
const getListOfStoreByState = async (listRequest, res) => {
    try {
        var query = {};
        if (listRequest.state != undefined) {
            query = { name: listRequest.state };
        } else if (listRequest.id != undefined) {
            query = { id: listRequest.id };
        }
        var stateResponse = await dataProcess.find(db.States, query);
        if (stateResponse) {
            try {
                var cityResponse = await dataProcess.findAll(db.Cities, { stateId: stateResponse.id });
                if (cityResponse) {
                    getStoreDataUsingCityResponse(cityResponse, stateResponse, res, 'state');
                }
            } catch (error) {
                responseGenerate(404, "No such states found!", res);
            }
        } else {
            responseGenerate('404', "Failed to get country request, incomplete result", res);
        }
    } catch (error) {
        responseGenerate(404, "Failed to get requested city", res);
    }
};


const getListOfStoreByCountry = async (listRequest, res) => {
    try {
        var query = {};
        if (listRequest.country != undefined) {
            query = { name: listRequest.country };
        } else if (listRequest.id != undefined) {
            query = { id: listRequest.id };
        }
        var countryResponse = await dataProcess.find(db.Country, query, ['dial_code']);
        if (countryResponse) {
            var stateQuery = { countryId: countryResponse.id };
            var stateResponse = await dataProcess.findAll(db.States, stateQuery);
            var storeResponse = []
            if (stateResponse) {
                for (var key in stateResponse) {
                    try {
                        var cityQuery = {
                            stateId: stateResponse[key].dataValues.id
                        }
                        var cityResponse = await dataProcess.findAll(db.Cities, cityQuery);
                        if (cityResponse) {
                            oneStateStoreResponse = await getStoreDataUsingCityResponse(cityResponse, stateResponse[key].dataValues, res, 'country', countryResponse);
                            if (oneStateStoreResponse)
                                storeResponse = storeResponse.concat(oneStateStoreResponse);
                        }
                        if (key == stateResponse.length - 1) {
                            if (storeResponse) {
                                responseGenerate(200, { data: storeResponse }, res);
                            } else {
                                responseGenerate(200, "Not Exist Any Store In Selected Country", res);
                            }
                        }
                    } catch (error) {
                        responseGenerate(404, "Error in find state", res);
                    }
                }
            } else {
                responseGenerate(404, "No states in given country", res);
            }
        } else {
            responseGenerate(404, "No stores in given country", res);
        }
    } catch (error) {
        responseGenerate(404, "Failed to get requested city", res);
    }
};


const getStoreDataUsingCityResponse = async (cityResponse, stateResponse, res, callFrom, countryResponse) => {
    var storeResponse = [];
    for (var key in cityResponse) {
        var storeQuery = { cityId: cityResponse[key].id };
        try {
            var oneCityStoreResponse = await dataProcess.findAll(db.Store, storeQuery);
            if (oneCityStoreResponse) {
                if (callFrom == 'state') {
                    delete cityResponse[key].dataValues.stateId;
                    cityResponse[key].dataValues.state = stateResponse;
                    stateResponse.country = await dataProcess.find(db.Country, { id: stateResponse.countryId }, ['dial_code']);//add country data in store
                }
                else {
                    delete cityResponse[key].dataValues.stateId;
                    cityResponse[key].dataValues.state = stateResponse;
                    stateResponse.country = countryResponse;//add country data in store
                    delete stateResponse.countryId;

                }
                oneCityStoreResponse = await getAndDefineStoreResponse(oneCityStoreResponse, cityResponse[key], res, callFrom);
                storeResponse = storeResponse.concat(oneCityStoreResponse);
            }
            if (key == cityResponse.length - 1) {
                if (storeResponse && callFrom == 'country') {
                    return storeResponse;
                } else if (storeResponse && callFrom == 'state') {
                    responseGenerate(200, { data: storeResponse }, res);
                } else {
                    responseGenerate(202, "No store in given state", res);
                }
            }
        } catch (err) {
            responseGenerate(404, "Failed to get requested store", res);
        }
    }

};
const responseGenerate = (code, data, res) => {
    res.statusCode = code;
    res.send(data);
}
module.exports = {
    getListOfStoreByCity,
    getListOfStoreByState,
    getListOfStoreByCountry
};