using PuppeteerSharp;
using System.IO;
using System.Threading.Tasks;

public class PdfGenerator
{
    public async Task<byte[]> GeneratePdf(string htmlContent)
    {
        // PuppeteerSharp'ın varsayılan Chromium sürümünü indir
        var browserFetcher = new BrowserFetcher();
        await browserFetcher.DownloadAsync();

        // Chromium'u başlat
        var browser = await Puppeteer.LaunchAsync(new LaunchOptions
        {
            Headless = true
        });

        // Yeni bir sayfa oluştur
        var page = await browser.NewPageAsync();

        // HTML içeriğini ayarla
        await page.SetContentAsync(htmlContent);

        // PDF olarak kaydet
        var pdfStream = await page.PdfStreamAsync(new PdfOptions
        {
            Format = PuppeteerSharp.Media.PaperFormat.A4,
            PrintBackground = true
        });

        // Tarayıcıyı kapat
        await browser.CloseAsync();

        // PDF dosyasını byte array olarak döndür
        using (var memoryStream = new MemoryStream())
        {
            await pdfStream.CopyToAsync(memoryStream);
            return memoryStream.ToArray();
        }
    }
}
