
async function insert(collection, data) {
    await collection.create(data).then(function (item) {
        return true;
    }).catch((err) => {
        console.log('err from insert to db');
        throw err;
    });
}
async function find(collection, query, exclude) {
    console.log(query)
    var excludeParams = ['createdAt', 'updatedAt'];
    if (exclude) {
        excludeParams = excludeParams.concat(exclude);
    }
    const resp = await collection.findOne({
        where: query,
        attributes: { exclude: excludeParams }
    }).then((response) => {
        if (response) {
            return response.dataValues;
        }
    }).catch((err) => {
        console.log('err from find from db');
        console.log(err);
    });
    return resp;
}
async function findAll(collection, query, exclude) {
    console.log(query)
    var excludeParams = ['createdAt', 'updatedAt'];
    if (exclude) {
        excludeParams = excludeParams.concat(exclude);
    }
    const resp = await collection.findAll({
        where: query,
        attributes: { exclude: excludeParams }
    }).then((response) => {
        // console.log(response)
        if (response.length > 0) {
            return response;
        } else {
            return null;
        }
    }).catch((err) => {
        console.log('err from find from db');
        console.log(err);
    });
    return resp;
}

module.exports = {
    insert,
    find,
    findAll
};