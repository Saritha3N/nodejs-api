const orderData = require("../src/orderData");
const getOrders = async (req, res) => {
    try {
        const listRequest = req.params;
        console.log(listRequest);
        orderData.getOdersByUser(listRequest,res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
module.exports = {
    getOrders
};