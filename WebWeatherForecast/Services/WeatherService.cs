
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using WebWeatherForecast.Models;

namespace WebWeatherForecast.Services
{

    public class WeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey; // Set your own openweather api key

        public WeatherService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenWeatherApi:ApiKey"]!;
        }

        public async Task<WeatherModel> GetWeatherAsync(string city)
        {
            var url = $"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={_apiKey}&units=metric";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null!;

            var stream = await response.Content.ReadAsStreamAsync();
            using var json = await JsonDocument.ParseAsync(stream);
            var root = json.RootElement;

            return new WeatherModel
            {
                City = root.GetProperty("name").GetString(),
                Country = root.GetProperty("sys").GetProperty("country").GetString(),
                Lat = root.GetProperty("coord").GetProperty("lat").GetDouble(),
                Lon = root.GetProperty("coord").GetProperty("lon").GetDouble(),
                Description = root.GetProperty("weather")[0].GetProperty("description").GetString(),
                WeatherIcon = root.GetProperty("weather")[0].GetProperty("icon").GetString(),
                Temp = root.GetProperty("main").GetProperty("temp").GetDouble(),
                TempMin = root.GetProperty("main").GetProperty("temp_min").GetDouble(),
                TempMax = root.GetProperty("main").GetProperty("temp_max").GetDouble(),
                TempFeelsLike = root.GetProperty("main").GetProperty("feels_like").GetDouble(),

                 Details = new WeatherDetailModel
                 {
                     Humidity = root.GetProperty("main").GetProperty("humidity").GetInt32(),
                     WindSpeed = root.GetProperty("wind").GetProperty("speed").GetDouble(),
                     WindDegree = root.GetProperty("wind").GetProperty("deg").GetInt32(),
                     Pressure = root.GetProperty("main").GetProperty("pressure").GetInt32(),
                     Cloudiness = root.GetProperty("clouds").GetProperty("all").GetInt32()
                 }
            };
        }

        public async Task<WeatherForecastResponseModel?> GetDayForecastAsync(string city)
        {
            var url = $"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={_apiKey}&units=metric&lang=en";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<WeatherForecastResponseModel>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

    }

}
