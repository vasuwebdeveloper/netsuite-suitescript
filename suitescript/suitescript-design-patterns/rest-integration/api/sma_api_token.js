define([
    "../lib/moment.min",
    "../sma_enum",
    "../configuration/sma_config",
    "N/error",
    "N/https",
    "N/record"
],

(moment, enums, cfg, err, https, r) => {

    /**
     * HTTP request for refreshing SMA API token
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     */
    let exports = {};

    const RefreshUrl = `${enums.Api.BaseUrl}/o/token/`;

    /**
     * Send the Refresh Token request to SMA
     *
     * @gov 14
     *
     * @see https://connect.smapply.io/pages/authentication.html#refreshing-a-token
     */
    function refresh() {
        let params = cfg.read();
        let request = {
            url: RefreshUrl,
            headers: {
                "accept": "application/json"
            },
            body: {
                "grant_type": "refresh_token",
                "client_id": params.clientId,
                "client_secret": params.clientSecret,
                "refresh_token": params.refreshToken
            }
        };

        process(https.post(request));
    }

    /**
     * Processes the Refresh Token response
     *
     * @gov 2
     *
     * @param response {ClientResponse} HTTP response object
     *
     * @private
     */
    function process(response) {
        if (response.code != 200) {
            throw err.create({
                name: "SMA_INVALID_REQUEST",
                message: "Refresh token request failed"
            });
        }

        update(JSON.parse(response.body));
    }

    /**
     * Updates the Token data on the SMA Configuration record after a refresh
     *
     * @gov 2
     *
	 * @param {Object} data
	 * @param {string} data.access_token - New Access Token value
	 * @param {string} data.refresh_token - New Refresh Token value
	 *
     * @private
     */
	function update(data) {
		let values = {
            [enums.ConfigurationFields.AccessToken]: data.access_token,
            [enums.ConfigurationFields.RefreshToken]: data.refresh_token
        };

        r.submitFields({
            type: enums.RecordType.Configuration,
            id: 1,
            values: values
        });
	}

    /**
     * Validates the current API token and refreshes if necessary.
     *
     * SMA Tokens expire every two hours.
     *
     * @gov 15
     */
    function validate() {
        let lastUpdated = moment.utc(cfg.lastUpdated());
        let diff = moment.utc().diff(lastUpdated, "hours", true);
        if (!lastUpdated.isValid() || diff > 1.75) {
            refresh();
        }
    }

    exports = {refresh, validate};
    return exports;
});
