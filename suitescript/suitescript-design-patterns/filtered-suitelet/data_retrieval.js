define(["./enums", "N/search"],

(enums, s) => {

    /**
     * Responsible for retrieving data to display in Suitelet
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     */
    let exports = {};

    function findOverdueInvoices(request) {
        return s.create({
            type: s.Type.INVOICE,
            filters: generateFilters(request),
            columns: [
                "amountremaining",
                "daysoverdue",
                "entity",
                "salesrep",
                "tranid"
            ]
        }).run()
            .getRange({start: 0, end: 10})
            .map(toObject);
    }

    function generateFilters(request) {
        let filters = [
            ["mainline", s.Operator.IS, true], "AND",
            ["daysoverdue", s.Operator.GREATERTHAN, 0]
        ];

        let customers = parseFilter(request.parameters[enums.Filters.Customer]);
        let reps = parseFilter(request.parameters[enums.Filters.SalesRep]);

        if (customers.length) {
            filters = [...filters, "AND", ["entity", s.Operator.ANYOF, customers]];
        }

        if (reps.length) {
            filters = [...filters, "AND", ["salesrep", s.Operator.ANYOF, reps]];
        }

        return filters;
    }

    const toObject = result => ({
        [enums.Columns.Amount]: parseFloat(result.getValue({name: "amountremaining"})),
        [enums.Columns.Customer]: result.getValue({name: "entity"}),
        [enums.Columns.DaysOverdue]: parseInt(result.getValue({name: "daysoverdue"})),
        [enums.Columns.InternalId]: result.id,
        [enums.Columns.SalesRep]: result.getValue({name: "salesrep"}),
        [enums.Columns.TransactionId]: result.getValue({name: "tranid"})
    })

    /**
     * Parses a multiselect filter value; NetSuite serializes multiselect values as
     * a single string with \x05 as the separator for selected values
     *
     * @param {string} [str] - the value to parse
     *
     * @returns {string[]} list of selected ID values
     */
    const parseFilter = (str="") => str.split("\x05").filter(Boolean);

    exports = {findOverdueInvoices};
    return exports;
});
