$(document).ready(function () {

  // close and open sidebar 
  $("#sidebar_collaps").on("click", function () {
    $(this).toggleClass("fa-xmark");
    $(this).toggleClass("fa-bars");
    $(".sidebar").toggleClass("open");
  });

  // function for all inputs vaildation 
  function validateinputs(input, regex, alertelement) {
    let vaild = false;
    if (regex.test($(input).val())) {
      $(alertelement).slideUp();
      vaild = true;
    } else {
      $(alertelement).slideDown();
      vaild = false;
    }
    return vaild;
  }

  // function to check if password match or equel
  function passwordmatch(input1, input2, alertelement) {
    let vaild = false;
    if ($(input1).val() == $(input2).val()) {
      $(alertelement).slideUp();
      vaild = true;
    } else {
      $(alertelement).slideDown();
      vaild = false;
    }
    return vaild;
  }

  // vaildation for inputs 
  $("#user_name").on("keyup", function () {
    validateinputs(this, /^[a-zA-Z ]{4,20}$/, "#user_name_alert");
  })
  $("#user_email").on("keyup", function () {
    validateinputs(this, /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "#user_email_alert");
  })
  $("#user_phone").on("keyup", function () {
    validateinputs(this, /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "#user_phone_alert");
  })
  $("#user_age").on("keyup", function () {
    validateinputs(this, /^\S[0-9]{1,2}$/, "#user_age_alert");
  })
  $("#user_password").on("keyup", function () {
    validateinputs(this, /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "#user_password_alert");
  })
  $("#user_re_password").on("keyup", function () {
    passwordmatch("#user_password", this, "#user_re_password_alert");
  })

  // if check when user click on submit form (if there data or not)
  $("#btn_submit").on("click", function (e) {
    if (validateinputs("#user_name", /^[a-zA-Z ]{4,20}$/, "#user_name_alert")
      && validateinputs("#user_email", /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "#user_email_alert")
      && validateinputs("#user_phone", /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/, "#user_phone_alert")
      && validateinputs("#user_age", /^\S[0-9]{1,2}$/, "#user_age_alert")
      && validateinputs("#user_password", /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "#user_password_alert")
      && passwordmatch("#user_password", "#user_re_password", "#user_re_password_alert")
    ) { } else { e.preventDefault(); }
  });

  // function to get data from api url 
  let api_data_results;
  async function get_movie(movie_kind = "movie/now_playing") {
    let api_url = await fetch(`https://api.themoviedb.org/3/${movie_kind}?api_key=f708973a9ad44b00b93dd5ac49f93aa2&language=en-US&page=1`);
    let api_url_data = await api_url.json();
    api_url_data_results = await api_url_data.results;
    display_movies(api_url_data_results);
    api_data_results = [];
    api_data_results.push( ...api_url_data_results);
  }
  get_movie();

  // function to display data after fetch finish
  function display_movies(array) {
    let cartona = "";
    for (let i = 0; i < array.length; i++) {
      cartona += `<div class="col-md-6 col-lg-4">
      <div class="movie-box rounded-3 overflow-hidden position-relative">
        <div class="img-lay"><img src="${(array[i].poster_path != undefined) ? "https://image.tmdb.org/t/p/w500/" + array[i].poster_path : "img/error-poster.jpg"}" alt="movie-photo" class="w-100"></div>
        <div class="movie-info-lay text-center">
          <h3 class="my-4">${array[i].title}</h3>
          <p class="movie-overview mb-4">${array[i].overview}</p>
          <p>rate : ${array[i].vote_average}</p>
          <p class="m-0">${array[i].release_date}</p>
        </div>
      </div>
    </div>`
    }
    $(".loader").css({ display: "none" });
    $("#movie_data").html(cartona);
  }

  // when user click on sidebar links data change 
  $(".movie_kind").on("click", function () {
    let movie_kind = $(this).attr("data-fetch");
    $(".loader").css({ display: "block" });
    $("#movie_data").empty();
    get_movie(movie_kind);
    $(this).addClass("active").siblings().removeClass("active");
  });

  // search on any movie when user type on input
  $("#an_movie_se").on("keyup", async function () {
    let input_value = $(this).val();
    if (input_value.length != 0) {
      let api_url = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f708973a9ad44b00b93dd5ac49f93aa2&language=en-US&query=${input_value}&page=1&include_adult=false`);
      let api_url_data = await api_url.json();
      api_url_data_results = await api_url_data.results;
      api_data_results = [];
      api_data_results.push( ...api_url_data_results);
      if (api_url_data_results.length != 0) {
        display_movies(api_url_data_results);
      }
    } else {
      get_movie();
    }
  });

  // filter movies from array and display it
  $("#movie_se").on("keyup", function () {
    let movie_search = $(this).val().toLowerCase();
    let search_cartona = "";
    for (let i = 0; i < api_data_results.length; i++) {
      if (api_data_results[i].title.toLowerCase().includes(movie_search)) {
        search_cartona += `<div class="col-md-6 col-lg-4">
              <div class="movie-box rounded-3 overflow-hidden position-relative">
                <div class="img-lay"><img src="${(api_data_results[i].poster_path != undefined) ? "https://image.tmdb.org/t/p/w500/" + api_data_results[i].poster_path : "img/error-poster.jpg"}" alt="movie-photo" class="w-100"></div>
                <div class="movie-info-lay text-center">
                  <h3 class="my-4">${api_data_results[i].title}</h3>
                  <p class="movie-overview mb-4">${api_data_results[i].overview}</p>
                  <p>rate : ${api_data_results[i].vote_average}</p>
                  <p class="m-0">${api_data_results[i].release_date}</p>
                </div>
              </div>
            </div>`
      }
    }
    $("#movie_data").html(search_cartona);
  });
});