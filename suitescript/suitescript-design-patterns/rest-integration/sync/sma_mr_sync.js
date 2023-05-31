define([
    "./sma_api",
    "N/https",
    "N/runtime",
    "N/search"
], function (api, https, runtime, search) {
    // ...
    api.token.refresh();

    let userData = api.user.get(userId);
    let applications = api.application.list({applicant: userId});
    // ...
});
