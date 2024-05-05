
/////Generic Ajax Örneði
function ajaxCall(url, params, timeOut, type, ajxSuccessFn, ajxFailFn) {

    timeOut = timeOut === "" ||
        timeOut === "undefined" ||
        timeOut === null ? 6000 : timeOut;
    type = type.toUpperCase() != "GET" &&
        type.toUpperCase() != "POST" &&
        type.toUpperCase() != "PUT" &&
        type.toUpperCase() != "DELETE" ? "POST" : type;

    $.ajax({
        type: type.toUpperCase(),
        cache: false,
        url: url,
        data: params,
        success: function (result) {
            console.log("#.1 ------ start of ajax success -----");

            if (arguments.length > 4) {
                var successFn = partial(ajxSuccessFn, result);
                successFn();
            }

            console.log("#.2 ------ end of ajax success -----");
        },
        error: function (xhr, ajaxOptions, thrownError) {

            if (arguments.length > 5) {
                var errorFn = partial(ajxFailFn, xhr, thrownError);
                errorFn();
            }

            console.log("\n\t*** ajax call failure! : (readyState: " +
                xhr.readyState + " - status: " + xhr.status + " " + xhr.statusText +
                ") Error Message: " + thrownError.message + " ***");
        },
        timeout: timeOut
    }).complete(function (xhr, status) {
        console.log("\n\t***  ajax call completed: (readyState: " +
            xhr.readyState + " - status: " + xhr.status + " " + xhr.statusText + ") Result: " + status + " ***");
    });
}