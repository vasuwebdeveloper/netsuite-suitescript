define(["N/url"], (url) => {
    /**
     * @NApiVersion 2.1
     * @NModuleScope Public
     */
    let exports = {}

    /**
     * Generates a typical URL path for a RESTful API, which generally take the format:
     *
     * https://thedomain.com/resource/id/child/childId/?query=parameters
     *
     * @param {Object} opts
     * @param {string} opts.resource - The URL slug for the primary resource
     * @param {number} [opts.id] - The identifier for the primary resource; optional
     * @param {string} [opts.child] - The URL slug for the child resource; optional
     * @param {number} [opts.childId] - The identifier for the child resource; optional
     * @param {Object} [opts.query] - Key-value pairs representing URL parameters
     *
     * @returns {string} the URL path for the given resource
     *
     * @throws {string} if no resource is provided
     *
     * @example
     * // URL for listing all "synced" Variants of a specific Product
     * generatePath({
     *   resource: "products",
     *   id: 421,
     *   child: "variants",
     *   query: {status: "synced"}
     * });
     * // returns "products/421/variants?status=synced"
     */
    exports.generatePath = ({resource, id=NaN, child="", childId=NaN, query={}} = {}) => {
        if (!resource) {
            throw "No primary resource defined!";
        }

        let domain = [resource, id, child, childId]
            .filter(Boolean)
            .join("/");

        return url.format({domain, "params": query});
    }

    return exports;
});
