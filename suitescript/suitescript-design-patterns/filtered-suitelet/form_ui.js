define(["./enums", "N/ui/serverWidget", "N/record"],

(enums, ui, r) => {

    /**
     * Responsible for UI generation for the Suitelet
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     */
    let exports = {};

    /**
     * Renders the UI for the Suitelet
     *
     * @param {Object} context - the Suitelet Script context
     * @param {Object[]} [invoices=[]] - the data to populate the Form
     *
     * @returns {Form} the Form to render
     */
    function renderPage(context, invoices=[]) {
        let form = ui.createForm({title: "Sample Filtered Suitelet"});

        renderButtons(form);
        renderFields(form);
        let sublist = renderSublist(form);
        populateResults(sublist, invoices);

        return form;
    }

    function renderFields(form) {
        form.addFieldGroup({id: "custpage_grp_filters", label: "Filters"})
            .isCollapsible = true;

        [{
            id: enums.Filters.Customer,
            label: "Invoice Customer",
            type: ui.FieldType.MULTISELECT,
            container: "custpage_grp_filters",
            source: r.Type.CUSTOMER
        },{
            id: enums.Filters.SalesRep,
            label: "Sales Rep",
            type: ui.FieldType.MULTISELECT,
            container: "custpage_grp_filters",
            source: r.Type.EMPLOYEE
        }].forEach(f => form.addField(f));
    }

    function renderSublist(form) {
        let sublist = form.addSublist({
            id: "custpage_invoices",
            label: "Overdue Invoices",
            type: ui.SublistType.LIST
        });

        [{
            id: enums.Columns.InternalId,
            label: "internalid",
            type: ui.FieldType.INTEGER,
            displayType: ui.FieldDisplayType.HIDDEN
        }, {
            id: enums.Columns.TransactionId,
            label: "Invoice",
            type: ui.FieldType.TEXT,
            displayType: ui.FieldDisplayType.INLINE
        },{
            id: enums.Columns.Customer,
            label: "Customer",
            type: ui.FieldType.SELECT,
            source: r.Type.CUSTOMER,
            displayType: ui.FieldDisplayType.INLINE
        },{
            id: enums.Columns.SalesRep,
            label: "Sales Rep",
            type: ui.FieldType.SELECT,
            source: r.Type.EMPLOYEE,
            displayType: ui.FieldDisplayType.INLINE
        },{
            id: enums.Columns.DaysOverdue,
            label: "Days Overdue",
            type: ui.FieldType.INTEGER,
            displayType: ui.FieldDisplayType.INLINE
        },{
            id: enums.Columns.Amount,
            label: "Amount Remaining",
            type: ui.FieldType.CURRENCY,
            displayType: ui.FieldDisplayType.INLINE
        }].forEach(f => sublist.addField(f).updateDisplayType(f));

        return sublist;
    }

    function renderButtons(form) {
        form.addSubmitButton({label: "Apply Filters"});
    }

    function populateResults(sublist, invoices) {
        invoices.forEach((invoice, line) =>
            Object.getOwnPropertyNames(invoice).forEach(id => {
                if (!invoice[id]) { return; }
                sublist.setSublistValue({id, line, value: invoice[id]})
            })
        );
    }

    exports = {renderPage};
    return exports;
});
