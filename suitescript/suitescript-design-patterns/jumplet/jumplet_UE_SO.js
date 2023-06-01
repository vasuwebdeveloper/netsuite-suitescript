define(["N/https", "N/url"], (https, url) => {
    /**
     * Sales Order User Event which will send a request to trigger the Jumplet
     *
     * @NApiVersion 2.1
     * @NScriptType UserEventScript
     * @NModuleScope SameAccount
     * @appliedtorecord salesorder
     */
    let exports = {};

    /**
     * afterSubmit entry point
     *
     * @gov 10
     */
    exports.afterSubmit = (context) => {
        log.audit({title: "Sales Order User Event triggered."});

        // Only transform Sales Orders that have been Approved
        if (context.type !== context.UserEventType.APPROVE) {
            return;
        }

        sendRequest(context.newRecord.id);
        log.audit({title: "Jumplet request sent."});
    }

    /**
     * Sends the HTTP request to the Jumplet with the Sales Order ID as a request parameter
     *
     * @gov 10
     *
     * @param {number} id - Internal ID of the Sales Order record
     */
    function sendRequest(id) {
        if (!id) {
            return;
        }

        let domain = url.resolveDomain({hostType: url.HostType.APPLICATION});
        let jumpletUrl = url.resolveScript({
            scriptId: "customscript_sl_jumplet",
            deploymentId: "customdeploy_sl_jumplet",
            params: {soid: id}
        });

        https.get({url: `https://${domain}${jumpletUrl}`});
    }

    return exports;
});
