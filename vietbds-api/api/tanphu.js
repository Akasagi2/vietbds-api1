const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://batdongsan.com.vn/ban-nha-dat-tan-phu?cIds=361,45,48', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const result = [];

    $('.js__product-link-for-product-id').each((i, el) => {
      const title = $(el).text().trim();
      const link = 'https://batdongsan.com.vn' + $(el).attr('href');
      const price = $(el).closest('.re__card-info').find('.re__price').text().trim();
      const area = $(el).closest('.re__card-info').find('.re__area').text().trim();
      const address = $(el).closest('.re__card-info').find('.re__address').text().trim();
      const id = $(el).attr('data-product-id') || link.split('-').pop();

      result.push({ id, title, price, area, address, link });
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};