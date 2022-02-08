function validateEmails(oSrc, args) {
    var filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (args.Value.length == 0)
        args.IsValid = false;
    else
        args.IsValid = args.Value.toString().match(filter);

    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateDienThoaiOld(oSrc, args) {
    if (args.Value.length == 0)
        args.IsValid = false;
    else if (args.Value.length > 9 && args.Value.length < 12 && args.Value.toString().indexOf("0") == 0) {
        if (args.Value.toString().match(/^\d+$/)) {
            if (args.Value.toString().indexOf("09") == 0 || args.Value.toString().indexOf("08") == 0)
                args.IsValid = (args.Value.length == 10);
            else if (args.Value.toString().indexOf("01") == 0)
                args.IsValid = (args.Value.length == 11);
            else args.IsValid = true;
        } else args.IsValid = false;
    } else {
        args.IsValid = false;
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateDienThoai(oSrc, args) {
    var _arrayNumber = ["086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039", "087", "088", "091", "094", "083", "084", "085", "081", "082", "089", "090", "093", "070", "079", "077", "076", "078", "099", "059", "092", "052", "056", "058"];
    if (args.Value.length === 0)
        args.IsValid = false;
    else if (args.Value.length === 10 && args.Value.toString().indexOf("0") === 0) {
        if (args.Value.toString().match(/^\d+$/)) {
            var _startNumber = args.Value.substring(0, 3);
            if (jQuery.inArray(_startNumber, _arrayNumber) !== -1) args.IsValid = true;
            else args.IsValid = false;
        } else args.IsValid = false;
    } else {
        args.IsValid = false;
    }

    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateFax(oSrc, args) {

    if (args.Value.length == 0)
        args.IsValid = false;
    else if ((args.Value.length > 9 && args.Value.length < 12)) {
        args.IsValid = args.Value.toString().match(/^\d+$/);

    } else {
        args.IsValid = false;
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateWebsite(oSrc, args) {

    if (args.Value.length == 0)
        args.IsValid = false;
    var regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    args.IsValid = regex.test(args.Value.toString());

    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateCMND(oSrc, args) {
    if (args.Value.length == 0)
        args.IsValid = false;
    else if ((args.Value.length >= 9 && args.Value.length <= 12)) {
        args.IsValid = args.Value.toString().match(/^\d+$/);

    } else {
        args.IsValid = false;
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateMaxchar(oSrc, args) {

    var maxlength = document.getElementById(oSrc.controltovalidate).getAttribute('maxlength');
    var length = document.getElementById(oSrc.controltovalidate).getAttribute('length');
    if (isNaN(maxlength) || maxlength == null) {
        if (isNaN(length) || length == null)
            maxlength = 250;
        else
            maxlength = length;
    }
    if (args.Value.length == 0 || args.Value.toString().length > maxlength)
        args.IsValid = false;
    else
        args.IsValid = true;
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateFloat(oSrc, args) {
    var maxlength = document.getElementById(oSrc.controltovalidate).getAttribute('maxlength');
    if (isNaN(maxlength) || maxlength == null)
        maxlength = 10;
    if (args.Value.length == 0)
        args.IsValid = false;
    else if (args.Value.toString().length <= maxlength && args.Value.toString().match(/^-?\d*(\.\d+)?$/)) {
        var val = parseFloat(args.Value.toString());
        args.IsValid = val >= 0;

    } else {
        args.IsValid = false;
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateInt(oSrc, args) {
    var maxlength = document.getElementById(oSrc.controltovalidate).getAttribute('maxlength');
    if (isNaN(maxlength) || maxlength == null)
        maxlength = 10;
    if (args.Value.length == 0)
        args.IsValid = false;
    else if (args.Value.toString().length <= maxlength && args.Value.toString().match(/^\d+$/)) {
        var val = parseInt(args.Value.toString());
        args.IsValid = val >= 0;
    } else {
        args.IsValid = false;
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateMa(oSrc, args) {

    var maxlength = document.getElementById(oSrc.controltovalidate).getAttribute('maxlength');
    if (isNaN(maxlength) || maxlength == null)
        maxlength = 50;
    if (args.Value.length == 0 || args.Value.toString().length > maxlength)
        args.IsValid = false;
    else {
        var regex = /^[0-9A-z]*$/;
        args.IsValid = regex.test(args.Value.toString());
    }
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function validateDTTrenGiay(oSrc, args) {

    var maxlength = document.getElementById(oSrc.controltovalidate).getAttribute('maxlength');
    if (isNaN(maxlength) || maxlength == null)
        maxlength = 30;
    console.log(maxlength);
    if (args.Value.length == 0 || args.Value.toString().length > maxlength)
        args.IsValid = false;
    else
        args.IsValid = true;
    if (!args.IsValid) {
        document.getElementById(oSrc.controltovalidate).focus();
    }
}
function onlyNumber(sender, args) {
    var text = sender.get_value() + args.get_keyCharacter();
    if (!text.match('^[0-9]+$'))
        args.set_cancel(true);
}