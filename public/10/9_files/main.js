var heightGrid = 400;
var NeedJump = false;
function SetGridHeight() {
    try {
        var viewportheight;
        if (typeof window.innerWidth != 'undefined') {
            viewportheight = window.innerHeight;
        } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewportheight = document.documentElement.clientHeight;
        } else {
            viewportheight = document.getElementsByTagName('body')[0].clientHeight;
        }
        var rgHeaderDiv = document.getElementsByClassName("rgHeaderDiv");
        var rgDataDiv = document.getElementsByClassName("rgDataDiv");
        var rgPager = document.getElementsByClassName("rgPager");

        var panel_search = 0;
        try {
            panel_search = $(".qi-panel-search").height();
        } catch (ex) {
            panel_search = 0;
        }

        var panel_message = 0;
        try {
            panel_message = $("#qi-panel-message").height();
        } catch (ex) {
            panel_message = 0;
        }

        var panel_note = 0;
        try {
            panel_note = $("#qi-panel-note").height();
        } catch (ex) {
            panel_note = 0;
        }

        if (panel_search == null || panel_search == 0) {
            try {
                panel_search = $("#qi-panel-search").height();
            } catch (ex) {
                panel_search = 0;
            }
            if ($("#qi-panel-search") == null || $("#qi-panel-search") == 'undefined' || $("#qi-panel-search").css('display') == 'none')
                panel_search = 0;
        }

        var panel_tab = 0;
        try {
            panel_tab = $(".qi-tab").height() + 4;
        } catch (ex) {
            panel_tab = 0;
        }

        var banner = 0;
        try {
            banner = $("#qi-banner").height();
        } catch (ex) {
            banner = 0;
        }
        if ($("#qi-banner") == null || $("#qi-banner") == 'undefined' || $("#qi-banner").css('display') == 'none')
            banner = 0;

        var main_menu = 0;
        try {
            main_menu = $("#qi-main-menu").height();
        } catch (ex) {
            main_menu = 0;
        }

        var i = 0;
        for (i = 0; i < rgDataDiv.length; i++) {
            if ($("#qi-main-menu") == null || $("#qi-main-menu") == 'undefined' || $("#qi-main-menu").css('display') == 'none')
                main_menu = 0;
            var viewportheightItem = viewportheight - banner - main_menu - $("#qi-div-toolbar-form").height() - panel_search - panel_message - panel_note - panel_tab - $($($(rgDataDiv[i]).parent()[0]).find('.rgPager')[0]).height() - $($($(rgDataDiv[i]).parent()[0]).find('.rgHeaderWrapper')[0]).height() - 10;
            if (viewportheightItem > 0 && viewportheightItem < $("#ctl00_ContentPlaceHolder1_RadGrid" + (1 + i) + "_ctl00").height()) {
                rgHeaderDiv[i].style.marginRight = "17px";
            } else {
                rgHeaderDiv[i].style.marginRight = "0px";
            }
            heightGrid = viewportheightItem;
            rgDataDiv[i].style.height = viewportheightItem + "px";
        }
    } catch (ex) {

    }
}
function resize() {
    SetGridHeight();
}

