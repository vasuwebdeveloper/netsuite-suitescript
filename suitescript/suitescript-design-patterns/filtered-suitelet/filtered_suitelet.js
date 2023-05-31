define(["./data_retrieval", "./form_ui", "N/https"],

(data, ui, https) => {

    /**
     * A typical Form Suitelet which renders a list of search results and provides a set of filters
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     * @NScriptType Suitelet
     */
    let exports = {};

    /**
     * onRequest event handler
     *
     * @param {Object} context
     * @param {https.ServerRequest} context.request - The incoming request object
     * @param {https.ServerResponse} context.response - The outgoing response object
     */
    function onRequest(context) {
        log.audit({title: `${context.request.method} request received`});

        const eventRouter = {
            [https.Method.GET]: onGet,
            [https.Method.POST]: onPost
        };

        try {
            (eventRouter[context.request.method])(context);
        } catch (e) {
            onError({context: context, error: e});
        }

        log.audit({title: "Request complete."});
    }

    function onGet(context) {
        log.audit({title: "Processing GET..."});

        context.response.writePage({
            pageObject: ui.renderPage(context)
        });
    }

    function onPost(context) {
        log.audit({title: "Processing POST..."});

        let invoices = data.findOverdueInvoices(context.request);
        context.response.writePage({
            pageObject: ui.renderPage(context, invoices)
        });
    }

    function onError(context) {
        log.error({title: context.error.name, details: context.error});
        throw context.error;
    }

    exports = {onRequest};
    return exports;
});
