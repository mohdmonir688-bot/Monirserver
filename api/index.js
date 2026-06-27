module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'audio/x-mpegurl');
  res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u"');

  try {
    // ইন্টারনেটের সবচেয়ে বড় অটো-আপডেট ডাটাবেজ থেকে লিংক নেওয়া
    const response = await fetch('https://iptv-org.github.io/iptv/index.m3u');
    const data = await response.text();

    const lines = data.split('\n');
    let filteredPlaylist = "#EXTM3U\n\n";
    let keepChannel = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (line.startsWith('#EXTINF')) {
        // শুধু বাংলাদেশ (Bangladesh) এবং খেলাধুলার (Sports) চ্যানেলগুলো ফিল্টার করা
        if (line.toLowerCase().includes('bangladesh') || 
            line.toLowerCase().includes('sports') || 
            line.toLowerCase().includes('tvg-country="bd"')) {
          filteredPlaylist += line + "\n";
          keepChannel = true;
        } else {
          keepChannel = false;
        }
      } else if (line.startsWith('http') && keepChannel) {
        filteredPlaylist += line + "\n\n";
        keepChannel = false; // রিসেট
      }
    }

    res.status(200).send(filteredPlaylist);
  } catch (error) {
    res.status(500).send("#EXTM3U\n#EXTINF:-1, Error loading playlist\nhttps://example.com/error.m3u8");
  }
};
