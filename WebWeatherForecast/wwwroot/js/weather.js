$(document).ready(function() {
    $("#btnSubmit").click(function() {
        var cityname = $("#txtCity").val().trim();
        if (!IsEmptyCity(cityname)) return;

        $.ajax({
            url: "/Weather/WeatherDetail?city=" + cityname,
            type: "GET",
            success: function(data) {
                $("#forecastArea").show();
                $("#lblCity").text(data.city);
                $("#lblCountry").text(data.country);
                $("#lblLat").text(data.lat);
                $("#lblLon").text(data.lon);
                $("#lblDescription").text(data.description);
                $("#lblTempFeelsLike").html(data.tempFeelsLike + " &deg;C");
                $("#lblTemp").html(data.temp + " &deg;C");
                $("#imgWeatherIconUrl").attr("src", "https://openweathermap.org/img/wn/" + data.weatherIcon + "@2x.png");

                $("#lblHumidity").text(data.details.humidity);
                $("#lblWindSpeed").text(data.details.windSpeed + " m/s");
                $("#lblWindDegree").text(data.details.windDegree + "\u00B0");
                $("#lblPressure").text(data.details.pressure + " hPa");
                $("#lblCloudiness").text(data.details.cloudiness + " %");
            },
            error: function(xhr) {
                showToast(xhr.responseText || "Unexpected error occurred");
                $("#forecastArea").hide();
            }
        });
    });
});


function IsEmptyCity(city) {
    if (city.length === 0) {
        showToast("Please enter a city name");
        return false;
    }
    return true;
}

