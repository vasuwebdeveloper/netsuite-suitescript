define([
	"../sma_enum",
	"N/format",
	"N/record",
	"N/search"
], (enums, f, r, s) => {

    /**
     * Common methods for interacting with SMA Configuration records
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     */
    let exports = {};

    /**
     * Read the configuration record
     *
     * @gov 2
     *
     * @returns {Object} data
     * @returns {string} data.accessToken
     * @returns {string} data.clientId
     * @returns {string} data.clientSecret
     * @returns {string} data.refreshToken
     */
    function read() {
		let rec = r.load({type: enums.RecordType.Configuration, id: 1});
		return {
			accessToken: rec.getValue({fieldId: enums.ConfigurationFields.AccessToken}),
			clientId: rec.getValue({fieldId: enums.ConfigurationFields.ClientId}),
			clientSecret: rec.getValue({fieldId: enums.ConfigurationFields.ClientSecret}),
			refreshToken: rec.getValue({fieldId: enums.ConfigurationFields.RefreshToken})
		};
    }

    /**
     * Retrieve the Last Updated timestamp of the Configuration record
     *
     * @gov 1
     *
     * @returns {Date} representing the Last Updated timestamp
     */
    function lastUpdated() {
        let { lastmodified: lastModified } = s.lookupFields({
            type: enums.RecordType.Configuration,
            id: 1,
            columns: "lastmodified"
        });

        return f.parse({
            value: lastModified,
            type: f.Type.DATETIME
        });
    }

    exports = {lastUpdated, read};
    return exports;
});
