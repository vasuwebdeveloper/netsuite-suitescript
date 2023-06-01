/**
 * @NApiVersion 2.1
 */

define(['N/query'],
    /**
     * @param{query} query
     */
    (query) => {

        /**
         * Manual Pagination
         * @param {string} sql
         * @param {number} [limit=9999999999]
         * @param {number} [pageSize=5000]
         * @param {string} queryName
         * @returns {*[]}
         */
        const runQuery = ({sql, limit, pageSize, queryName}) => {

            const functionName = "runQuery";
            let processStr = "";
            let self = this;
            let records = [];

            try {

                if (!sql) return [];

                const sqlPageSize = pageSize || 5000;
                let paginatedRowBegin = 1;
                const paginatedRowEnd = limit || 9999999999;
                let isMoreRecords = true;
                const startTime = new Date().getTime();
                do {
                    const paginatedSQL = `SELECT * FROM (SELECT ROWNUM AS ROWNUMBER, * FROM (  ${sql} ) )  WHERE ( ROWNUMBER BETWEEN ${paginatedRowBegin} AND ${paginatedRowEnd} )`;
                    const queryResults = query.runSuiteQL({query: paginatedSQL, params: []}).asMappedResults();
                    records.push(...queryResults);
                    if (queryResults.length < sqlPageSize) {
                        isMoreRecords = false;
                    }
                    paginatedRowBegin += sqlPageSize;
                } while (isMoreRecords);

                log.debug(`queryFetch (${queryName}) total time>>>>>>>>`,
                    (new Date().getTime() - startTime) / 1000);

            } catch (ex) {
                let errorStr = (ex.name != null) ? ex.name + '</br>' + ex.message + '</br>' + ex.stack + '</br>' : ex.toString();
                log.error('Error',
                    `A problem occured whilst ${processStr}: <br>${errorStr}<br>functionName>>>>${functionName}`);

            }

            return records;
        };


        /**
         * Native Pagination
         * @param {string} sql
         * @returns {*[]}
         */
        const queryFetch = ({sql}) => {

            const functionName = "queryFetch";
            let processStr = "";
            let results = [];

            try {
                const queryResult = query.runSuiteQLPaged({
                    query: sql,
                    pageSize: 1000,
                });

                queryResult.pageRanges.forEach((page, index) => {
                    queryResult.fetch({index}).data.results.forEach((rowObj) => {
                        results.push(rowObj.asMap());
                    });
                });
            } catch (ex) {
                let errorStr = (ex.name != null) ? ex.name + '</br>' + ex.message + '</br>' + ex.stack + '</br>' : ex.toString();
                log.error('Error',
                    `A problem occured whilst ${processStr}: <br>${errorStr}<br>functionName>>>>${functionName}`);

            }

            return results;
        };


        /*  Pagination for search results
            * @param {string} sql
            * @returns {*[]}
        */
        const runPagedQuery = (sql, pageSize) => {
            return query.runSuiteQLPaged({
                query: sql,
                pageSize: pageSize,
            });
        };


        return {queryFetch, runQuery, runPagedQuery}

    });
