using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace OfferApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly PdfGenerator _pdfGenerator;

        public PdfController()
        {
            _pdfGenerator = new PdfGenerator();
        }

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] HtmlContentModel model)
        {
            if (string.IsNullOrWhiteSpace(model.HtmlContent))
            {
                return BadRequest("HTML content is required.");
            }

            var pdfBytes = await _pdfGenerator.GeneratePdf(model.HtmlContent);
            return File(pdfBytes, "application/pdf", "GeneratedPdf.pdf");
        }
    }

    public class HtmlContentModel
    {
        public string HtmlContent { get; set; }
    }
}
