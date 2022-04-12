const dataProcess = require('./dataProcess');
const db = require("../database/models");
var userInfo = {};
const getOdersByUser = async (listRequest, res) => {
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
                    // orderResponse[key].dataValues.user = userResponse;
                    var OrderItem = await dataProcess.find(db.OrderItem, { orderId: orderResponse[key].dataValues.id });
                    orderResponse[key].dataValues.item = await dataProcess.find(db.Item, { id: OrderItem.itemId });
                    var itemResponse = orderResponse[key].dataValues.item;
                    if (itemResponse) {
                        orderResponse[key].dataValues.item.store = await dataProcess.find(db.Store, { id: itemResponse.storeId });
                        delete orderResponse[key].dataValues.item.storeId;
                    }
                    if (key == orderResponse.length - 1) {
                        var dataResponse = {};
                        dataResponse.userInfo = userInfo;
                        dataResponse.orders = orderResponse
                        responseGenerate(200, {data : dataResponse}, res);
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

module.exports = {
    getOdersByUser
};