namespace WebWeatherForecast.Models
{
    public class WeatherModel
    {
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Description { get; set; }
        public string? WeatherIcon { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public double Temp { get; set; }
        public double TempMin { get; set; }
        public double TempMax { get; set; }
        public double TempFeelsLike { get; set; }
        public int Humidity { get; set; }
    }
}
