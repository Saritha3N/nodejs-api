const orderData = require("../src/orderData");
const getOrders = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest)
        console.log("req.query")
        console.log(req.query)
        const query = req.query;
        orderData.getOdersByUser(listRequest, res, query);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getOrders
};