function ResizeInUserControl() {
    //grid.repaint();
    RepaintGrid();
}
function RepaintGrid() {
    if (grid) {
        grid.repaint();
    }
}
function ChangeValidValueNLPC(inputvalue) {
    try {
        switch (inputvalue) {
            case "t": case "T":
                NeedJump = true; return "T"; break;
            case "d": case "đ": case "D": case "Đ": case "Đd": case "ĐD":
                NeedJump = true; return "Đ"; break;
            case "c": case "C":
                NeedJump = true; return "C"; break;
            default: return ""; break;
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueDGMH(inputvalue) {
    try {
        switch (inputvalue) {
            case "t": case "T":
                NeedJump = true; return "T"; break;
            case "h": case "H":
                NeedJump = true; return "H"; break;
            case "c": case "C":
                NeedJump = true; return "C"; break;
            default: return ""; break;
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueHanhKiem(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "K":
                NeedJump = true; return "K"; break;
            case "T":
                NeedJump = true; return "T"; break;
            case "TB": case "B":
                NeedJump = true; return "TB"; break;
            case "Y":
                NeedJump = true; return "Y"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueRenLuyenTT22SuaDoi(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "T":
                NeedJump = true; return "T"; break;
            case "K":
                NeedJump = true; return "K"; break;
            case "D": case "Ð": case "Đ":
                NeedJump = true; return "Đ"; break;
            case "C":
                NeedJump = true; return "CĐ"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueKetQuaHocTapTT22SuaDoi(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "T":
                NeedJump = true; return "T"; break;
            case "K":
                NeedJump = true; return "K"; break;
            case "D": case "Ð": case "Đ":
                NeedJump = true; return "Đ"; break;
            case "C":
                NeedJump = true; return "CĐ"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueDanhHieuCaNamTT22SuaDoi(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "G":
                NeedJump = true; return "GIOI"; break;
            case "X": case "S": case "XS":
                NeedJump = true; return "XUAT_SAC"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}

function ChangeValidValueHocLuc(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "G":
                NeedJump = true; return "G"; break;
            case "K":
                NeedJump = true; return "K"; break;
            case "E": case "KE": case "KEM":
                NeedJump = true; return "KEM"; break;
            case "TB": case "T":
                NeedJump = true; return "TB"; break;
            case "Y":
                NeedJump = true; return "Y"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueDanhHieu(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "G": case "GI": case "GIO": case "GIOI":
                NeedJump = true; return "GIOI"; break;
            case "T": case "TT":
                NeedJump = true; return "TT"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueD_CD(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "C": case "CD": case "CÐ": case "CĐ":
                NeedJump = true; return "CÐ"; break;
            case "D": case "Ð": case "Đ":
                NeedJump = true; return "Ð"; break;
            case "M":
                NeedJump = true; return "M"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}

function ChangeValidValueD_CDC23(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "C": case "CD": case "CĐ": case "CĐ":
                NeedJump = true; return "CĐ"; break;
            case "D": case "Đ": case "Đ":
                NeedJump = true; return "Đ"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}

function ChangeValidValueXepLoai(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "H":
                NeedJump = true; return "HT";
            case "C":
                NeedJump = true; return "CHT";
            default: return "";
        }
    }
    catch (ex) { return ""; }
}

function ChangeValidValueC_K(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "C": case "CÓ": case "1":
                NeedJump = true; return "Có"; break;
            case "K": case "KHÔNG": case "0":
                NeedJump = true; return "Không"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueRTC(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "RẤT TÍCH CỰC": case "R": case "3":
                NeedJump = true; return "Rất tích cực"; break;
            case "TÍCH CỰC": case "T": case "2":
                NeedJump = true; return "Tích cực"; break;
            case "CHƯA TÍCH CỰC": case "C": case "1":
                NeedJump = true; return "Chưa tích cực"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueKQHTVNEN(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "t": case "T":
                NeedJump = true; return "HTT"; break;
            case "h": case "H":
                NeedJump = true; return "HT"; break;
            case "c": case "C":
                NeedJump = true; return "CHT"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueDGVNEN(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "c": case "C":
                NeedJump = true; return "CHT"; break;
            case "h": case "H":
                NeedJump = true; return "HT"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueXepLoaiVNEN(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "t": case "T":
                NeedJump = true; return "T"; break;
            case "d": case "đ": case "D": case "Đ": case "Đd": case "ĐD":
                NeedJump = true; return "Đ"; break;
            case "c": case "C":
                NeedJump = true; return "C"; break;
            default: return ""; break;

        }
    }
    catch (ex) { return ""; }
}

function ChangeValidValuePhanBan(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "1": case "01":
                NeedJump = true; return "Tổ hợp Tự nhiên"; break;
            case "2": case "02":
                NeedJump = true; return "Tổ hợp Xã hội"; break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueLoaiCCNghePhoThong(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "G": case "g":
                NeedJump = true; return "Giỏi"; break;
            case "K": case "k":
                NeedJump = true; return "Khá"; break;
            case "TB": case "tb": case "T": case "t":
                NeedJump = true; return "Trung bình"; break;
            case undefined:
                return "";
                break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValueCCNghePhoThong(inputvalue) {
    try {
        switch (inputvalue.toUpperCase()) {
            case "1": case "01":
                NeedJump = true; return "Nông lâm"; break;
            case "2": case "02":
                NeedJump = true; return "Tin học ứng dụng"; break;
            case "3": case "03":
                NeedJump = true; return "Tiểu thủ công nghiệp"; break;
            case "4": case "04":
                NeedJump = true; return "Dịch vụ"; break;
            case "5": case "05":
                NeedJump = true; return "Nghề khác"; break;
            case undefined:
                return "";
                break;
            default: return "";
        }
    }
    catch (ex) { return ""; }
}
function ChangeValidValue0_10(inputvalue) {
    try {
        var i = parseFloat(inputvalue);
        if (isNaN(i) || (i < 0) || (i > 100)) return "";
        if (i > 10) i = i / 10;
        // lam tron so den 0.5
        if (i.toString().length > 3) return "";
        if (i.toString() + "." == inputvalue) return inputvalue;
        return i.toString();
    }
    catch (ex) { return ""; }
}

function ChangeValidValue0_5(inputvalue) {
    try {
        var i = parseFloat(inputvalue);
        if (isNaN(i) || (i < 0) || (i > 100)) return "";

        //nếu số =10 => nhận số 10
        if (i === 10) {
            return i.toString();
        }

        //số lớn hơn 10 => lấy phần lẻ
        if (i > 10) {

            i = i / 10;
        }

        //số lẻ có chấm đằng sau
        if (i.toString() + "." === inputvalue) return inputvalue;

        //valid số 
        var parseIntValue = parseInt(i);
        if (i === parseIntValue) {
            return i.toString();
        }
        else {
            var listFloatValue = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
            if (listFloatValue.indexOf(i) >= 0) {
                return i.toString();
            }
            else ////số lẻ khác 5 thì reset về trắng
            {
                if (i.toString().length > 3) return "";
                if (i.toString() + "." === inputvalue) return inputvalue;

                return "";
            }
        }
        //return i.toString();
    }
    catch (ex) { return ""; }
}

function DiemChan10(inputvalue) {
    try {
        var i = parseInt(inputvalue);
        if ((!isNaN(i) && i < 10 && i.length > 2) || (!isNaN(i) && i > 11) || (!isNaN(i) && i <= 0) || (isNaN(i))) return "";
        else if (!isNaN(i) && i == 10) {
            NeedJump = true; return 10;
        }
        else if (!isNaN(i) && i == 11) {
            NeedJump = true; return 1;
        }
        else {
            if (i > 1)
                NeedJump = true;
            return i;
        }
    }
    catch (ex) { return ""; }
}

function DiemChan10_C1(inputvalue) {
    try {
        var i = parseInt(inputvalue);
        if ((!isNaN(i) && i < 10 && i.length > 2) || (!isNaN(i) && i > 11) || (isNaN(i))) return "";
        else if (!isNaN(i) && i == 10) {
            NeedJump = true; return 10;
        }
        else if (!isNaN(i) && i == 11) {
            NeedJump = true; return 1;
        }
        else {
            if (i > 1)
                NeedJump = true;
            return i;
        }
    }
    catch (ex) { return ""; }
}

function DiemChan10_C23(inputvalue) {
    try {
        var i = parseInt(inputvalue);
        if ((!isNaN(i) && i < 10 && i.length > 2) || (!isNaN(i) && i > 11) || (!isNaN(i) && i < 0) || (isNaN(i))) return "";
        else if (!isNaN(i) && i == 10) {
            NeedJump = true; return 10;
        }
        else if (!isNaN(i) && i == 11) {
            NeedJump = true; return 1;
        }
        else {
            if (i > 1)
                NeedJump = true;
            return i;
        }
    }
    catch (ex) { return ""; }
}

function Open_Close(e) {
    if ($(e).attr('class') == 'bt-mo') {
        try { $("#qi-panel-search").css('display', 'none'); } catch (ex) { }
        $(e).addClass('bt-dong').removeClass('bt-mo');
    }
    else {
        try { $("#qi-panel-search").css('display', 'block'); } catch (ex) { }
        $(e).addClass('bt-mo').removeClass('bt-dong');
    }
    SetGridHeight();
    RepaintGrid();
}
function Full_Mimi(e) {
    if ($("#qi-banner").css('display') != 'none') {
        $("#qi-banner").css('display', 'none');
        $("#qi-main-menu").css('display', 'none');
        try {
            $(e).addClass('bt-mini').removeClass('bt-zoom');
        } catch (ex) { }
    }
    else {
        $("#qi-banner").css('display', 'block');
        $("#qi-main-menu").css('display', 'block');
        try {
            $(e).addClass('bt-zoom').removeClass('bt-mini');
        } catch (ex) { }
    }
    SetGridHeight();
    RepaintGrid();
}
function ChangeValidValueNumber(inputvalue) {
    try {
        var i = parseFloat(inputvalue);
        if (isNaN(i)) return "";
        return i.toString();
    }
    catch (ex) { return ""; }
}
function NhapSo(inputvalue) {
    try {
        var i = parseInt(inputvalue);
        if (isNaN(i) || (i > 1000000)) return "";
        else return i;

    }
    catch (ex) {
        return "";
    }
}
function isFloatNumberKey(evt) {
    var input = event.target;
    var val = input.value;
    if (evt.which == 8 || evt.which == 0) {
        return true;
    }
    if (evt.which < 46 || evt.which > 59) {
        return false;
    }
    if (evt.which == 46 && val.indexOf('.') != -1) {
        return false;
    }
}
function selectRow(row, grid) {
    try {
        for (var i = 0; i < grid.get_masterTableView().get_dataItems().length; i++) {
            var rowItem = grid.get_masterTableView().get_dataItems()[i];
            var str = rowItem._element.className + '';
            str = str.replace('selectCell', '');
            rowItem._element.className = str.trim();
        }
        row.className += " selectCell";
    } catch (ex) { console.log(ex); }
}
function isNumberKey(evt) {
    if (evt.which != 8 && evt.which != 0 && (evt.which < 48 || evt.which > 57)) {
        return false;
    }
}
function goLink(link) {
    document.location.href = link;

}
function setBorderRowGrid(grid, numberRow) {
    try {
        if (grid) {
            var MasterTable = grid.get_masterTableView();
            var Rows = MasterTable.get_dataItems();
            for (var i = 0; i < Rows.length; i++) {
                var row = Rows[i];
                if ((1 + i) % numberRow == 0)
                    row.get_element().className += " RowEndGroup";
            }
        }
    } catch (ex) {

    }
}
$(document).ready(function () {
    window.onresize = resize;
    resize();
});
$(document).on('mouseover', '.rgMasterTable tbody tr.rgAltRow, tr.rgRow, tr.rgEditRow', function () {
    $(this).addClass("rgSelectedRowHover");
});
$(document).on('mouseout', '.rgMasterTable tbody tr.rgAltRow, tr.rgRow, tr.rgEditRow', function () {
    $(this).removeClass("rgSelectedRowHover");
});
//$(document).on('keypress', function (e) {
//    var tag = e.target.tagName.toLowerCase();
//    if (e.which === 13 && (tag == 'input' || tag == 'textarea')) { //Enter key's keycode
//        return false;
//    }
//});
function keyDownRadgrid(sender, ev) {
    try {
        if (ev.keyCode == "13" || ev.keyCode == "37" || ev.keyCode == "38" || ev.keyCode == "39" || ev.keyCode == "40") {
            var grid = $find(sender.id);
            var dataItems = grid.get_masterTableView().get_dataItems();
            var batchManager = grid.get_batchEditingManager();
            var currentCell = batchManager.get_currentlyEditedCell();
            if (currentCell) {
                var cellIndex = currentCell.cellIndex;
                var currentDataItem = $find(currentCell.parentElement.id);
                var currentRowIndex = currentDataItem.get_itemIndexHierarchical();

                var rowAdd = 1;
                var colAdd = 0;
                if (ev.keyCode == "37") {
                    rowAdd = 0;
                    colAdd = -1;
                }
                else if (ev.keyCode == "38") {
                    rowAdd = -1;
                    colAdd = 0;
                }
                else if (ev.keyCode == "39") {
                    rowAdd = 0;
                    colAdd = 1;
                }
                if (parseInt(cellIndex) + parseInt(colAdd) >= 0 && parseInt(currentRowIndex) + parseInt(rowAdd) >= 0 && currentRowIndex <= dataItems.length - 1 && dataItems[parseInt(currentRowIndex) + parseInt(rowAdd)]) {
                    var nextCell = dataItems[parseInt(currentRowIndex) + parseInt(rowAdd)].get_element().cells[cellIndex + parseInt(colAdd)];
                    if (nextCell.className.indexOf("LockCell") < 0)
                        batchManager.openCellForEdit(nextCell);
                    // else batchManager._tryCloseEdits(grid.get_masterTableView());
                } else {
                    batchManager._tryCloseEdits(grid.get_masterTableView());
                }
            }

            if (ev.preventDefault) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            else {
                ev.cancelBubble = true;
                event.returnValue = false;
            }
        }
    } catch (ex) { }
}
function keyDownRadgridFloat(sender, ev) {
    try {
        if (ev.keyCode == "13" || ev.keyCode == "37" || ev.keyCode == "38" || ev.keyCode == "39" || ev.keyCode == "40") {
            var grid = $find(sender.id);
            var dataItems = grid.get_masterTableView().get_dataItems();
            var batchManager = grid.get_batchEditingManager();
            var currentCell = batchManager.get_currentlyEditedCell();
            if (currentCell) {
                var cellIndex = currentCell.cellIndex;
                var currentDataItem = $find(currentCell.parentElement.id);
                var currentRowIndex = currentDataItem.get_itemIndexHierarchical();

                var rowAdd = 1;
                var colAdd = 0;
                if (ev.keyCode == "37") {
                    rowAdd = 0;
                    colAdd = -1;
                }
                else if (ev.keyCode == "38") {
                    rowAdd = -1;
                    colAdd = 0;
                }
                else if (ev.keyCode == "39") {
                    rowAdd = 0;
                    colAdd = 1;
                }
                if (parseFloat(cellIndex) + parseFloat(colAdd) >= 0 && parseFloat(currentRowIndex) + parseFloat(rowAdd) >= 0 && currentRowIndex <= dataItems.length - 1 && dataItems[parseFloat(currentRowIndex) + parseFloat(rowAdd)]) {
                    var nextCell = dataItems[parseFloat(currentRowIndex) + parseFloat(rowAdd)].get_element().cells[cellIndex + parseFloat(colAdd)];
                    if (nextCell.className.indexOf("LockCell") < 0)
                        batchManager.openCellForEdit(nextCell);
                } else {
                    batchManager._tryCloseEdits(grid.get_masterTableView());
                }
            }

            if (ev.preventDefault) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            else {
                ev.cancelBubble = true;
                event.returnValue = false;
            }
        }
    } catch (ex) { }
}
function OpenCell(rowAdd, colAdd, grid) {
    var dataItems = grid.get_masterTableView().get_dataItems();
    var batchManager = grid.get_batchEditingManager();
    var currentCell = batchManager.get_currentlyEditedCell();
    if (currentCell) {
        var cellIndex = currentCell.cellIndex;
        var currentDataItem = $find(currentCell.parentElement.id);
        var currentRowIndex = currentDataItem.get_itemIndexHierarchical();
        if (parseInt(cellIndex) + parseInt(colAdd) >= 0 && parseInt(currentRowIndex) + parseInt(rowAdd) >= 0 && currentRowIndex <= dataItems.length - 1 && dataItems[parseInt(currentRowIndex) + parseInt(rowAdd)]) {
            var nextCell = dataItems[parseInt(currentRowIndex) + parseInt(rowAdd)].get_element().cells[cellIndex + parseInt(colAdd)];
            batchManager.openCellForEdit(nextCell);
        } else {
            batchManager._tryCloseEdits(grid.get_masterTableView());
        }
    }
}
function ProcessCellValue(cell, type, grid) {
    try {
        if (cell != null) {
            var cval;
            switch (type) {
                case "Diem10":
                    cval = ChangeValidValue0_10(cell.value);
                    break;
                case "DiemCD":
                    cval = ChangeValidValueD_CD(cell.value);
                    break;
                case "HocLuc":
                    cval = ChangeValidValueHocLuc(cell.value);
                    break;
                case "HanhKiem":
                    cval = ChangeValidValueHanhKiem(cell.value);
                    break;
                case "DanhGiaKetQuaRenLuyen":
                    cval = ChangeValidValueRenLuyenTT22SuaDoi(cell.value);
                    break;
                case "KetQuaHocTap":
                    cval = ChangeValidValueKetQuaHocTapTT22SuaDoi(cell.value);
                    break;
                case "DanhHieu":
                    cval = ChangeValidValueDanhHieu(cell.value);
                    break;
                case "SoNguyen":
                    var IsCoKhong = cell.getAttribute('iscokhong');
                    var IsSTC = cell.getAttribute('isrtc');
                    if (!isNaN(IsCoKhong) && IsCoKhong != null && IsCoKhong == "1") {
                        cval = ChangeValidValueC_K(cell.value);
                    } else if (!isNaN(IsSTC) && IsSTC != null && IsSTC == "1") {
                        cval = ChangeValidValueRTC(cell.value);
                    }
                    else {
                        cval = NhapSo(cell.value);
                    }
                    break;
                case "NhapSo":
                    var IsCoKhong = cell.getAttribute('iscokhong');
                    var IsSTC = cell.getAttribute('isrtc');
                    if (!isNaN(IsCoKhong) && IsCoKhong != null && IsCoKhong == "1") {
                        cval = ChangeValidValueC_K(cell.value);
                    } else if (!isNaN(IsSTC) && IsSTC != null && IsSTC == "1") {
                        cval = ChangeValidValueRTC(cell.value);
                    }
                    else {
                        cval = NhapSo(cell.value);
                    }
                    break;
                case "CoKhong":
                    cval = ChangeValidValueC_K(cell.value);
                    break;
                default: cval = cell.value;
                    break;

            }
            if (cval != cell.value || NeedJump == true) { cell.value = cval; NeedJump = true; }
            if (cval == '') NeedJump = false;
            if (NeedJump) {
                if (is_jump_col == "1" || is_jump_col == 1)
                    OpenCell(1, 0, grid);
                else OpenCell(0, 1, grid);
            }
        }
        NeedJump = false;
    }
    catch (ex) { }
}
function tongListRow(rowSum, arrayRow, arrayCol, rows, batchManager) {
    try {
        var arrayTong = [];
        for (var i = 0; i < arrayRow.length; i++) {
            var rowItem = rows[arrayRow[i]];
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowItem.get_cell(arrayCol[j]);
                var valueCell = parseInt(batchManager.getCellValue(cell)); if (isNaN(valueCell)) valueCell = 0;
                if (isNaN(arrayTong[j])) arrayTong[j] = parseInt(valueCell);
                else
                    arrayTong[j] += parseInt(valueCell);
            }
        }
        var rowTong = rows[rowSum];

        for (var j = 0; j < arrayCol.length; j++) {
            var cell = rowTong.get_cell(arrayCol[j]);
            var valueCell = parseInt(batchManager.getCellValue(cell)); if (isNaN(valueCell)) valueCell = 0;
            if (valueCell != arrayTong[j]) batchManager.changeCellValue(cell, arrayTong[j]);
        }

    } catch (ex) {
        console.log(ex);
    }
}
function tongListRowFloat(rowSum, arrayRow, arrayCol, rows, batchManager) {
    try {
        var arrayTong = [];
        for (var i = 0; i < arrayRow.length; i++) {
            var rowItem = rows[arrayRow[i]];
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowItem.get_cell(arrayCol[j]);
                var valueCell = parseFloat(batchManager.getCellValue(cell));
                if (isNaN(valueCell))
                    valueCell = 0;
                if (isNaN(arrayTong[j]))
                    arrayTong[j] = parseFloat(valueCell);
                else
                    arrayTong[j] += parseFloat(valueCell);
            }
        }
        var rowTong = rows[rowSum];

        for (var j = 0; j < arrayCol.length; j++) {
            var cell = rowTong.get_cell(arrayCol[j]);
            var valueCell = parseFloat(batchManager.getCellValue(cell));
            if (isNaN(valueCell))
                valueCell = 0;
            if (valueCell != arrayTong[j])
                batchManager.changeCellValue(cell, arrayTong[j]);
        }

    } catch (ex) {
        console.log(ex);
    }
}
function tongDoan(rowStart, rowEnd, arrayCol, rows, batchManager, is_tong_top, is_tong_ngang) {
    try {
        if (isNaN(is_tong_ngang)) is_tong_ngang = 1;
        var arrayTong = [];
        for (var i = rowStart; i <= rowEnd; i++) {
            var rowItem = rows[i];
            var arrayValueCel = [];
            var SumNgang = 0;
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowItem.get_cell(arrayCol[j]);
                var valueCell = parseInt(batchManager.getCellValue(cell)); if (isNaN(valueCell)) valueCell = 0;
                arrayValueCel[j] = valueCell;

                if (j > 0) {
                    SumNgang += parseInt(arrayValueCel[j]);
                    if (isNaN(arrayTong[j])) arrayTong[j] = parseInt(arrayValueCel[j]);
                    else
                        arrayTong[j] += parseInt(arrayValueCel[j]);
                }

            }
            var cellTg = rowItem.get_cell(arrayCol[0]);
            var valueCellTg = parseInt(batchManager.getCellValue(cellTg)); if (isNaN(valueCellTg)) valueCellTg = 0;
            if (is_tong_ngang == 1) {
                if (SumNgang != valueCellTg) {
                    batchManager.changeCellValue(cellTg, SumNgang);
                }
                if (isNaN(arrayTong[0])) arrayTong[0] = SumNgang;
                else
                    arrayTong[0] += SumNgang;
            } else {
                if (isNaN(arrayTong[0])) arrayTong[0] = valueCellTg;
                else
                    arrayTong[0] += valueCellTg;
            }
        }
        if (is_tong_top == 1) {
            var rowTong = rows[rowStart - 1];
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowTong.get_cell(arrayCol[j]);
                var valueCell = parseInt(batchManager.getCellValue(cell)); if (isNaN(valueCell)) valueCell = 0;
                if (valueCell != arrayTong[j]) batchManager.changeCellValue(cell, arrayTong[j]);
            }
        }
    } catch (ex) {
        console.log(ex);
    }

}

var checkDoan = {
    kiemTraDuLieu: function (arrCheck, arrayCol, rows, batchManager) {
        for (var i = 0; i < arrCheck.length; i++) {
            var items = this.getArrTongAll(arrCheck[i].item, arrayCol, rows, batchManager);
            var checks = this.getDataCheckClumn(items[0].tongCot, items[1].tongCot);
            arrCheck[i].item = items;
            arrCheck[i].check = checks;
            arrCheck[i].checkStr = this.getDataCheckClumnStr(checks);
        }

        var obj = $('<div></div>');
        var check = false;
        for (var i = 0; i < arrCheck.length; i++) {
            if (arrCheck[i].checkStr.length > 0) {
                var objParent = $('<div class="itemMes"></div>');
                objParent.append('<b>+ ' + arrCheck[i].name + ':</b><br>')
                if (arrCheck[i].checkStr.length > 0) {
                    var data = arrCheck[i].checkStr;
                    for (var j = 0; j < data.length; j++) {
                        objParent.append('<span>&nbsp;&nbsp;&nbsp;&nbsp;- Tổng số của dòng: Chia theo nguồn và chia theo nhóm chi của cột <b>' + data[j] + '</b> chưa bằng nhau.</span><br>')
                    }
                }
                obj.append(objParent);
                check = true;
            }
        }
        return { status: check, mes: obj }
    },
    getDataCheckClumn: function (arr1, arr2) {
        var result = [];
        result[0] = this.checkClumnItem(arr1[0], arr2[0]);
        result[1] = this.checkClumnItem(arr1[1], arr2[1]);
        result[2] = this.checkClumnItem(arr1[2], arr2[2]);
        return result;
    },
    getDataCheckClumnStr: function (arr) {
        result = [];
        if (arr[0] === true)
            result.push('Quyết toán');
        if (arr[1] === true)
            result.push('Dự toán')
        if (arr[2] === true)
            result.push('Ước thực hiện')
        if (result.length > 0)
            return result;
        else
            return [];
    },
    checkClumnItem: function (value1, value2) {
        if (value1 > 0 || value2 > 0) {
            if (roundFloat(value1) == roundFloat(value2)) {
                return false;
            } else {
                return true;
            }
        } else {
            return 'noCheck';
        }
    },
    getArrTongAll: function (items, arrayCol, rows, batchManager) {
        for (var i = 0; i < items.length; i++) {
            items[i].tongCot = this.getTongCotItem(items[i].rowStart, items[i].rowEnd, arrayCol, rows, batchManager);
        }
        return items;
    },
    getTongCotItem: function (rowStart, rowEnd, arrayCol, rows, batchManager) {
        try {
            var arrayTong = [];
            for (var i = rowStart; i <= rowEnd; i++) {
                var arrayValueCel = [];
                for (var j = 0; j < arrayCol.length; j++) {
                    var valueCell = this.getCellValue(i, arrayCol[j], rows, batchManager);
                    arrayValueCel[j] = valueCell;
                    if (j > 0) {
                        if (isNaN(arrayTong[j])) arrayTong[j] = parseFloat(arrayValueCel[j]);
                        else
                            arrayTong[j] += parseFloat(arrayValueCel[j]);
                    }
                }
                var valueCellTg = this.getCellValue(i, arrayCol[0], rows, batchManager);
                if (isNaN(arrayTong[0])) arrayTong[0] = valueCellTg;
                else
                    arrayTong[0] += valueCellTg;
            }
            return arrayTong;
        } catch (ex) {
            console.log(ex);
        }
    },
    getCellValue: function (indexRow, keyCol, rows, batchManager) {
        var rowItem = rows[indexRow];
        var cellItem = rowItem.get_cell(keyCol);
        var cellItemValue = parseFloat(changeStrFloat(batchManager.getCellValue(cellItem)));
        if (isNaN(cellItemValue))
            cellItemValue = 0;
        return cellItemValue;
    }
}


function tongDoanFloat(rowStart, rowEnd, arrayCol, rows, batchManager, is_tong_top, is_tong_ngang) {
    try {
        if (isNaN(is_tong_ngang)) is_tong_ngang = 1;
        var arrayTong = [];
        for (var i = rowStart; i <= rowEnd; i++) {
            var rowItem = rows[i];
            var arrayValueCel = [];
            var SumNgang = 0;
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowItem.get_cell(arrayCol[j]);
                var valueCell = parseFloat(changeStrFloat(batchManager.getCellValue(cell))); if (isNaN(valueCell)) valueCell = 0;
                arrayValueCel[j] = valueCell;

                if (j > 0) {
                    SumNgang += parseFloat(arrayValueCel[j]);
                    if (isNaN(arrayTong[j])) arrayTong[j] = parseFloat(arrayValueCel[j]);
                    else
                        arrayTong[j] += parseFloat(arrayValueCel[j]);
                }

            }
            var cellTg = rowItem.get_cell(arrayCol[0]);
            var valueCellTg = parseFloat(changeStrFloat(batchManager.getCellValue(cellTg))); if (isNaN(valueCellTg)) valueCellTg = 0;
            if (is_tong_ngang == 1) {
                if (SumNgang != valueCellTg && SumNgang > 0) {
                    batchManager.changeCellValue(cellTg, SumNgang);
                }
                if (isNaN(arrayTong[0])) arrayTong[0] = SumNgang;
                else
                    arrayTong[0] += SumNgang;
            } else {
                if (isNaN(arrayTong[0])) arrayTong[0] = valueCellTg;
                else
                    arrayTong[0] += valueCellTg;
            }
        }
        if (is_tong_top == 1) {
            var rowTong = rows[rowStart - 1];
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowTong.get_cell(arrayCol[j]);
                var valueCell = parseFloat(changeStrFloat(batchManager.getCellValue(cell))); if (isNaN(valueCell)) valueCell = 0;
                if (valueCell != arrayTong[j]) batchManager.changeCellValue(cell, arrayTong[j] > 0 ? roundFloat(arrayTong[j]) : '');
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}

function tongListRowFloat(rowSum, arrayRow, arrayCol, rows, batchManager) {
    try {
        var arrayTong = [];
        for (var j = 0; j < arrayCol.length; j++) {
            var valueCellFirst = 0;
            var check = true;
            for (var i = 0; i < arrayRow.length; i++) {
                var rowItem = rows[arrayRow[i]];
                var cell = rowItem.get_cell(arrayCol[j]);
                var a = batchManager.getCellValue(cell);
                console.log(a);
                var valueCell = parseFloat(a);
                if (isNaN(valueCell)) valueCell = 0;

                if (i == 0)
                    valueCellFirst = valueCell;

                if (valueCell <= 0 || valueCellFirst <= 0) {
                    check = false;
                    break;
                } else if (i > 0) {
                    if (valueCell != valueCellFirst) {
                        check = false;
                        break;
                    }
                }
            }
            if (check) {
                arrayTong[j] = valueCellFirst;
            } else {
                arrayTong[j] = 0;
            }
        }

        var rowTong = rows[rowSum];

        for (var j = 0; j < arrayCol.length; j++) {
            var cell = rowTong.get_cell(arrayCol[j]);
            var valueCell = parseFloat(changeStrFloat(batchManager.getCellValue(cell))); if (isNaN(valueCell)) valueCell = 0;
            if (valueCell != arrayTong[j])
                if (arrayTong[j] > 0) {
                    batchManager.changeCellValue(cell, roundFloat(arrayTong[j]));
                } else {
                    batchManager.changeCellValue(cell, '');
                }
        }

    } catch (ex) {
        console.log(ex);
    }
}

function tongAllListRowFloat(rowSum, arrayRow, arrayCol, rows, batchManager) {
    try {
        var arrayTong = [];
        for (var i = 0; i < arrayRow.length; i++) {
            var rowItem = rows[arrayRow[i]];
            for (var j = 0; j < arrayCol.length; j++) {
                var cell = rowItem.get_cell(arrayCol[j]);
                var valueCell = parseFloat(changeStrFloat(batchManager.getCellValue(cell))); if (isNaN(valueCell)) valueCell = 0;
                if (isNaN(arrayTong[j])) arrayTong[j] = parseFloat(valueCell);
                else
                    arrayTong[j] += parseFloat(valueCell);
            }
        }
        var rowTong = rows[rowSum];

        for (var j = 0; j < arrayCol.length; j++) {
            var cell = rowTong.get_cell(arrayCol[j]);
            var valueCell = parseFloat(changeStrFloat(batchManager.getCellValue(cell))); if (isNaN(valueCell)) valueCell = 0;
            if (valueCell != arrayTong[j]) {
                batchManager.changeCellValue(cell, arrayTong[j] > 0 ? roundFloat(arrayTong[j]) : '');
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}

function changeStrFloat(str) {
    str = str.toString().replace(".", "");
    str = str.toString().replace(",", ".");
    return str;
}

function roundFloat(x) {
    var n = parseFloat(x);
    x = Math.round(n * 1000) / 1000;
    return x;
}

var cardCell;
function lockCell(grid, arrayCell) {
    try {
        var masterTable = grid.get_masterTableView();
        var rows = masterTable.get_dataItems();
        for (var i = 0; i < arrayCell.length; i++) {
            var lockcellItem = arrayCell[i];
            var rowItem = rows[lockcellItem.row];
            cardCell = rowItem.get_cell(lockcellItem.unique);
            var str = cardCell.className + '';
            str = str.replace('LockCell', '');
            cardCell.className = str + " LockCell";
        }
    } catch (ex) { }
}
function lockRow(grid, indexRow) {
    try {
        var masterTable = grid.get_masterTableView();
        var rows = masterTable.get_dataItems();
        var columns = masterTable.get_columns();
        var rowItem = rows[indexRow];
        for (var i = 0; i < columns.length; i++) {
            cardCell = rowItem.get_cell(columns[i].get_uniqueName());
            var str = cardCell.className + '';
            str = str.replace('LockCell', '');
            cardCell.className = str + " LockCell";
        }
    } catch (ex) { }
}
function openRadWin(url, sub_w, sub_h) {
    var viewportwidth;
    var viewportheight;
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth,
            viewportheight = window.innerHeight;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth, viewportheight = document.documentElement.clientHeight;
    } else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
            viewportheight = document.getElementsByTagName('body')[0].clientHeight;
    }
    if (viewportwidth > 1280)
        viewportwidth = viewportwidth - sub_w;
    radopen(url, "RadWindow1", viewportwidth, viewportheight - sub_h);
}
var fillterHelper = {
    showExtend: function (e, i) {
        if ($(i).text() == 'Mở rộng tìm kiếm') {
            $(e).show();
            $(i).html('Thu nhỏ tìm kiếm');
        }
        else {
            $(e).hide();
            $(i).html('Mở rộng tìm kiếm');
        }
        SetGridHeight();
    },
    closedWhenSearch: function () {
        $(".extend_fillter").hide();
        $(".extend_btn").html("Mở rộng tìm kiếm");
        SetGridHeight();
    }
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function OnClientBlurHandlerValidCombobox(sender, eventArgs) {
    var textInTheCombo = sender.get_text();
    if (textInTheCombo != '') {
        var item = sender.findItemByText(textInTheCombo);
        if (!item) {
            sender.clearSelection();
            sender.set_text("");
            alert('Giá trị không hợp lệ!');
        }
    }
}
function validRadDatePicker(sender, eventArgs) {
    eventArgs.set_cancel(true);
    alert("Thông tin không hợp lệ");
}

function ShowImageOverLayWithImage(image) {
    if (image) {
        var imageSource = $(image).attr('src');
        ShowImageOverLayWithUrl(imageSource);
    }
}
function ShowImageOverLayWithUrl(url) {
    $('#modalOverlay').show();
    $('#modalOverlay #imgOverlay').attr("src", url);
}
function hideBannerAndMenu() {
    try {
        $("#qi-banner").css('display', 'none');
        $("#qi-main-menu").css('display', 'none');
    } catch (ex) { }
}


function setCssTotalRadGrid(radGrid, uniqueName, text) {
    var masterTable = $find(radGrid).get_masterTableView();
    var count = masterTable.get_dataItems().length;
    for (var i = 0; i < count; i++) {
        var item = masterTable.getCellByColumnUniqueName(masterTable.get_dataItems()[i], uniqueName);
        if (item != null) {
            var item_val = item.innerHTML.trim();
            if (item_val != '') {
                var temp = removeTags(item_val);
                var areEqual = temp.toUpperCase() === text.toUpperCase();
                if (areEqual) {
                    masterTable.get_dataItems()[i].addCssClass("gridTotalRow");
                }
            }
        }
    }
}
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

function addClasscoMaSo() {
    if ($("div.label-wrapper").find(".n-index").length > 0) {
        $("div.label-wrapper").find(".n-index").prev(".control-label").addClass("coMaSo");
        $("div.label-wrapper").find(".n-index").parent().prev(".control-label").addClass("coMaSo");
    }

    if ($("div.label-wrapper").find(".n-index-child").length > 0) {
        $("div.label-wrapper").find(".n-index-child").prev(".control-label").addClass("coMaSo");
        $("div.label-wrapper").find(".n-index-child").parent().prev(".control-label").addClass("coMaSo");
    }
}

function setPaddingCellKhongHoc() {
    $(".rgDataDiv table.rgMasterTable tbody tr td").each(function (index) {
        var that = $(this);
        if (that.has("span.cellKhongHoc")) {
            that.addClass("cellKhongHocTd");
        }
    });
}

var note = {
    el: ".bt-mo-note",
    elCloseNote: ".closeNote",
    textCloseNote: "[Đóng ghi chú]",
    textToolTip: "Ẩn hiện Hướng dẫn/ Ghi chú",
    elToolTip: $(''),
    addTextCloseNote: function (text) {
        $(this.elCloseNote).html(this.textCloseNote);
    },
    addToolTip: function () {
        $(this.el).html(this.elToolTip);
    },
    init: function () {
        this.addTextCloseNote();
        this.addToolTip();
    },
    openCloseNote(obj) {
        var that = obj;
        var style = '';
        try { style = $('.rgHeaderDiv')[0].style.cssText; } catch (ex) { }
        if ($(that).attr('class') == 'bt-mo-note') {
            try { $(".noteContent").css('display', 'none'); } catch (ex) { }
            $(that).addClass('bt-dong-note').removeClass('bt-mo-note');
        }
        else {
            try { $(".noteContent").css('display', 'block'); } catch (ex) { }
            $(that).addClass('bt-mo-note').removeClass('bt-dong-note');
        }
        SetGridHeight();
        RepaintGrid();
        if (style !== '') {
            try {
                $('.rgHeaderDiv')[0].style.cssText = style;
            } catch (ex) {

            }
        }

    },
    closeNote: function () {
        $("div.noteContent").hide();
        $(".bt-mo-note").addClass('bt-dong-note').removeClass('bt-mo-note');
        $(".tooltiptext").css("visibility", "visible");
        setTimeout(function () {
            $(".tooltiptext").css("visibility", "hidden");
        }, 2500);
        SetGridHeight();
        RepaintGrid();
    }
}

function dongGhiChu() {
    $("div.noteContent").hide();
    $(".bt-mo-note").addClass('bt-dong-note').removeClass('bt-mo-note');
    $(".tooltiptext").css("visibility", "visible");
    setTimeout(function () {
        $(".tooltiptext").css("visibility", "hidden");
    }, 2500);
    SetGridHeight();
}


function hienThiGhiChu() {
    try { $(".noteContent").css('display', 'block'); } catch (ex) { }
}
function totalListRowFloat(rowSum, arrayRow, arrayCol, rows, batchManager) {
    try {
        var tong = 0;
        for (var i = 0; i < arrayRow.length - 1; i++) {
            var rowItem = rows[arrayRow[i]];
            var cell = rowItem.get_cell(arrayCol[0]);
            var a = batchManager.getCellValue(cell);
            var valueCell = parseFloat(a);
            if (isNaN(valueCell)) valueCell = 0;
            else {
                tong += valueCell;
            }
        }

        var rowTong = rows[rowSum];

        var cell = rowTong.get_cell(arrayCol[0]);
        var b = batchManager.getCellValue(cell);
        var c = parseFloat(changeStrFloat(b));
        var valueCell = c; if (isNaN(valueCell)) valueCell = 0;
        batchManager.changeCellValue(cell, tong);
    } catch (ex) {
        console.log(ex);
    }
}
$(document).ready(function () {
    if ($(note.el).length > 0) {
        note.init();
        $(note.el).bind("click", function () {
            note.openCloseNote(this);
        });
        $(note.elCloseNote).bind("click", function () {
            note.closeNote(this);
        });
    }
    var messageContent = $("#qi-panel-message .messageContent");
    var messageContentText = $("#qi-panel-message .messageContent span").text().trim();
    if (typeof messageContentText == 'undefined' || messageContentText == "") {
        //messageContent.addClass("messageNotContent").removeClass("messageContent");
        messageContent.addClass("messageNotContent");
    } else {
        messageContent.removeClass("messageNotContent");
    }

    var qiPanelSearch = $("#qi-panel-search");
    var qiPanelSearchText = qiPanelSearch.text().trim();
    if (typeof qiPanelSearchText == 'undefined' || qiPanelSearchText == "") {
        qiPanelSearch.addClass("qiPanelSearchNotContent");
    }

    var qiPanelNote = $("#qi-panel-note .noteContent");
    var qiPanelNoteUl = $("#qi-panel-note ul.listNote");
    var qiPanelNoteText = qiPanelNoteUl.text().trim();
    if (typeof qiPanelNoteText == 'undefined' || qiPanelNoteText == "") {
        qiPanelNote.addClass("noteNotContent");
    } else {
        qiPanelNote.removeClass("noteNotContent");
    }

    if ($("div.label-wrapper").find(".n-index").length > 0) {
        $("div.label-wrapper").find(".n-index").prev(".control-label").addClass("coMaSo");
        $("div.label-wrapper").find(".n-index").parent().prev(".control-label").addClass("coMaSo");
    }

    if ($("div.label-wrapper").find(".n-index-child").length > 0) {
        $("div.label-wrapper").find(".n-index-child").prev(".control-label").addClass("coMaSo");
        $("div.label-wrapper").find(".n-index-child").parent().prev(".control-label").addClass("coMaSo");
    }
});

function HideAllButtonControl() {
    console.log('HideAllButtonControl');

    $("input[type='button']").each(function (btn) {
        $(this).hide();
        $(this).css("display", "none !important");
    })
    $("input[type='submit']").each(function (btn) {
        $(this).hide();
        $(this).css("display", "none !important");
    })

    // notification
    if (notification)
        notification('information', 'Dữ liệu đã khóa để tạm thời nâng cấp hệ thống');
}