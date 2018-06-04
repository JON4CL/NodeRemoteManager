function arrayBufferToString(buffer) {
    var byteArray = new Uint8Array(buffer);
    var str = "", cc = 0, numBytes = 0;
    for (var i = 0, len = byteArray.length; i < len; ++i) {
        var v = byteArray[i];
        if (numBytes > 0) {
            if ((cc & 192) === 192) {
                cc = (cc << 6) | (v & 63);
            } else {
                throw new Error("this is no tailing-byte");
            }
        } else if (v < 128) {
            numBytes = 1;
            cc = v;
        } else if (v < 192) {
            throw new Error("invalid byte, this is a tailing-byte");
        } else if (v < 224) {
            numBytes = 2;
            cc = v & 31;
        } else if (v < 240) {
            numBytes = 3;
            cc = v & 15;
        } else {
            throw new Error("invalid encoding, value out of range");
        }
        if (--numBytes === 0) {
            str += String.fromCharCode(cc);
        }
    }
    if (numBytes) {
        throw new Error("the bytes don't sum up");
    }
    return str;
}

//ENABLE MENU
$(function () {
    $('#side-menu').metisMenu();
});

//TRICK
//COLLAPSE MENU ON CLICK AN ITEM
$(document).on("click", ".nav a", function (event) {
    if ($('.navbar-toggle').is(':visible')) {
        $('.navbar-toggle').click();
    }
});

//TRICK
//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
//Sets the min-height of #page-wrapper to window size
$(function () {
    $(window).bind("load resize", function () {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1)
            height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function () {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});