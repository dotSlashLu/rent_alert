module.exports = {
  interval: 60,
  smtp: {
    host: "mail.domain.com",
    user: "abc",
    pass: "keyboard_cat",
    sender: "Rent Alert! <abc@domain.com>",
    recipient: "abc@domain.com, abc2@domain2.com"
  },
  // 租房板块
  url: "http://home.meizu.cn/forum.php?mod=forumdisplay&fid=66",
  predicate: function(text) {
    //// only 海怡湾畔
    // if (text.match(/海怡湾畔/) && !text.match(/已出|已租/))
    //   return true;
    // return false;

    //// all exclude 求租
    if (!text.match(/求租/))
      return true;
    return false;
  }
}
