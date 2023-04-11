const MAX_LIMIT = 50;

module.exports = async (req, res, next) => {
    try {
        const {query: {limit, offset}}= req;

        req.pagination = {
            limit: !limit || limit <= 0 || limit > MAX_LIMIT ? MAX_LIMIT : limit,
            offset: !offset || offset <= 0 ? 0 : offset
        }

        next();
        
    } catch (err) {
        next(err);
    }
}