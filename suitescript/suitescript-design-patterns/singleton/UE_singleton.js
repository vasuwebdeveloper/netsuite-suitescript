define(["N/error", "N/redirect", "N/search"],

(err, redirect, s) => {

    /**
     * Singleton User Event
     *
     * @type {Object} ue-singleton
     *
     * @copyright 2020 Stoic Software, LLC
     * @author Eric T Grubaugh <eric@stoic.software>
     *
     * @NApiVersion 2.1
     * @NModuleScope SameAccount
     * @NScriptType UserEventScript
     */
    let exports = {};

    const Errors = {
        ConfigRecordNoDelete: {
            name: "CONFIG_NO_DELETE",
            message: "You cannot delete the only instance of this record type.",
            notifyOff: true
        },
        ConfigRecordExists: {
            name: "CONFIG_RECORD_ALREADY_EXISTS",
            message: "You cannot create more than one record of this type.",
            notifyOff: true
        }
    };

    /**
     * beforeLoad event handler
     *
     * @gov 5
     *
     * @param {Object} context
     * @param {Record} context.newRecord - The new record being submitted
     * @param {Record} context.oldRecord - The old record before it was modified
     * @param {UserEventType} context.type - The action type that triggered this event
     *
     * @function
     */
    exports.beforeLoad = context => {
        // Ensure that only one instance of the record exists at a time
        let isCreationEvent = ([
            context.UserEventType.CREATE,
            context.UserEventType.COPY
        ].includes(context.type));

        if (isCreationEvent && configRecordExists(context.newRecord.type)) {
            redirectToExisting(context.newRecord.type);
        }
    }

    /**
     * beforeSubmit event handle
     *
     * @gov 5
     *
     * @param {Object} context
     * @param {Record} context.newRecord - The new record being submitted
     * @param {Record} context.oldRecord - The old record before it was modified
     * @param {UserEventType} context.type - The action type that triggered this event
     *
     * @function
     */
    exports.beforeSubmit = context => {
        // Prevent deletion of the first instance of this record
        let isCreate = (context.type === context.UserEventType.CREATE);
        let isDelete = (context.type === context.UserEventType.DELETE);
        let isFirstRecord = (context.newRecord.id === 1);

        if (isDelete && isFirstRecord) {
            throw err.create(Errors.ConfigRecordNoDelete);
        }

        // Ensure that only one instance of the record exists at a time
        if (isCreate && configRecordExists(context.newRecord.type)) {
            throw err.create(Errors.ConfigRecordExists);
        }
    }

    /**
     * Determines whether any records of the given type already exist
     *
     * @gov 5
     *
     * @param {string} type - The record type to check
     *
     * @returns {boolean} true if any records exist; false otherwise
     *
     * @function
     */
    const configRecordExists = (type) => Boolean(s.create({
        type: type,
        filters: [["isinactive", s.Operator.IS, false]]
    }).runPaged().count);

    /**
     * Redirects to the existing record instance
     *
     * @gov 0
     *
     * @param {string} type - The record type to check
     *
     * @function
     */
    const redirectToExisting = type => redirect.toRecord({type: type, id: 1, isEditMode: false})

    return exports;
});
