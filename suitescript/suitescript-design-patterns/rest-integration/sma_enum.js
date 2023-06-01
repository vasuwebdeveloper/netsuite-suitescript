/**
 * Enumerations for the example SMA Integration
 *
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define([], () => ({
	Api: {
		BaseUrl: "https://apply.example.com/"
	},
	ConfigurationFields: {
		AccessToken: "custrecord_sma_config_access",
		ClientId: "custrecord_sma_config_client",
		ClientSecret: "custrecord_sma_config_secret",
		RefreshToken: "custrecord_sma_config_refresh"
	},
	RecordType: {
		Configuration: "customrecord_sma_config"
	}
}));
