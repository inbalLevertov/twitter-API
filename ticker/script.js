(function() {
    var headlines = $("#headlines");
    var left = headlines.offset().left;
    var animId;

    $.ajax({
        url: "/data.json",
        method: "GET",
        success: function(response) {
            for (var i = 0; i < response.length; i++) {
                var title = response[i].title;
                var link = response[i].url;
                // var source = response[i].source;
                var a = `<a href="${link}">${title}</a>`;
                headlines.append(a);
            }
            moveHeadlines();
            mouseOverOut();
        },
        error: function() {
            console.log("something is wrong");
        }
    });

    function mouseOverOut() {
        $("a").on("mouseover", function(e) {
            cancelAnimationFrame(animId);
            console.log(animId);
            $(e.target).css({
                color: "green"
            });
        });
        $("a").on("mouseout", function(e) {
            moveHeadlines();
            $(e.target).css({
                color: "red"
            });
        });
    }

    function moveHeadlines() {
        left--;
        if (
            left <=
            -$("a")
                .eq(0)
                .outerWidth()
        ) {
            left =
                left +
                $("a")
                    .eq(0)
                    .outerWidth();
            headlines.append($("a").eq(0));
            //this doesnt work properally
            // console.log(links);
            console.log("left: ", left);
        }

        headlines.css({
            left: left + "px"
        });
        animId = requestAnimationFrame(moveHeadlines);
    }
})();
