/**
 * 拓展请求上下文
 * @type {{basicModel: any}}
 */
module.exports = {
    get basicModel() {
        return this.app.basicModel;
    },
};
