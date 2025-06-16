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

                    const dateObj = new Date(date);
                    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

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
                                <div class="daily-forecast-row d-flex align-items-center justify-content-between mb-3 p-3">
                                    <div class="forecast-time fw-bold d-flex flex-column align-items-start" style="width: 150px;">
                                        <span>${weekday}</span>
                                        <span class="text-muted small">(${date})</span>
                                    </div>
                                    <div style="width: 30%;" class="d-flex align-items-center justify-content-center">
                                        <img src="${iconUrl}" width="50" height="50" class="me-2" />
                                        <span class="text-capitalize">${desc}</span>
                                    </div>
                                    <div style="width: 15%;" class="forecast-temp fw-bold">${temp} &deg;C</div>
                                    <div class="d-flex flex-column align-items-end" style="width: 20%;">
                                        <button class="btn btn-sm btn-primary show-details"
                                            data-date="${item.dt_txt}"
                                            data-temp="${item.main.temp}"
                                            data-feelslike="${item.main.feels_like}"
                                            data-pressure="${item.main.pressure}"
                                            data-humidity="${item.main.humidity}"
                                            data-wind-speed="${item.wind.speed}"
                                            data-wind-deg="${item.wind.deg}"
                                            data-clouds="${item.clouds.all}">
                                            Details
                                        </button>
                                    </div>
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

        // Modal window
        $(document).on("click", ".show-details", function () {
            const btn = $(this);
            const rawDate = btn.data("date");
            const datePart = rawDate.split(" ")[0];
            const dateObj = new Date(datePart);
            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

            $("#detail-date").text(datePart);
            $("#detail-weekday").text(weekday);
            $("#detail-temp").text(btn.data("temp"));
            $("#detail-feelslike").text(btn.data("feelslike"));
            $("#detail-pressure").text(btn.data("pressure"));
            $("#detail-humidity").text(btn.data("humidity"));
            $("#detail-wind").text(`${btn.data("wind-speed")} m/s, ${btn.data("wind-deg")}\u00B0`);
            $("#detail-clouds").text(btn.data("clouds"));

            const modal = new bootstrap.Modal(document.getElementById("dayDetailModal"));
            modal.show();
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
