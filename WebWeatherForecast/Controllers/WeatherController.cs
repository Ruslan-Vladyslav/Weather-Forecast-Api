using Microsoft.AspNetCore.Mvc;
using WebWeatherForecast.Models;
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
                return StatusCode(500, "Forecast not found for this city");

            return Json(result);
        }

        [HttpGet("Weather/WeatherDetailDays")]
        public async Task<IActionResult> GetForecast([FromQuery] string city)
        {
            if (string.IsNullOrWhiteSpace(city))
                return BadRequest("City name is required.");

            var result = await _weatherService.GetDayForecastAsync(city);

            if (result == null)
                return NotFound("Forecast not found for this city");

            return Ok(result);
        }
    }
}
