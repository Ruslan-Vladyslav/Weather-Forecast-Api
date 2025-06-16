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

        $.ajax({
            url: "/Weather/WeatherDetailDays?city=" + encodeURIComponent(cityname),
            type: "GET",
            success: function (data) {
                const today = new Date().toISOString().split("T")[0];
                const hourlyForecast = [];
                const dailyForecastMap = {};

                data.list.forEach(item => {
                    const dateTime = item.dt_txt;
                    const date = dateTime.split(" ")[0];
                    const time = dateTime.split(" ")[1].substring(0, 5);
                    const temp = item.main.temp.toFixed(1);
                    const desc = item.weather[0].description;
                    const icon = item.weather[0].icon;
                    const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

                    if (date === today) {
                        hourlyForecast.push(`
                            <div class="forecast-row">
                                <div class="forecast-time">${time}</div>
                                <div class="forecast-icon"><img src="${iconUrl}" width="50" height="50" /></div>
                                <div class="forecast-desc">${desc}</div>
                                <div class="forecast-temp">${temp} &deg;C</div>
                            </div>
                        `);
                    } else {
                        const hour = parseInt(time.split(":")[0]);
                        if (hour === 12 && !dailyForecastMap[date]) {
                            dailyForecastMap[date] = `
                            <div class="forecast-row d-flex align-items-center mb-3 p-3">
                                <div class="forecast-time flex-grow-1 fw-bold">${date}</div>
                                <div class="forecast-temp flex-grow-1">${temp} &deg;C</div>
                                <div class="forecast-desc flex-grow-3 text-capitalize">${desc}</div>
                                <div class="forecast-icon flex-grow-1"><img src="${iconUrl}" width="50" height="50" /></div>
                            </div>
                        `;
                        }
                    }
                });

                $("#forecastTodayBody").html(hourlyForecast.join(""));
                $("#forecastDailyBody").html(Object.values(dailyForecastMap).join(""));

                $("#forecastTodayArea").show();
                $("#forecastDailyArea").show();
            },
            error: function (xhr) {
                showToast(xhr.responseText || "Unexpected error occurred");
                $("#forecastTodayArea").hide();
                $("#forecastDailyArea").hide();
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
