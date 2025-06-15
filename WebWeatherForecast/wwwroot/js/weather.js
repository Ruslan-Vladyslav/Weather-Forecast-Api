$(document).ready(function() {
    $("#btnSubmit").click(function() {
        var cityname = $("#txtCity").val().trim();
        if (!IsEmptyCity(cityname)) return;

        $.ajax({
            url: "/Home/WeatherDetail?city=" + cityname,
            type: "GET",
            success: function(data) {
                $("#forecastArea").show();
                $("#lblCity").text(data.city);
                $("#lblCountry").text(data.country);
                $("#lblLat").text(data.lat);
                $("#lblLon").text(data.lon);
                $("#lblDescription").text(data.description);
                $("#lblHumidity").text(data.humidity);
                $("#lblTempFeelsLike").html(data.tempFeelsLike + " &deg;C");
                $("#lblTemp").html(data.temp + " &deg;C");
                $("#lblTempMin").html(data.tempMin + " &deg;C");
                $("#lblTempMax").html(data.tempMax + " &deg;C");
                $("#imgWeatherIconUrl").attr("src", "https://openweathermap.org/img/w/" + data.weatherIcon + ".png");
            },
            error: function(xhr) {
                alert("Error: " + xhr.responseText);
                $("#forecastArea").hide();
            }
        });
    });
});

function IsEmptyCity(city) {
    if (city.length === 0) {
        alert("Please enter a city name.");
        return false;
    }
    return true;
}
