define([
    'N/ui/serverWidget',
    'N/error',
    'N/log'
], (
    uiServerWidget,
    error,
    log
) => {

    'use strict';

    class NSInterface {

        constructor(options) {
            this._form = (options) ? uiServerWidget.createForm(options) : null;
            this._sublist = null;
            this._sublistValues = [];
        }


        get form() {
            return this._form;
        }

        get sublistValues() {
            return this._sublistValues;
        }

        set clientScriptFileId(id) {
            this._form.clientScriptFileId = id;
        }

        set clientScriptModulePath(path) {
            this._form.clientScriptModulePath = path;
        }

        /**
         * addSubtabs - Add subtab to the form
         *
         * @param  {Form} form    description
         * @param  {Array} subtabs Array of subtabs containing id, label, tab(if applicable)
         */
        addSubTabs = (form, subtabs) => {
            if (subtabs) {
                for (let i = 0; i < subtabs.length; i++) {
                    form.addSubtab(subtabs[i]);
                }
            }
        }


        /**
         * addButtons - Adds button to the form
         *
         * @param  {Form}  form    form object
         * @param  {Array} buttons Array of button containing id, label, and functionName
         */
        addButtons = (form, buttons) => {
            if (buttons) {
                for (let i = 0; i < buttons.length; i++) {
                    form.addButton(buttons[i]);
                }
            }
        }


        /**
         * addFields - Adds fields to the form
         *
         * @param  {Form}  form    form object
         * @param  {Array} fields Array of fields containing id, label, source and type
         */
        addFields = (form, fields) => {

            if (fields) {
                for (let i = 0; i < fields.length; i++) {
                    let field = form.addField(fields[i]);
                    setFieldProperties(field, fields[i]);
                }
            }
        }


        /**
         * addSublists - Adds sublist to the form
         *
         * @param  {Form}  form    form object.
         * @param  {Array} sublists Array of fields containing id, label, source and type.
         */
        addSublists = (form, sublists) => {

            if (sublists) {
                for (let i = 0; i < sublists.length; i++) {
                    var customSublist = form.addSublist(sublists[i]);

                    let sublistButtons = sublists[i].buttons;
                    for (let j = 0; j < sublistButtons.length; j++) {
                        customSublist.addButton(sublistButtons[j]);
                    }

                    let sublistFields = sublists[i].fields;
                    for (let j = 0; j < sublistFields.length; j++) {
                        let sublistColumnField = customSublist.addField(sublistFields[j]);
                        setFieldProperties(sublistColumnField, sublistFields[j]);
                    }
                    if (sublists[i].markAll) {
                        customSublist.addMarkAllButtons();
                    }
                }
            }

            return customSublist;
        }


        /**
         * setFieldProperties - Sets properties to the field object
         * This function is also used when setting properties of sublist fields
         *

         */
        setFieldProperties = (field, obj) => {
            if (obj.help) {
                field.setHelpText(obj.help);
            }

            if (obj.defaultValue) {
                field.defaultValue = obj.defaultValue;
            }

            if (obj.linkText) {
                field.linkText = obj.linkText;
            }

            if (obj.breakType) {
                field.updateBreakType({"breakType": obj.breakType});
            }

            if (obj.layoutType) {
                field.updateLayoutType({"layoutType": obj.layoutType});
            }

            if (obj.isMandatory) {
                field.isMandatory = obj.isMandatory;
            }

            if (obj.maxLength) {
                field.maxLength = obj.maxLength;
            }

            if (obj.displayType) {
                field.updateDisplayType({"displayType": obj.displayType});
            }

            if (obj.displaySize) {
                field.updateDisplaySize(obj.displaySize);
            }

            if (obj.selectOptions) {
                addSelectOptions(field, obj.selectOptions);
            }
        }


        //@method addFieldGroups
        addFieldGroups(fieldGroups) {
            fieldGroups.forEach((fieldGroup) => {
                this._form.addFieldGroup(fieldGroup);
            });

            return this;
        }


        addMarkAllButtons() {
            this._sublist.addMarkAllButtons();
            return this;
        }


        //@method getFieldValues
        getValues(request, fields) {
            this.fieldValues = {};
            fields.forEach((field) => {
                this.fieldValues[field] = request.parameters[field];
            });
        }

        //@method getSublist
        getSublist(sublistId) {
            this._sublist = this._form.getSublist({
                id: sublistId
            });

            return this;
        }

        /**
         *  @method getSublistValues
         *
         *  @param {Object} request ServerRequest.parameters
         *  @param {string} groupId
         *  @param {Object} columns
         *
         *  @return {Object}
         */
        getSublistValues(request, groupId, columns) {
            let numLines = request.getLineCount({
                group: groupId
            });

            if (numLines > 0) {
                for (let i = 0; i < numLines; i++) {
                    let line = {};
                    columns.forEach((column) => {
                        line[column.id] = request.getSublistValue({
                            group: groupId,
                            name: column.id,
                            line: i
                        });
                    });
                    this._sublistValues.push(line);
                }
            }
        }


        //@method render
        render() {
            this.context.response.writePage({
                pageObject: this.form
            });
        }

        //@method write
        write(output) {
            this.context.response.write({
                output: output
            });
        }
    }

    return NSInterface;
});