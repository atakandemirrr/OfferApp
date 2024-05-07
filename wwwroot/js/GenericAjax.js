
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

///generic ajax örneði 2 Mehmet Kýran Yazdý
async function AjaxFormSubmit(form, callback) {
    //data-Yonlenecek attr si gidiceði url verilmeli
    //data-Refresh attr True yada false verilmeli eðer sayfa kendi içinde refres edilicekse
    //data-IsRespons attr True yada false olmalý sayfa yönlenicek ise true ynlenmeyecek ise false olmalý

    //  LoadingWait();
    form.find("button[type=\"submit\"]").attr("disabled", true);
    var id = form.attr("id")

    var Refresh = form.attr("data-Refresh")
    var IsRespons = form.attr("data-IsRespons")
    var Datas = $("#" + id + " :input")
    var formData = new FormData();
    for (var i = 0; i < Datas.length; i++) {

        switch (Datas[i].type) {
            case "file":
                for (var j = 0; j < Datas[i].files.length; j++) {
                    formData.append(Datas[i].name, Datas[i].files[j]);
                }
                break;
            case "checkbox":
                formData.append(Datas[i].name, Datas[i].checked);
                break;
            case "radio":
                console.log(Datas[i].checked)
                if (Datas[i].checked) {
                    formData.append(Datas[i].name, Datas[i].value);
                }
                break;
            case "select-multiple":
                var datas = $("[name='" + Datas[i].name + "']").select2("data");
                var arrystr = "";
                for (var j = 0; j < datas.length; j++) {
                    arrystr += datas[j].id + ",";
                };
                if (arrystr.length > 0)
                    arrystr = arrystr.substring(0, arrystr.length - 1)
                formData.append(Datas[i].name, arrystr);
                break;

            default:
                formData.append(Datas[i].name, Datas[i].value);
                break;
        }


    }
    $.ajax({
        type: form[0].method,
        url: form[0].action,
        data: formData,
        processData: false,
        contentType: false
    }).done(async function (response) {
        response = JSON.parse(response)
        if (response.IsSuccess) {
            await SuccessMessage();
            if (callback) {
                callback();
            }
            else {
                if (response.ResultData == "") {

                }
                else {
                    if (response.ResultData == "Yenile") {
                        setTimeout(function () {
                            window.location.reload()
                        }, 2000);
                    }
                    else {
                        await yonlendir(response.ResultData);
                    }

                }
            }

        }
        else {
            ErrorMessageBoxCreator(response)
        }
        form.find("button[type=\"submit\"]").attr("disabled", false);

        return false;

    }).fail(function (data) {
        console.log(data);
        alert("Console Log");
    });
}
