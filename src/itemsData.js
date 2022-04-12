const dataProcess = require('./dataProcess');
const db = require("../database/models");

const getItemsByStore = async (listRequest, res) => {
    try {

        var query = {};
        if (listRequest.store != undefined) {
            query = { title: listRequest.store };
        } else if (listRequest.id != undefined) {
            query = { id: listRequest.id };
        }
        var storeResponse = await dataProcess.find(db.Store, query);
        if (storeResponse) {
            var itemQuery = { storeId: storeResponse.id };
            var itemResponse = await dataProcess.findAll(db.Item, itemQuery, ['storeId']);
            if (itemResponse)
                responseGenerate(200, { data: itemResponse }, res);
            else
                responseGenerate(200, "No items in given store !", res);

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

module.exports = {
    getItemsByStore
};