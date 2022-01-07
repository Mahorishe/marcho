$(function(){
  $(".slider__inner").slick({
    dots: true,
    arrows: false,
    fade: true
  });

  $(".star-rank").rateYo({
    rating: 4.0,
    starWidth: "17px",
    normalFill: "#ccccce",
    ratedFill: "#ffc35b",
    readOnly: true
  });
});




