define([], () => {
    /**
     * Invoice User Event that will be triggered by the Jumplet's transformation of the Sales Order
     *
     * @NApiVersion 2.1
     * @NScriptType UserEventScript
     * @NModuleScope SameAccount
     * @appliedtorecord invoice
     */
    let exports = {};

    exports.afterSubmit = (context) => {
        log.audit({title: "Invoice User Event triggered."});
    }

    return exports;
});
