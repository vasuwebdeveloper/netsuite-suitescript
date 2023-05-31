/**
 * Enumerations for Filtered Suitelet example
 *
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define([], () => ({
    Filters: {
        Customer: "custpage_customer",
        SalesRep: "custpage_salesrep"
    },
    Columns: {
        Amount: "custpage_col_amount",
        Customer: "custpage_col_customer",
        DaysOverdue: "custpage_col_days",
        InternalId: "custpage_col_id",
        SalesRep: "custpage_col_salesrep",
        TransactionId: "custpage_col_tranid"
    }
}));
