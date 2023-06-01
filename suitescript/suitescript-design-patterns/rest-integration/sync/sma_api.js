define([
    "../api/sma_api_application",
    "../api/sma_api_assignments",
    "../api/sma_api_payments",
    "../api/sma_api_programs",
    "../api/sma_api_task",
    "../api/sma_api_token",
    "../api/sma_api_user"
],

(application, assignments, payments, programs, task, token, user) => {

    /**
     * Convenience module for importing all API modules
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     */
    let exports = {};

    exports = {application, assignments, payments, programs, task, token, user};
    return exports;
});
