define([
    "../lib/rest-utility",
    "../configuration/sma_config",
    "N/https"
], (rest, cfg, https) => {

    /**
     * API module for interacting with SMA Users endpoint
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     *
     * @see https://connect.smapply.io/pages/resources.html#users
     */
    let exports = {};

    /**
     * Send the List Users request to SMA
     *
     * @gov 12
     *
     * @param {Object} query - Key-pairs for request URL parameters
     *
     * @returns {Object} body of the SMA response
     *
     * @throws {Error} if the request does not return a 200 OK
     *
     * @see https://connect.smapply.io/pages/resources.html#get--api-users-
     *
     * @example
     * try {
     *     let response = users.list({role:1});
     *     // Yey!
     *     console.log(response);
     * } catch (e) {
     *     // Uhoh :(
     *     console.error(e);
     * }
     */
    function list(query) {
        let config = cfg.read();
        let request = {
            url: rest.generatePath({resource: "users", query}),
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + config.accessToken
            }
        };

        let response = https.get(request);

        if (response.code !== 200) {
            throw response;
        }

        return JSON.parse(response.body);
    }

    /**
     * Send the Get User request to SMA
     *
     * @gov 12
     *
     * @param {number} id - SMA ID of the User to retrieve
     *
     * @returns {ClientResponse} the HTTP response
     *
     * @throws {Error} if the request does not return a 200 OK
     *
     * @see https://connect.smapply.io/pages/resources.html#get--users-id
     *
     * @example
     * try {
     *     let response = users.get(12345);
     *     // Yey!
     *     console.log(response);
     * } catch (e) {
     *     // Uhoh :(
     *     console.error(e);
     * }
     */
    function get(id) {
        let config = cfg.read();
        let request = {
            url: rest.generatePath({resource: "users", id}),
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + config.accessToken
            }
        };

        let response = https.get(request);

        if (response.code !== 200) {
            throw response;
        }

        return JSON.parse(response.body);
    }

    exports = {get, list};
    return exports;
});
