module.exports = async (req, res) => {
  try {
    // কোনো এক্সটার্নাল প্যাকেজ ছাড়া সরাসরি fetch ব্যবহার করে ডাটা নেওয়া
    const response = await fetch('https://rslivetv.vercel.app/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await response.text();

    // HTML থেকে m3u8 লাইভ লিঙ্ক খুঁজে বের করার রোবট
    const regex = /(https?:\/\/[^\s"'><]+?\.m3u8[^\s"'><]*)/g;
    const matches = html.match(regex) || [];

    let m3uPlaylist = "#EXTM3U\n";
    
    // ডুপ্লিকেট লিঙ্ক বাদ দিয়ে প্লেলিস্ট তৈরি করা
    const uniqueLinks = [...new Set(matches)];
    uniqueLinks.forEach((link, index) => {
      m3uPlaylist += `#EXTINF:-1 tvg-id="channel_${index}" tvg-logo="", Channel ${index + 1}\n${link}\n\n`;
    });

    // প্লেয়ারের জন্য রেডিমেড M3U আউটপুট দেওয়া
    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u"');
    res.status(200).send(m3uPlaylist);
  } catch (error) {
    res.status(500).send("#EXTM3U\n#EXTINF:-1, Error loading playlist\nhttps://example.com/error.m3u8");
  }
};
