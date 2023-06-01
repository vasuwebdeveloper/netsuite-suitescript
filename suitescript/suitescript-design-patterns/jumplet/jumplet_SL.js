define(["N/http", "N/record"], (http, r) => {
    /**
     * Suitelet which acts as a Jumplet for chaining User Events
     *
     * @NApiVersion 2.1
     * @NScriptType Suitelet
     * @NModuleScope SameAccount
     */
    let exports = {};

    exports.onRequest = (context) => {
        log.audit({title: "Jumplet received request."});
        if (context.request.method !== http.Method.GET) {
            return;
        }

        createInvoice(context.request);
        log.audit({title: "Sales Order transformed."});
    }

    function createInvoice(request) {
        let salesOrderId = request.parameters["soid"];
        if (!salesOrderId) {
            return;
        }

        r.transform({
            fromType: r.Type.SALES_ORDER,
            fromId: salesOrderId,
            toType: r.Type.INVOICE
        }).save();
    }

    return exports;
});
