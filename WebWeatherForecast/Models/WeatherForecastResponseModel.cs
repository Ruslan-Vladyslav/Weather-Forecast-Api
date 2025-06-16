namespace WebWeatherForecast.Models
{
    public class WeatherForecastResponseModel
    {
        public CityModel? City { get; set; }
        public List<ForecastItemModel>? List { get; set; }
    }
}
