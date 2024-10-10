const apiManager = require('./apiManager')
const userManager = require('./userManager')
const statics = require('../staticData.json')

class BotManager{
  constructor(bot) {
    this.bot = bot
    console.log('Bot Manager connected!')
  }

  responseStart(msg) {
    if(!userManager.getUser(msg.from.id)) {
      userManager.newUser(msg.from.id);
    }
    this.bot.sendMessage(msg.chat.id, statics.content.errorNotActive, {parse_mode: 'Markdown'})
  }

  responseInstruction(msg) {
    userManager.setOnRework(msg.from.id, 0);
    userManager.setStep(msg.from.id, 0);
    for (let i in statics.content.getInstruction) {
      setTimeout(() => {
        this.bot.sendMessage(msg.chat.id, statics.content.getInstruction[i], {parse_mode: 'Markdown'})
      }, i * 150);
    }
  }

  responceNetwork(selection) {
    userManager.setOnRework(selection.from.id, 0)
    userManager.setNetwork(selection.from.id, selection.data)
    if (selection.data == "Tonik") {
      userManager.setStep(selection.from.id, 2);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getTonikID, {parse_mode: 'Markdown'})
    } else if (selection.data == "Domain") {
      userManager.setStep(selection.from.id, 3);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getName, {parse_mode: 'HTML'})
    }
  }
  async responseTonikID(msg, rework) {
    if (parseInt(msg.text)) {
      if (msg.text.length == 6 || msg.text.length == 7) {
        if (await apiManager.getTonikInfo(msg.from.id, msg.text)) {
          userManager.setStep(msg.from.id, 5);
          this.bot.sendMessage(msg.chat.id, `<b>Tonik Campaign</b> I've Found\n\n<b>Offer Name: </b> ${userManager.getOfferName(msg.from.id)}\n<b>Geo: </b> ${userManager.getGeo(msg.from.id)}\n<b>Tonik Link: </b> ${userManager.getTrackingLink(msg.from.id)}`, {parse_mode: 'HTML'})
          setTimeout(() => {
            if (rework) {
              this.responseChange("10", msg.chat.id, msg.from.id)  
            } else {
              this.bot.sendMessage(msg.chat.id, statics.content.getBranch, statics.keyboard.branch)
            }
          }, 200);
        } else {
          this.bot.sendMessage(msg.chat.id, statics.content.errorIDNotFound, {parse_mode: 'Markdown'})
        }
      } else {
        this.bot.sendMessage(msg.chat.id, statics.content.errorIDLenght, {parse_mode: 'Markdown'})
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorIDNotNumber, {parse_mode: 'Markdown'})
    }
  }
  responceName(msg, rework) {
    userManager.setName(msg.chat.id, msg.text)
    if (rework) {
      this.responseChange("10", msg.chat.id, msg.from.id);
    } else {
      userManager.setStep(msg.from.id, 4);
      this.bot.sendMessage(msg.chat.id, statics.content.getLink, {parse_mode: 'Markdown'})
    }
  }
  responceLink(msg, rework) {
    if (msg.text.includes('https://search.hmsota.com/c/')) {
      userManager.setLink(msg.chat.id, msg.text)
      if (rework) {
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else {
        userManager.setStep(msg.from.id, 8);
        this.bot.sendMessage(msg.chat.id, statics.content.getTrafficDomain, statics.keyboard.trafficDomain)
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorWrongLink, {parse_mode: 'Markdown'})
    }
  }
  responseBranch(selection) {
    userManager.setOnRework(selection.from.id, 0)
    userManager.setBranch(selection.from.id, selection.data)
    if (selection.data == "CPC") {
      userManager.setStep(selection.from.id, 8);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getTrafficCPC, statics.keyboard.trafficCPC)
    } else if (selection.data == "DSP") {
      userManager.setStep(selection.from.id, 6);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getCampaignText, {parse_mode: 'HTML'})
    }
  }
  responseCampaignText(msg, rework) {
    if (msg.text.length <= 65) {
      if (!this.isForbiddenWordsInText(msg.text)) {
        userManager.setCampaignText(msg.from.id, msg.text);
        if (rework) {
          this.responseChange("10", msg.chat.id, msg.from.id);
        } else if (userManager.getBranch(msg.from.id) == "DSP") {
          userManager.setStep(msg.from.id, 7);
          this.bot.sendMessage(msg.chat.id, statics.content.getTeam, statics.keyboard.team)
        }
      } else {
        this.bot.sendMessage(msg.chat.id, `${statics.content.errorForbiddenWords} ${this.isForbiddenWordsInText(msg.text)}`, {parse_mode: 'Markdown'})
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorCampaignTextLenght, {parse_mode: 'Markdown'})
    }
  }
  isForbiddenWordsInText(text) {
    let words = text.split(/\s+/)
    for (let word of words) {
      if (statics.forbiddenWords[word]) {
        return word;
      }
    }
    return false;
  }
  responseTeam(selection, rework) {
    userManager.setTeam(selection.from.id, selection.data);
    if (rework) {
      this.responseChange("10", selection.message.chat.id, selection.from.id);
    } else {
      userManager.setStep(selection.from.id, 8);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getTrafficDSP, statics.keyboard.trafficDSP)
    }
  }
  responseTrafficSource(selection, rework) {
    userManager.setTrafficSource(selection.from.id, selection.data);
    if (userManager.getNetwork(selection.from.id) == "Domain") {
      if (rework) {
        this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else {
        userManager.setStep(selection.from.id, 9);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getGeo, {parse_mode: 'Markdown'})
      }
    } else {
      this.responseChange("10", selection.message.chat.id, selection.from.id);
    }
  }
  responceGeo(msg) {
    const regex = /\d/;
    if (msg.text.length == 2) {
      if (!msg.text.includes(' ') && !regex.test(msg.text)) {
        userManager.setGeo(msg.chat.id, msg.text.toUpperCase())
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else {
        this.bot.sendMessage(msg.chat.id, statics.content.errorGeoNotText, {parse_mode: 'Markdown'})
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorGeoLenght, {parse_mode: 'Markdown'})
    }
  }
  responseChange(change, chat, id) {
    userManager.setOnRework(id, 1);
    if (change == "1") {
      userManager.setStep(id, 1);
      this.bot.sendMessage(chat, statics.content.getNetwork, statics.keyboard.network)
    } else if (change == "2") {
      userManager.setStep(id, 2);
      this.bot.sendMessage(chat, statics.content.getTonikID, {parse_mode: 'Markdown'})
    } else if (change == "3") {
      userManager.setStep(id, 3);
      this.bot.sendMessage(chat, statics.content.getName, {parse_mode: 'HTML'})
    } else if (change == "4") {
      userManager.setStep(id, 4);
      this.bot.sendMessage(chat, statics.content.getLink, {parse_mode: 'Markdown'})
    } else if (change == "5") {
      userManager.setStep(id, 5);
      this.bot.sendMessage(chat, statics.content.getBranch, statics.keyboard.branch)
    } else if (change == "6") {
      userManager.setStep(id, 6);
      this.bot.sendMessage(chat, statics.content.getCampaignText, {parse_mode: 'HTML'})
    } else if (change == "7") {
      userManager.setStep(id, 7);
      this.bot.sendMessage(chat, statics.content.getTeam, statics.keyboard.team)
    } else if (change == "8") {
      userManager.setStep(id, 8);
      if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik") {
        this.bot.sendMessage(chat, statics.content.getTrafficCPC, statics.keyboard.trafficCPC)
      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik") {
        this.bot.sendMessage(chat, statics.content.getTrafficDSP, statics.keyboard.trafficDSP)
      } else if (userManager.getNetwork(id) == "Domain") {
        this.bot.sendMessage(chat, statics.content.getTrafficDomain, statics.keyboard.trafficDomain)
      }
    } else if (change == "9") {
      userManager.setStep(id, 9);
      this.bot.sendMessage(chat, statics.content.getGeo, {parse_mode: 'Markdown'})

    } else if (change == "10") {
      userManager.setStep(id, 10);
      if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik") {
        this.bot.sendMessage(chat, `4${statics.content.getChanges}\n\n*Network* - ${userManager.getNetwork(id)}\n*Tonik ID* - ${userManager.getTonikID(id)}\n*Branch* - ${userManager.getBranch(id)}\n*Traffic Source* - ${userManager.getTrafficSource(id)}`, {parse_mode: 'Markdown'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeCPC)
        }, 200);
      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik") {
        this.bot.sendMessage(chat, `6${statics.content.getChanges}\n\n*Network* - ${userManager.getNetwork(id)}\n*Tonik ID* - ${userManager.getTonikID(id)}\n*Branch* - ${userManager.getBranch(id)}\n*Campaign Text* - ${userManager.getCampaignText(id)}\n*Team* - ${userManager.getTeam(id)}\n*Traffic Source* - ${this.getTrafficSource(id)}`, {parse_mode: 'Markdown'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeDSP)
        }, 200);
      } else if (userManager.getNetwork(id) == "Domain") {
        this.bot.sendMessage(chat, `6${statics.content.getChanges}\n\n<b>Network</b> - ${userManager.getNetwork(id)}\n<b>Offer Name</b> - ${userManager.getOfferName(id)}\n<b>Domain Offer Link</b> - ${userManager.getTrackingLink(id)}\n<b>Traffic Source</b> - ${userManager.getTrafficSource(id)}\n<b>Geo</b> - ${userManager.getGeo(id)}`, {parse_mode: 'HTML'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeDomain)
        }, 200);
      }
    } else if (change == "11") {
      this.inputDone(id, chat);
    }
  }
  getTrafficSource(id) {
    if (userManager.getTrafficSource(id) == "Auto") {
      return "Auto"
    } else {
      return Math.floor(((userManager.getTrafficSource(id)) * 0.01) * 100) / 100 + '$'
    }
  }
  async inputDone(id, chat){
    userManager.setStep(id, 0);
    this.bot.sendMessage(chat, statics.content.responceInputDone, {parse_mode: 'Markdown'});
    setTimeout(async () => {
      let stext = await apiManager.getPeerclickLink(userManager.getNetwork(id), userManager.getTonikID(id), userManager.getOfferName(id), userManager.getGeo(id), userManager.getBranch(id), userManager.getTrackingLink(id), userManager.getTrafficSource(id), userManager.getCampaignText(id), userManager.getTeam(id));
      if (!stext) {
        this.bot.sendMessage(chat, 'Creation went worng');
      } else {
        await this.bot.sendMessage(chat, `<b>Here's your link</b>`, {parse_mode: 'HTML'});
        await this.bot.sendMessage(chat, stext.peerclickLink);
      }
      // this.bot.sendMessage(chat, stext)
    }, 200);
  }
}

module.exports = BotManager