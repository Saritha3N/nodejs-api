const dataProcess = require('./dataProcess');
const db = require("../database/models");
var userInfo = {};
const getOdersByUser = async (listRequest, res, reqQuery) => {
    try {
        var query = {};
        if (listRequest.user != undefined) {
            query = { name: listRequest.user };
        } else if (listRequest.id != undefined) {
            query = { uid: listRequest.id };
        }
        var userResponse = await dataProcess.find(db.User, query, ['password']);
        userInfo = userResponse;
        if (userResponse) {
            var orderQuery = { userUid: userResponse.uid };
            var orderResponse = await dataProcess.findAll(db.Order, orderQuery, ['userUid']);
            if (orderResponse) {
                for (var key in orderResponse) {
                    var OrderItem = await dataProcess.find(db.OrderItem, { orderId: orderResponse[key].dataValues.id });
                    orderResponse[key].dataValues.item = await dataProcess.find(db.Item, { id: OrderItem.itemId });
                    var itemResponse = orderResponse[key].dataValues.item;
                    if (itemResponse) {
                        var storeItem = await dataProcess.find(db.storeItem, { itemId: itemResponse.id });
                        orderResponse[key].dataValues.item.store = await dataProcess.find(db.Store, { id: storeItem.storeId });
                    }
                    if (key == orderResponse.length - 1) {
                        var dataResponse = {};
                        dataResponse.userInfo = userInfo;
                        dataResponse.orders = orderResponse;
                        generatePaginatedResponse(reqQuery, orderResponse, res, "no data in this page");
                    }
                }
            }
            else
                responseGenerate(200, "No orders done by given user", res);

        } else {
            responseGenerate(200, "No such user exist !", res);
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
    getOdersByUser
};