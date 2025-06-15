using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WebWeatherForecast.Models;
using WebWeatherForecast.Services;

namespace WebWeatherForecast.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WeatherService _weatherService;

        public HomeController(ILogger<HomeController> logger, WeatherService weatherService)
        {
            _logger = logger;
            _weatherService = weatherService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Weather()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> WeatherDetail(string city)
        {
            if (string.IsNullOrEmpty(city)) return BadRequest("City required");

            var result = await _weatherService.GetWeatherAsync(city);
            if (result == null)
                return StatusCode(500, "Error retrieving weather data");

            return Json(result);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
