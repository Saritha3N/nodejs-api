const dataProcess = require('./dataProcess');
const db = require("../database/models");

const getItemsByStore = async (listRequest, res, reqQuery) => {
    try {
        var query = {};
        if (listRequest.store != undefined) {
            query = { title: listRequest.store };
        } else if (listRequest.id != undefined) {
            query = { id: listRequest.id };
        } else {
            //listAllItems(listRequest, res, reqQuery);
            var TempItemResponse = await dataProcess.findAll(db.Item, {});
            if (TempItemResponse) {
                generatePaginatedResponse(reqQuery, TempItemResponse, res, "");
                return;
            }
            else {
                responseGenerate(200, "No items in given store !", res);
                return;
            }
        }
        var storeResponse = await dataProcess.find(db.Store, query);
        if (storeResponse) {
            try {
                var storeItemQuery = { storeId: storeResponse.id };
                var storeItemResponse = await dataProcess.findAll(db.storeItem, storeItemQuery);
                if (storeItemResponse) {
                    var itemResponse = [];
                    for (var key in storeItemResponse) {
                        var itemQuery = { id: storeItemResponse[key].dataValues.itemId };
                        var TempItemResponse = await dataProcess.findAll(db.Item, itemQuery);
                        if (TempItemResponse) {
                            itemResponse = itemResponse.concat(TempItemResponse);
                        }
                        if (key == storeItemResponse.length - 1) {
                            if (itemResponse) {
                                generatePaginatedResponse(reqQuery, itemResponse, res, "no data in this page");
                            }
                            else
                                responseGenerate(200, "No items in given store !", res);
                        }
                    }
                } else {
                    responseGenerate(200, "No Items Found In Given Store !", res);
                }
            } catch (err) {
                responseGenerate(200, "Failed to get items !", res);
            }
        } else {
            responseGenerate(200, "No such store exist !", res);
        }
    } catch (error) {
        responseGenerate(404, "Failed to get items !", res);
    }
};

const responseGenerate = (code, data, res) => {
    res.statusCode = code;
    res.send(data);
}

const generatePaginatedResponse = (reqQuery, response, res, errorMessage) => {

    var page = reqQuery.page ? reqQuery.page : 1;
    var size = reqQuery.size ? reqQuery.size : 10;
    var paginatedReponse = [];
    for (var key = (size * (page - 1)); key < (size * page); key++) {
        if (response[key])
            paginatedReponse.push(response[key]);
    }
    if (paginatedReponse.length > 0) {
        responseGenerate(200, { data: paginatedReponse }, res);
    } else if (paginatedReponse.length == 0) {
        responseGenerate(200, errorMessage, res);
    }
}
module.exports = {
    getItemsByStore
};