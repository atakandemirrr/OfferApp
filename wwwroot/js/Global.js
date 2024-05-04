/*Mesajlar*/
function SuccessMessage() {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your Transaction Completed Successfully',
        showConfirmButton: false,
        timer: 1500
    })
    document.body.removeAttribute("style");
}
/*Mesajlar*/
/*Hata Mesajı işlemleri*/
function ErrorMessageBoxCreator(data) {
    document.getElementById("dvErrorBox").style.display = "block";
    document.getElementById("dvMessage").innerHTML = "";
    var Messages = "";

    for (var i = 0; i < data.ErrorMessages.length; i++) {
        Messages += " <div>*" + data.ErrorMessages[i] + "</div>";
    }

    document.getElementById("dvMessage").innerHTML = Messages
    document.getElementById("dvErrorBox").scrollIntoView();
}
function MessageHide() {
    document.getElementById("dvErrorBox").style.display = "none";

}
/*Hata Mesajı işlemleri*/
/*Onay İşlemleri*/
async function ConfirmationMessage(callbackyes, colbackno) {
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value == true) {
            if (callbackyes) {
                callbackyes();
            }
        }
        else {
            if (colbackno) {
                colbackno();
            }
            else {

            }

        }

    })


}
/*Onay İşlemleri*/


/*Loading Kart*/
async function LoadPage(id, Text, Callback) {
    if (Text != null) {
        var loading = " <div class=\"col-lg-12\">";
        loading = " <div class=\"card\">";
        loading += " <div class=\"card-header\">";
        loading += " <div class=\"row align-items-center\">";
        loading += " <div class=\"col\">";
        loading += " <h4 class=\"card-title\">" + Text + "</h4>";
        loading += " </div>";
        loading += "</div> ";
        loading += "   </div>";
        loading += " <div class=\"card-body\">";
        loading += "<div class=\"row\"> ";
        loading += " <div class=\"col-md-12\">";
        loading += "<div class=\"text-center \">";
        loading += "  <i class=\"la la-spinner text-primary la-spin progress-icon-spin\"></i>";
        loading += "  </div>";
        loading += "  </div>";
        loading += "  </div>";
        loading += "  </div>";
        loading += "  </div>";
        loading += "  </div>";
        document.getElementById(id).innerHTML = loading

    }

    return await Callback()
}
async function PageLoadView(Url, id, LoadText, callback) {
    await LoadPage(id, LoadText, async function () {
        return await $("#" + id).load(Url, function () {

            if (callback) {
                callback();
            }
        })
    })
}
async function PageView(Url, id, callback) {
    return await $("#" + id).load(Url, function () {

        if (callback) {
            callback();
        }
    })
}
/*Loading Kart*/




/*Silme İşlemleri*/
function AjaxRunUrl(Url, Confirmation, callback) {
    if (Confirmation) {
        ConfirmationMessage(function () {
            $.ajax({
                type: "Get",
                url: Url,
                processData: false,
                contentType: false
            }).done(async function (response) {
                await SuccessMessage();
                if (callback) {
                    callback();
                }
                else {
                    window.location.reload();
                }
                return false;

            }).fail(function (data) {
                console.log(data);
                alert("Console Log");
            });

        });
    }
    else {
        $.ajax({
            type: "Get",
            url: Url,
            processData: false,
            contentType: false
        }).done(async function (response) {
            await Success();
            if (callback) {
                callback();
            }
            else {
                window.location.reload();
            }
            return false;

        }).fail(function (data) {
            console.log(data);
            alert("Console Log");
        });


    }




}
function AjaxRemove(Url, callback) {
    ConfirmationMessage(function () {
        $.ajax({
            type: "Get",
            url: Url,
            processData: false,
            contentType: false
        }).done(async function (response) {
            await SuccessMessage();
            if (callback) {
                callback();
            }
            else {
                window.location.reload();
            }
            return false;

        }).fail(function (data) {
            console.log(data);
            alert("Console Log");
        });

    });

}
/*Silme İşlemleri*/

/*Kaydetme İşlemleri,veri getirme*/
async function AjaxFormSubmit(form, callback) {
    //data-Yonlenecek attr si gidiceği url verilmeli
    //data-Refresh attr True yada false verilmeli eğer sayfa kendi içinde refres edilicekse
    //data-IsRespons attr True yada false olmalı sayfa yönlenicek ise true ynlenmeyecek ise false olmalı

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
async function GetFormData(FormId) {
    var id = FormId
    var Datas = $("#" + id + " :input");
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
    return formData;
}
/*Kaydetme İşlemleri,veri getirme*/

/*Modal işlemleri*/
function Select2Creator() {
    $('.select2').each(function () {
        $(this).select2({
            theme: "bootstrap"
        });
        var span = $(this).next().find('.select2-selection');
        var container = span.closest('.select2-container');

        container.removeAttr('style')
            .addClass('form-control select2');

    });
}
//var Modal1 = $('#Modal1');
//var Modal2 = $('#Modal2');
//var Modal3 = $('#Modal3');
//$(document).on('click', '#btnOpenModal', async function () {
//    await ModalOpen($(this), function () {

//    });
//});
//async function ModalOpen(button, callback) {
//    var url = button.attr("data-url");
//    var zindex = button.attr("data-zindex");

//    switch (zindex) {
//        case "1":
//            await Modal1.load(url, async function () {
//                await Modal1.modal('show');
//                TimeCreator();
//                if (callback) {
//                    callback();
//                }
//                document.querySelector("body").style.paddingRight = 0
//            });
//            break;
//        case "2":
//            await Modal2.load(url, async function () {
//                await Modal2.modal('show');
//                TimeCreator();
//                if (callback) {
//                    callback();
//                }
//                document.querySelector("body").style.paddingRight = 0
//            });
//            break;
//        case "3":
//            await Modal3.load(url, async function () {
//                await Modal3.modal('show');
//                TimeCreator();
//                if (callback) {
//                    callback();
//                }
//                document.querySelector("body").style.paddingRight = 0
//            });
//            break;
//        default:
//    }

//}

$(document).on('click', '#btnCloseModal', async function () {
    var zindex = $(this).attr("data-zindex");
    ModalClose(zindex);
});

function ModalClose(zindex) {
    switch (zindex) {
        case "1":
            Modal1.modal('hide');
            break;
        case "2":
            Modal2.modal('hide');
            break;
        case "3":
            Modal3.modal('hide');
            break;
        default:
    }
    try {
        //document.getElementsByClassName('modal-backdrop fade show')[document.getElementsByClassName('modal-backdrop fade show').length - 1].remove()
        //document.body.classList.remove('modal-open');
        document.querySelector("body").style.paddingRight = 0
    } catch (e) {

    }

}
function TimeCreator() {
    var Input = document.getElementsByClassName('Datepicker');

    for (var i = 0; i < Input.length; i++) {

        var Id = Input[i].id;
        var minYear = Input[i].getAttribute("data-minyear");
        var MaxYear = Input[i].getAttribute("data-maxyear");
        var time = Input[i].getAttribute("data-time");
        if (minYear == undefined) {
            minYear = 150;
        }
        if (MaxYear == undefined) {
            MaxYear = 150;
        }
        SetupDateTimePickers(Id, minYear, MaxYear, time);


    }

}
/*Modal İşlemleri*/

/*Buttonları kullanım dışı bırakıp aktif etmek için*/
function DisableButtons(classname) {
    var buttons = document.getElementsByClassName(classname);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }

}
function EnableButtons(classname) {

    var buttons = document.getElementsByClassName(classname);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
    }
}
/*Buttonları kullanım dışı bırakıp aktif etmek için*/







