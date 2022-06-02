
async function insert(collection, data) {
    await collection.create(data).then(function (item) {
        return true;
    }).catch((err) => {
        console.log('err from insert to db');
        throw err;
    });
}
async function find(collection, query, exclude) {
    // console.log(query)
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
        console.log(collection);
        console.log(query);
        console.log('err from find from db');
        console.log(err);
    });
    return resp;
}
async function findAll(collection, query, exclude, reqQuery) {
    var excludeParams = ['createdAt', 'updatedAt'];
    if (exclude) {
        excludeParams = excludeParams.concat(exclude);
    }
    if (reqQuery && reqQuery.page) {
        console.log("with pagination");
        reqQuery.size = reqQuery.size ? reqQuery.size : 10;
        const { limit, offset } = getPagination(reqQuery.page - 1, reqQuery.size);
        const resp = await collection.findAll({
            where: query, limit, offset,
            attributes: { exclude: excludeParams }
        }).then((response) => {
            if (response.length > 0) {
                return response;
            } else {
                return null;
            }
        }).catch((err) => {
            console.log(collection);
            console.log(query);
            console.log('err from findall from db');
            console.log(err);
        });
        return resp;
    } else {
        const resp = await collection.findAll({
            where: query,
            attributes: { exclude: excludeParams }
        }).then((response) => {
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
}
const getPagination = (page, size) => {
    var limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};
module.exports = {
    insert,
    find,
    findAll
};