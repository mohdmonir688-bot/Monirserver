module.exports = async (req, res) => {
  // CORS পলিসি এরর দূর করার জন্য হেডার যোগ করা
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // যদি প্রি-ফ্লাইট (OPTIONS) রিকোয়েস্ট আসে
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch('https://rslivetv.vercel.app/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await response.text();

    const regex = /(https?:\/\/[^\s"'><]+?\.m3u8[^\s"'><]*)/g;
    const matches = html.match(regex) || [];

    let m3uPlaylist = "#EXTM3U\n";
    
    const uniqueLinks = [...new Set(matches)];
    uniqueLinks.forEach((link, index) => {
      m3uPlaylist += `#EXTINF:-1 tvg-id="channel_${index}" tvg-logo="", Channel ${index + 1}\n${link}\n\n`;
    });

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u"');
    res.status(200).send(m3uPlaylist);
  } catch (error) {
    res.status(500).send("#EXTM3U\n#EXTINF:-1, Error loading playlist\nhttps://example.com/error.m3u8");
  }
};
