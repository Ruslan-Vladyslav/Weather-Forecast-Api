namespace WebWeatherForecast.Models
{
    public class ForecastItemModel
    {
        public long Dt { get; set; }
        public MainInfoModel? Main { get; set; }
        public List<WeatherInfoModel>? Weather { get; set; }
        public WindInfoModel? Wind { get; set; }
        public CloudsInfoModel? Clouds { get; set; }
        public string? Dt_txt { get; set; }
    }

}
