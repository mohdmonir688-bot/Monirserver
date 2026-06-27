const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // ওই ওয়েবসাইটের মূল সোর্স থেকে ডেটা নেওয়া
    const response = await axios.get('https://rslivetv.vercel.app/');
    const html = response.data;

    // HTML থেকে m3u8 লাইভ লিঙ্ক এবং চ্যানেলের নাম খুঁজে বের করার অটো-রোবট
    const regex = /(https?:\/\/[^\s"'><]+?\.m3u8[^\s"'><]*)/g;
    const matches = html.match(regex) || [];

    let m3uPlaylist = "#EXTM3U\n";
    
    // ডুপ্লিকেট লিঙ্ক বাদ দিয়ে প্লেলিস্ট তৈরি করা
    const uniqueLinks = [...new Set(matches)];
    uniqueLinks.forEach((link, index) => {
      m3uPlaylist += `#EXTINF:-1 tvg-id="channel_${index}" tvg-logo="", Channel ${index + 1}\n${link}\n\n`;
    });

    // ম্যাপ বা অ্যাপের প্লেয়ারের জন্য রেডিমেড M3U আউটপুট দেওয়া
    res.setHeader('Content-Type: audio/x-mpegurl');
    res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u"');
    res.status(200).send(m3uPlaylist);
  } catch (error) {
    res.status(500).send("#EXTM3U\n#EXTINF:-1, Error loading playlist\nhttps://example.com/error.m3u8");
  }
};

