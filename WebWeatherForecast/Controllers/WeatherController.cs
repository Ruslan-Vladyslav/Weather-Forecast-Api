using Microsoft.AspNetCore.Mvc;
using WebWeatherForecast.Services;

namespace WebWeatherForecast.Controllers
{
    public class WeatherController : Controller
    {
        private readonly ILogger<WeatherController> _logger;
        private readonly WeatherService _weatherService;

        public WeatherController(ILogger<WeatherController> logger, WeatherService weatherService)
        {
            _logger = logger;
            _weatherService = weatherService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("Weather/WeatherDetail")]
        public async Task<IActionResult> WeatherDetail(string city)
        {
            if (string.IsNullOrEmpty(city)) return BadRequest("City required");

            var result = await _weatherService.GetWeatherAsync(city);
            if (result == null)
                return StatusCode(500, "Error retrieving weather data");

            return Json(result);
        }
    }
}
