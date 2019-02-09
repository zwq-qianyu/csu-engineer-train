function setHeight() {
    setTimeout(function()
    {
        console.log("set height")
        var heightContent = $("#content_body").height();

        if(heightContent>800){
            heightContent=heightContent+20;
        }
        $("#nav_main").animate({height:heightContent-70+"px"});
        // $("#nav_main").css("height", heightContent-70)
    }, 2000);


}