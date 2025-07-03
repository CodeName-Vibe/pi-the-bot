const apiManager = require('./apiManager')
const userManager = require('./userManager')
const statics = require('../staticData.json')
const { raw } = require('express')

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

  responceNetwork(selection) {
    userManager.setOnRework(selection.from.id, 0)
    userManager.setNetwork(selection.from.id, selection.data)
    if (selection.data == "Tonik0") {
      userManager.setStep(selection.from.id, 2);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getTonikID, {parse_mode: 'Markdown'})
    } else if (selection.data == "Tonik1") {
      userManager.setStep(selection.from.id, 3);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getName, {parse_mode: 'HTML'})
    } else if (selection.data == "Domain") {
      userManager.setStep(selection.from.id, 3);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getName, {parse_mode: 'HTML'})
    } else if (selection.data == "Inuvo") {
      userManager.setStep(selection.from.id, 3);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getName, {parse_mode: 'HTML'})
    } else if (selection.data == "MarMar") {
      userManager.setStep(selection.from.id, 3);
      this.bot.sendMessage(selection.message.chat.id, statics.content.getName, {parse_mode: 'HTML'})
    }
  }
  async responseTonikID(msg, rework) {
    if (userManager.getNetwork(msg.from.id) == "Tonik0") {
      if (parseInt(msg.text)) {
        if ((msg.text.length == 6 || msg.text.length == 7)) {
          if (await apiManager.getTonikInfo(msg.from.id, msg.text)) {
            userManager.setStep(msg.from.id, 5);
            this.bot.sendMessage(msg.chat.id, `<b>Tonik Campaign</b> Found\n\n<b>Offer Name: </b> ${userManager.getOfferName(msg.from.id)}\n<b>Geo: </b> ${userManager.getGeo(msg.from.id)}\n<b>Tonik Link: </b> ${userManager.getTrackingLink(msg.from.id)}`, {parse_mode: 'HTML'})
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
        this.bot.sendMessage(msg.chat.id, statics.content.errorTonikIDNotNumber, {parse_mode: 'Markdown'})
      }
    } else if (userManager.getNetwork(msg.from.id) == "Tonik1") {
      if (parseInt(msg.text) && (msg.text.length == 6 || msg.text.length == 7)) {
        if (userManager.getBranch(msg.from.id) == "CPC") {
          if (userManager.getTrafficSource(msg.from.id) == "Mgid") {
            if (await apiManager.getTonikRSOC1Info(msg.from.id, msg.text)) {
              let offersListText = '';
              userManager.getOffersCPC(msg.from.id).forEach(offer => {
                offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n`
              });
              if (offersListText) {
                this.bot.sendMessage(msg.chat.id, offersListText, {parse_mode: "HTML", disable_web_page_preview: true})
              }
              setTimeout(() => {
                this.bot.sendMessage(msg.chat.id, '6.2'+statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
              }, 200);
            } else {
              this.bot.sendMessage(msg.chat.id, statics.content.errorIDNotFound, {parse_mode: 'Markdown'})
            }
          } else if (userManager.getTrafficSource(msg.from.id) == "Taboola") {
            if (await apiManager.getTonikRSOC2Info(msg.from.id, msg.text)) {
              let offersListText = '';
              userManager.getOffersCPC(msg.from.id).forEach(offer => {
                offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n`
              });
              if (offersListText) {
                this.bot.sendMessage(msg.chat.id, offersListText, {parse_mode: "HTML", disable_web_page_preview: true})
              }
              setTimeout(() => {
                this.bot.sendMessage(msg.chat.id, '6.2'+statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
              }, 200);
            } else {
              this.bot.sendMessage(msg.chat.id, statics.content.errorIDNotFound, {parse_mode: 'Markdown'})
            }           
          }
        } else if (userManager.getBranch(msg.from.id) == "DSP") {
          if (userManager.getOfferDSP(msg.from.id, msg.text)) {
              userManager.setStep(msg.from.id, 6);
              userManager.setCurrentOfferID(msg.from.id, msg.text)
              let offerDSP = userManager.getOfferDSP(msg.from.id, msg.text)
              this.bot.sendMessage(msg.chat.id, `<b>Tonik Campaign</b> Found\n\n<b>Offer Name: </b> ${offerDSP.offerName}\n<b>Geo: </b> ${offerDSP.geo}\n<b>Tonik Link: </b> ${offerDSP.trackingLink}\n<b>Offer Text: </b> ${offerDSP.offerText}`, {parse_mode: 'HTML', disable_web_page_preview: true})
              setTimeout(() => {
                this.bot.sendMessage(msg.chat.id, statics.content.getCampaignTextRSOCChange, {parse_mode: 'HTML'})
              }, 200);
          } else {
            if (await apiManager.getTonikRSOC1Info(msg.from.id, msg.text)) {
              userManager.setStep(msg.from.id, 6);
              userManager.setCurrentOfferID(msg.from.id, msg.text)
              let offerDSP = userManager.getOfferDSP(msg.from.id, msg.text)
              this.bot.sendMessage(msg.chat.id, `<b>Tonik Campaign</b> Found\n\n<b>Offer Name: </b> ${offerDSP.offerName}\n<b>Geo: </b> ${offerDSP.geo}\n<b>Tonik Link: </b> ${offerDSP.trackingLink}\n<b>Offer Text: </b>__`, {parse_mode: 'HTML', disable_web_page_preview: true})
              setTimeout(() => {
                this.bot.sendMessage(msg.chat.id, statics.content.getCampaignTextRSOC, {parse_mode: 'HTML'})
              }, 200);
            } else {
              this.bot.sendMessage(msg.chat.id, statics.content.errorIDNotFound, {parse_mode: 'Markdown'})
            }
          }
        }
      } else if (msg.text == "/finish") {
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else if (!parseInt(msg.text)) {
        this.bot.sendMessage(msg.chat.id, statics.content.errorTonikIDNotNumber, {parse_mode: 'Markdown'})
      } else {
        this.bot.sendMessage(msg.chat.id, statics.content.errorIDLenght, {parse_mode: 'Markdown'})
      }
    }
  }
  responceName(msg, rework) {
    userManager.setName(msg.chat.id, msg.text)
    if (rework) {
      this.responseChange("10", msg.chat.id, msg.from.id);
    } else if (userManager.getNetwork(msg.from.id) == "Tonik1") {
      userManager.setStep(msg.from.id, 9);
      this.bot.sendMessage(msg.chat.id, statics.content.getGeoInuvo, {parse_mode: 'Markdown'})
    } else if (userManager.getNetwork(msg.from.id) == "Domain") {
      userManager.setStep(msg.from.id, 4);
      this.bot.sendMessage(msg.chat.id, statics.content.getLink, {parse_mode: 'Markdown'})
    } else if (userManager.getNetwork(msg.from.id) == "Inuvo") {
      userManager.setStep(msg.from.id, 9);
      this.bot.sendMessage(msg.chat.id, statics.content.getGeoInuvo, {parse_mode: 'Markdown'})
    } else if (userManager.getNetwork(msg.from.id) == "MarMar") {
      userManager.setStep(msg.from.id, 9);
      this.bot.sendMessage(msg.chat.id, statics.content.getGeoMarMar, {parse_mode: 'HTML'})
    }
  }
  responceLink(msg, rework) {
    if (msg.text.includes('https://search.hmsota.com/c/')) {
      userManager.setLink(msg.chat.id, msg.text)
      if (rework) {
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else {
        userManager.setStep(msg.from.id, 8);
        this.bot.sendMessage(msg.chat.id, '4'+statics.content.getTraffic, statics.keyboard.trafficDomain)
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorWrongLink, {parse_mode: 'Markdown'})
    }
  }
  responseBranch(selection) {
    userManager.setOnRework(selection.from.id, 0)
    userManager.setBranch(selection.from.id, selection.data)
    if (userManager.getNetwork(selection.from.id) == "Tonik0") {
      if (selection.data == "CPC") {
        userManager.setStep(selection.from.id, 8);
        this.bot.sendMessage(selection.message.chat.id, '4'+statics.content.getTraffic, statics.keyboard.trafficCPC)
      } else if (selection.data == "DSP") {
        userManager.setStep(selection.from.id, 6);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getCampaignText, {parse_mode: 'HTML'})
      }
    } else if (userManager.getNetwork(selection.from.id) == "Tonik1") {
      if (selection.data == "CPC") {
        userManager.setStep(selection.from.id, 8);
        this.bot.sendMessage(selection.message.chat.id, '5'+statics.content.getTraffic, statics.keyboard.trafficRSOC_CPC)
      } else if (selection.data == "DSP") {
        userManager.setStep(selection.from.id, 7);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getTeam, statics.keyboard.team)
      }
    }
  }
  responseCampaignText(msg, rework, tonikID) {
  if (userManager.getNetwork(msg.from.id) == "Tonik1" && msg.text == "/delete") {
    userManager.setOffersTextDSP(msg.from.id, tonikID, '/delete');
    userManager.setStep(msg.from.id, 2);
    let offersListText = '';
    userManager.getOffersDSP(msg.from.id).forEach(offer => {
      offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n<b>Offer Text:</b> ${offer.offerText}\n`
    });
    if (offersListText) {
      this.bot.sendMessage(msg.chat.id, offersListText, {parse_mode: "HTML", disable_web_page_preview: true})
    }
    setTimeout(() => {
      this.bot.sendMessage(msg.chat.id, '7.1'+statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
    }, 200);
  } else if (msg.text.length <= 65) {
      if (!this.isForbiddenWordsInText(msg.text)) {
        if (userManager.getNetwork(msg.from.id) == "Tonik0") {
          userManager.setCampaignText(msg.from.id, msg.text);
          if (rework) {
            this.responseChange("10", msg.chat.id, msg.from.id);
          } else if (userManager.getBranch(msg.from.id) == "DSP") {
            userManager.setStep(msg.from.id, 7);
            this.bot.sendMessage(msg.chat.id, statics.content.getTeam, statics.keyboard.team)
          }
        } else if (userManager.getNetwork(msg.from.id) == "Tonik1") {
          userManager.setStep(msg.from.id, 2);
          userManager.setOffersTextDSP(msg.from.id, tonikID, msg.text);
          let offersListText = '';
          userManager.getOffersDSP(msg.from.id).forEach(offer => {
            offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n<b>Offer Text:</b> ${offer.offerText}\n`
          });
          if (offersListText) {
            this.bot.sendMessage(msg.chat.id, offersListText, {parse_mode: "HTML", disable_web_page_preview: true})
          }
          setTimeout(() => {
            this.bot.sendMessage(msg.chat.id, '7.1'+statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
          }, 200);
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
      if ((userManager.getTeam(selection.from.id) == 'DarkDSP') || (userManager.getTeam(selection.from.id) == 'LehaDSP') || (userManager.getTeam(selection.from.id) == 'YaanDSP')) {
        userManager.setTrafficSource(selection.from.id, 'Auto')
      }
      this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else {
      userManager.setStep(selection.from.id, 8);
      if ((userManager.getTeam(selection.from.id) == 'DarkDSP') || (userManager.getTeam(selection.from.id) == 'LehaDSP') || (userManager.getTeam(selection.from.id) == 'YaanDSP')) {
        this.bot.sendMessage(selection.message.chat.id, '6'+statics.content.getTraffic, statics.keyboard.trafficDSPAuto)
      } else {
        this.bot.sendMessage(selection.message.chat.id, '6'+statics.content.getTraffic, statics.keyboard.trafficDSP)
      }
    }
  }
  responseTrafficSource(selection, rework) {
    userManager.setTrafficSource(selection.from.id, selection.data);
    if (userManager.getNetwork(selection.from.id) == "Domain") {
      if (rework) {
        this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else {
        userManager.setStep(selection.from.id, 9);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getGeoDomain, {parse_mode: 'Markdown'})
      }
    } else if (userManager.getNetwork(selection.from.id) == "Inuvo") {
      if (rework) {
        this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else {
        userManager.setStep(selection.from.id, 12);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getCampId, {parse_mode: 'Markdown'})
      }
    } else if (userManager.getNetwork(selection.from.id) == "MarMar") {
      if (rework) {
        this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else {
        userManager.setStep(selection.from.id, 14);
        this.bot.sendMessage(selection.message.chat.id, statics.content.getHeadline, {parse_mode: 'HTML'})
      }
    } else if (userManager.getNetwork(selection.from.id) == "Tonik0") {
      this.responseChange("10", selection.message.chat.id, selection.from.id);
    } else if (userManager.getNetwork(selection.from.id) == "Tonik1") {
      if (rework && userManager.getBranch(selection.from.id) == "DSP") {
        this.responseChange("10", selection.message.chat.id, selection.from.id);
      } else if (userManager.getBranch(selection.from.id) == "CPC") {
        userManager.setStep(selection.from.id, 2);
        this.bot.sendMessage(selection.message.chat.id, '6.1'+statics.content.getTonikIDRsoc, {parse_mode: 'Markdown'})
      } else if (userManager.getBranch(selection.from.id) == "DSP") {
        userManager.setStep(selection.from.id, 2);
        this.bot.sendMessage(selection.message.chat.id, '7.1'+statics.content.getTonikIDRsoc, {parse_mode: 'Markdown'})
      }
    }
  }
  responceGeo(msg, rework) {
    const regex = /\d/;
    if (!msg.text.includes(' ') && !regex.test(msg.text)) {
      if (msg.text.length == 2 && userManager.getNetwork(msg.from.id) == "Domain") {
        userManager.setGeo(msg.chat.id, msg.text.toUpperCase());
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else if (msg.text.length == 2 && userManager.getNetwork(msg.from.id) == "Inuvo") {
        userManager.setGeo(msg.chat.id, msg.text.toUpperCase());
        if (rework) {
          this.responseChange("10", msg.chat.id, msg.from.id);
        } else {
          userManager.setStep(msg.from.id, 8);
          this.bot.sendMessage(msg.chat.id, '4'+statics.content.getTraffic, statics.keyboard.trafficInuvo)
        }
      } else if (msg.text.length == 2 && userManager.getNetwork(msg.from.id) == "Tonik1") {
        userManager.setGeo(msg.chat.id, msg.text.toUpperCase());
        if (rework) {
          this.responseChange("10", msg.chat.id, msg.from.id);
        } else {
          userManager.setStep(msg.from.id, 5);
          this.bot.sendMessage(msg.chat.id, statics.content.getBranchRSOC, statics.keyboard.branchRSOC)
        }
      } else if (msg.text.length == 5 && userManager.getNetwork(msg.from.id) == "MarMar") {
        if (msg.text.includes('_')) {
          const parts = msg.text.split('_');
          if (parts.length == 2) {
            if (parts[0].length == 2 && parts[1].length == 2) {
              const langGeo = `${parts[0].toLowerCase()}_${parts[1].toUpperCase()}`;
              userManager.setGeo(msg.chat.id, langGeo);
              if (rework) {
                this.responseChange("10", msg.chat.id, msg.from.id);
              } else {
                userManager.setStep(msg.from.id, 8);
                this.bot.sendMessage(msg.chat.id, '4'+statics.content.getTraffic, statics.keyboard.trafficMarMar)
              }
            } else {
              this.bot.sendMessage(msg.chat.id, statics.content.errorLangGeoLenght, {parse_mode: 'Markdown'})
            }
          } else {
            this.bot.sendMessage(msg.chat.id, statics.content.errorLangGeoUnderscoreLength, {parse_mode: 'Markdown'})
          }
        } else {
          this.bot.sendMessage(msg.chat.id, statics.content.errorLangGeoUnderscore, {parse_mode: 'Markdown'})
        }
      } else if (userManager.getNetwork(msg.from.id) == "MarMar") {
        this.bot.sendMessage(msg.chat.id, statics.content.errorLangGeoLenght, {parse_mode: 'Markdown'})
      } else {
        this.bot.sendMessage(msg.chat.id, statics.content.errorGeoLenght, {parse_mode: 'Markdown'})
      }
    } else if (userManager.getNetwork(msg.from.id) == "MarMar") {
      this.bot.sendMessage(msg.chat.id, statics.content.errorLangGeoNotText, {parse_mode: 'Markdown'})
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorGeoNotText, {parse_mode: 'Markdown'})
    }
  }
  responceCampId(msg, rework) {
    if (parseInt(msg.text)) {
      userManager.setCampId(msg.chat.id, msg.text);
      if (rework) {
        this.responseChange("10", msg.chat.id, msg.from.id);
      } else {
        userManager.setStep(msg.from.id, 13);
        this.bot.sendMessage(msg.chat.id, statics.content.getOfferLink, {parse_mode: 'Markdown'})
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorCampIDNotNumber, {parse_mode: 'Markdown'})
    }
  }
  responceOfferLink(msg) {
    if (msg.text.includes('https:​//bertio​.com/article/')) {
      userManager.setOfferLink(msg.chat.id, msg.text)
      let addedOfferLinks = '';
      userManager.getOfferLink(msg.chat.id).forEach((ol, index) => {
        addedOfferLinks += `\n${index + 1}. <u>${ol}</u>`
      });
      this.bot.sendMessage(msg.chat.id, statics.content.getOfferLinkAgain + addedOfferLinks, {parse_mode: 'HTML'})
    } else if (msg.text.includes('/finish')) {
      this.responseChange("10", msg.chat.id, msg.from.id);
    } else {
      this.bot.sendMessage(msg.chat.id, statics.content.errorWrongOfferLink, {parse_mode: 'Markdown'})
    }
  }
  responceHeadline(msg, rework) {
    userManager.setHeadline(msg.chat.id, msg.text);
    if (rework) {
      this.responseChange("10", msg.chat.id, msg.from.id);
    } else {
      userManager.setStep(msg.from.id, 15);
      this.bot.sendMessage(msg.chat.id, statics.content.getAsid, {parse_mode: 'HTML'})
    }
  }
  responceAsid(msg, rework) {
    userManager.setAsid(msg.chat.id, msg.text);
    if (rework) {
      this.responseChange("10", msg.chat.id, msg.from.id);
    } else {
      userManager.setStep(msg.from.id, 16);
      this.bot.sendMessage(msg.chat.id, statics.content.getTerms, {parse_mode: 'HTML'})
    }
  }
  responceTerms(msg) {
    userManager.setTerms(msg.chat.id, msg.text);
    this.responseChange("10", msg.chat.id, msg.from.id);
  }
  responseChange(change, chat, id) {
    userManager.setOnRework(id, 1);
    if (change == "1") {
      userManager.setOfferLink(id, 'clear');
      userManager.setOffersCPC(id, 'clear');
      userManager.setOffersDataDSP(id, 'clear');
      userManager.setStep(id, 1);
      this.bot.sendMessage(chat, statics.content.getNetwork, statics.keyboard.network)
    } else if (change == "2") {
      userManager.setStep(id, 2);
      if (userManager.getNetwork(id) == "Tonik0") {
        this.bot.sendMessage(chat, statics.content.getTonikID, {parse_mode: 'Markdown'})
      } else if (userManager.getBranch(id) == 'CPC' && userManager.getNetwork(id) == "Tonik1") {
        let offersListText = '';
        userManager.getOffersCPC(id).forEach(offer => {
          offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n`
        });
        if (offersListText) {
          this.bot.sendMessage(chat, offersListText, {
            parse_mode: "HTML",
            disable_web_page_preview: true
          })
        }
        setTimeout(() => {
          this.bot.sendMessage(chat, '6.2' + statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
        }, 200);
      } else if (userManager.getBranch(id) == 'DSP' && userManager.getNetwork(id) == "Tonik1") {
        let offersListText = '';
        userManager.getOffersDSP(id).forEach(offer => {
          offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n<b>Offer Text:</b> ${offer.offerText}\n`
        });
        if (offersListText) {
          this.bot.sendMessage(chat, offersListText, {
            parse_mode: "HTML",
            disable_web_page_preview: true
          })
        }
        setTimeout(() => {
          this.bot.sendMessage(chat, '7.1' + statics.content.getTonikIDRsocAgain, {parse_mode: 'Markdown'})
        }, 200);
      }
    } else if (change == "3") {
      userManager.setStep(id, 3);
      this.bot.sendMessage(chat, statics.content.getName, {parse_mode: 'HTML'})
    } else if (change == "4") {
      userManager.setStep(id, 4);
      this.bot.sendMessage(chat, statics.content.getLink, {parse_mode: 'Markdown'})
    } else if (change == "5") {
      userManager.setOfferLink(id, 'clear');
      userManager.setOffersCPC(id, 'clear');
      userManager.setOffersDataDSP(id, 'clear');
      userManager.setStep(id, 5);
      if (userManager.getNetwork(id) == "Tonik0") {
        this.bot.sendMessage(chat, statics.content.getBranch, statics.keyboard.branch)
      } else if (userManager.getNetwork(id) == "Tonik1") {
        this.bot.sendMessage(chat, statics.content.getBranchRSOC, statics.keyboard.branch)
      }
    } else if (change == "6") {
      userManager.setStep(id, 6);
      this.bot.sendMessage(chat, statics.content.getCampaignText, {parse_mode: 'HTML'})
    } else if (change == "7") {
      userManager.setStep(id, 7);
      this.bot.sendMessage(chat, statics.content.getTeam, statics.keyboard.team)
    } else if (change == "8") {
      userManager.setStep(id, 8);
      if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik0") {
        this.bot.sendMessage(chat, '4'+statics.content.getTraffic, statics.keyboard.trafficCPC)
      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik0") {
        if ((userManager.getTeam(id) == 'DarkDSP') || (userManager.getTeam(id) == 'LehaDSP') || (userManager.getTeam(id) == 'YaanDSP')) {
          this.bot.sendMessage(chat, '6'+statics.content.getTraffic, statics.keyboard.trafficDSPAuto)
        } else {
          this.bot.sendMessage(chat, '6'+statics.content.getTraffic, statics.keyboard.trafficDSP)
        }
      } else if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik1") {
        userManager.setOfferLink(id, 'clear');
        userManager.setOffersCPC(id, 'clear');
        userManager.setOffersDataDSP(id, 'clear');
        this.bot.sendMessage(chat, '5'+statics.content.getTraffic, statics.keyboard.trafficRSOC_CPC)
      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik1") {
        if ((userManager.getTeam(id) == 'DarkDSP') || (userManager.getTeam(id) == 'LehaDSP') || (userManager.getTeam(id) == 'YaanDSP')) {
          this.bot.sendMessage(chat, '6'+statics.content.getTraffic, statics.keyboard.trafficDSPAuto)
        } else {
          this.bot.sendMessage(chat, '6'+statics.content.getTraffic, statics.keyboard.trafficDSP)
        }
      } else if (userManager.getNetwork(id) == "Domain") {
        this.bot.sendMessage(chat, '4'+statics.content.getTraffic, statics.keyboard.trafficDomain)
      } else if (userManager.getNetwork(id) == "Inuvo") {
        this.bot.sendMessage(chat, '4'+statics.content.getTraffic, statics.keyboard.trafficInuvo)
      } else if (userManager.getNetwork(id) == "MarMar") {
        this.bot.sendMessage(chat, '4'+statics.content.getTraffic, statics.keyboard.trafficMarMar)
      }
    } else if (change == "9") {
      userManager.setStep(id, 9);
      if (userManager.getNetwork(id) == "Tonik1") {
        this.bot.sendMessage(chat, statics.content.getGeoInuvo, {parse_mode: 'Markdown'})
      } else if (userManager.getNetwork(id) == "Domain") {
        this.bot.sendMessage(chat, statics.content.getGeoDomain, {parse_mode: 'Markdown'})
      } else if (userManager.getNetwork(id) == "Inuvo") {
        this.bot.sendMessage(chat, statics.content.getGeoInuvo, {parse_mode: 'Markdown'})
      } else if (userManager.getNetwork(id) == "MarMar") {
        this.bot.sendMessage(chat, statics.content.getGeoMarMar, {parse_mode: 'HTML'})
      }
    } else if (change == "12") {
      userManager.setStep(id, 12);
      this.bot.sendMessage(chat, statics.content.getCampId, {parse_mode: 'Markdown'})
    } else if (change == "13") {
      userManager.setStep(id, 13);
      let addedOfferLinks = '';
      userManager.getOfferLink(id).forEach((ol, index) => {
        addedOfferLinks += `\n${index + 1}. <u>${ol}</u>`
      });
      this.bot.sendMessage(chat, statics.content.getOfferLinkAgain + addedOfferLinks, {parse_mode: 'HTML'})
    } else if (change == "14") {
      userManager.setStep(id, 14);
      this.bot.sendMessage(chat, statics.content.getHeadline, {parse_mode: 'HTML'})
    } else if (change == "15") {
      userManager.setStep(id, 15);
      this.bot.sendMessage(chat, statics.content.getAsid, {parse_mode: 'HTML'})
    } else if (change == "16") {
      userManager.setStep(id, 16);
      this.bot.sendMessage(chat, statics.content.getTerms, {parse_mode: 'HTML'})
    } else if (change == "10") {
      userManager.setStep(id, 10);
      
      let networkText = '';
      if (userManager.getNetwork(id) == "Tonik0") {
        networkText = "Tonik AFD"
      } else if (userManager.getNetwork(id) == "Tonik1") {
        networkText = "Tonik RSOC"
      }

      if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik0") {
        this.bot.sendMessage(chat, `5${statics.content.getChanges}\n\n*Network* - ${networkText}\n*Tonik ID* - ${userManager.getTonikID(id)}\n*Branch* - ${userManager.getBranch(id)}\n*Traffic Source* - ${userManager.getTrafficSource(id)}`, {parse_mode: 'Markdown'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeCPC)
        }, 200);

      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik0") {
        this.bot.sendMessage(chat, `6${statics.content.getChanges}\n\n*Network* - ${networkText}\n*Tonik ID* - ${userManager.getTonikID(id)}\n*Branch* - ${userManager.getBranch(id)}\n*Campaign Text* - ${userManager.getCampaignText(id)}\n*Team* - ${userManager.getTeam(id)}\n*Traffic Source* - ${this.getTrafficSource(id)}`, {parse_mode: 'Markdown'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeDSP)
        }, 200);

      } else if (userManager.getBranch(id) == "CPC" && userManager.getNetwork(id) == "Tonik1") {
        let offersListText = '';
        userManager.getOffersCPC(id).forEach(offer => {
          offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n`
        });

        this.bot.sendMessage(chat, `7${statics.content.getChangesDomain}\n\n<b>Network</b> - ${networkText}\n<b>Campaign Name</b> - ${userManager.getOfferName(id)}\n<b>Geo</b> - ${userManager.getGeo(id)}\n<b>Branch</b> - ${userManager.getBranch(id)}\n<b>Traffic Source</b> - ${userManager.getTrafficSource(id)}\n<b>Offers</b>:`, {parse_mode: 'HTML'})

        setTimeout(() => {
          if (offersListText) {
            this.bot.sendMessage(chat, offersListText, {
              parse_mode: "HTML",
              disable_web_page_preview: true
            })
          }
          setTimeout(() => {
            this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeRSOC_CPC)
          }, 200);
        }, 200);

      } else if (userManager.getBranch(id) == "DSP" && userManager.getNetwork(id) == "Tonik1") {
        let offersListText = '';
        userManager.getOffersDSP(id).forEach(offer => {
          offersListText += `\n<b>Offer Name:</b> ${offer.offerName}\n<b>Geo:</b> ${offer.geo}\n<b>Tonik Link:</b> ${offer.trackingLink}\n<b>Offer Text:</b> ${offer.offerText}\n`
        });

        this.bot.sendMessage(chat, `8${statics.content.getChangesDomain}\n\n<b>Network</b> - ${networkText}\n<b>Campaign Name</b> - ${userManager.getOfferName(id)}\n<b>Geo</b> - ${userManager.getGeo(id)}\n<b>Branch</b> - ${userManager.getBranch(id)}\n<b>Team</b> - ${userManager.getTeam(id)}\n<b>Traffic Source</b> - ${this.getTrafficSource(id)}\n<b>Offers</b>:`, {parse_mode: 'HTML'})

        setTimeout(() => {
          if (offersListText) {
            this.bot.sendMessage(chat, offersListText, {
              parse_mode: "HTML",
              disable_web_page_preview: true
            })
          }
          setTimeout(() => {
            this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeRSOC_DSP)
          }, 200);
        }, 200);

      } else if (userManager.getNetwork(id) == "Domain") {
        this.bot.sendMessage(chat, `6${statics.content.getChangesDomain}\n\n<b>Network</b> - ${userManager.getNetwork(id)}\n<b>Offer Name</b> - ${userManager.getOfferName(id)}\n<b>Domain Offer Link</b> - ${userManager.getTrackingLink(id)}\n<b>Traffic Source</b> - ${userManager.getTrafficSource(id)}\n<b>Geo</b> - ${userManager.getGeo(id)}`, {parse_mode: 'HTML'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeDomain)
        }, 200);

      } else if (userManager.getNetwork(id) == "Inuvo") {
        let offerLinksText = '';
        userManager.getOfferLink(id).forEach((ol, index) => {
          offerLinksText += `\n${index + 1}. <u>${ol}</u>`
        })

        let trafficSource = userManager.getTrafficSource(id);
        let trafficSourceText = '';
        if (trafficSource == "Rev0") {
          trafficSourceText = "Rev: @\u200Bteliatnykov"
        } else if (trafficSource == "Rev1") {
          trafficSourceText = "Rev: @\u200Bjonydep.lazarchuk"
        } else if (trafficSource == "Rev2") {
          trafficSourceText = "Rev: @\u200Bevgenii.teliatnykov"
        } else {
          trafficSourceText = trafficSource;
        }

        this.bot.sendMessage(chat, `7${statics.content.getChangesDomain}\n\n<b>Network</b> - ${userManager.getNetwork(id)}\n<b>Offer Name</b> - ${userManager.getOfferName(id)}\n<b>Geo</b> - ${userManager.getGeo(id)}\n<b>Traffic Source</b> - ${trafficSourceText}\n<b>Camp ID</b> - ${userManager.getCampId(id)}\n<b>Offer Links</b>: ${offerLinksText}`, {parse_mode: 'HTML'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeInuvo)
        }, 200);
      } else if (userManager.getNetwork(id) == "MarMar") {
        let terms = userManager.getTerms(id).split(',');
        let termsText = '';
        for (let i = 0; i < terms.length; i++) {
          termsText += `\n  ${i + 1}) ${terms[i]}`
        }
        this.bot.sendMessage(chat, `8${statics.content.getChangesDomain}\n\n<b>Network</b> - ${userManager.getNetwork(id)}\n<b>Offer Name</b> - ${userManager.getOfferName(id)}\n<b>Language</b> - ${userManager.getGeo(id).split('_')[0]}\n<b>Geo</b> - ${userManager.getGeo(id).split('_')[1]}\n<b>Traffic Source</b> - ${userManager.getTrafficSource(id)}\n<b>Headline</b> - ${userManager.getHeadline(id)}\n<b>asid</b>: ${userManager.getAsid(id)}\n<b>Terms</b>: ${termsText}`, {parse_mode: 'HTML'})
        setTimeout(() => {
          this.bot.sendMessage(chat, statics.content.chooseChanges, statics.keyboard.changeMarMar)
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
      let stext = await apiManager.getPeerclickLink(
        userManager.getNetwork(id),
        userManager.getTonikID(id),
        userManager.getOfferName(id),
        userManager.getGeo(id),
        userManager.getBranch(id),
        userManager.getTrackingLink(id),
        userManager.getTrafficSource(id),
        userManager.getCampaignText(id),
        userManager.getTeam(id),
        userManager.getCampId(id),
        userManager.getOfferLink(id),
        userManager.getOffersCPC(id),
        userManager.getOffersDSP(id),
        userManager.getHeadline(id),
        userManager.getAsid(id),
        userManager.getTerms(id)
      );
      if (!stext) {
        this.bot.sendMessage(chat, statics.content.errorCreationWrong);
      } else {
        await this.bot.sendMessage(chat, `<b>Here's your link</b>`, {parse_mode: 'HTML'});
        await this.bot.sendMessage(chat, stext.peerclickLink, {disable_web_page_preview: true});
      }
      // this.bot.sendMessage(chat, stext)
    }, 200);
  }

  responceOperation(selection) {
    userManager.setOnRework(selection.from.id, 0);
    userManager.setOperation(selection.from.id, selection.data);
    if (selection.data == "MarMarOT") {
      userManager.setStep(selection.from.id, 102);
      this.bot.sendMessage(selection.message.chat.id, statics.editContent.getOfferID, {parse_mode: 'Markdown'})
    }
  }
  async responceOfferId(msg, rework) {
    if (parseInt(msg.text)) {
      userManager.setOfferId(msg.chat.id, msg.text);
      if (await apiManager.getPeerclickOffer(msg.from.id, msg.text)) {
        let offerBody = userManager.getOfferBody(msg.from.id);
        if (offerBody.affiliateNetwork.id == 12) {
          if (rework) {
            this.responseOperationChange("110", msg.chat.id, msg.from.id);
          } else {
            let rawTerms = offerBody.url.split('&terms=')[1];
            let terms = '';
            while (rawTerms.includes('+')) {
              rawTerms = rawTerms.replace('+', ' ');
            }
            rawTerms = rawTerms.split(',');
            rawTerms.forEach((term, index) => {
              terms += `\n  ${index+1}) ${term}`;
            })
            userManager.setStep(msg.from.id, 103);
            this.bot.sendMessage(msg.chat.id, `<b>PeerClick Offer</b> Found\n\n<b>ID: </b> ${offerBody.id}\n<b>Name: </b> ${offerBody.namePostfix}\n<b>Geo: </b> ${offerBody.country.code}\n<b>URL: </b> ${offerBody.url}\n<b>Terms: </b> ${terms}\n`, {parse_mode: 'HTML'})
            setTimeout(() => {
              this.bot.sendMessage(msg.chat.id, statics.editContent.getTerms, {parse_mode: 'HTML'})
            }, 200);
          }
        } else {
          this.bot.sendMessage(msg.chat.id, statics.editContent.errorOfferIdNotMarMar, {parse_mode: 'Markdown'})
        }
      } else {
        this.bot.sendMessage(msg.chat.id, statics.editContent.errorOfferIdNotFound, {parse_mode: 'Markdown'})
      }
    } else {
      this.bot.sendMessage(msg.chat.id, statics.editContent.errorOfferIdNotNumber, {parse_mode: 'Markdown'})
    }
  }
  responceNewTerms(msg) {
    userManager.setTerms(msg.chat.id, msg.text);
    this.responseOperationChange("110", msg.chat.id, msg.from.id);
  }
  responseOperationChange(change, chat, id) {
    userManager.setOnRework(id, 1);
    if (change == "101") {
      userManager.setOnRework(id, 0);
      userManager.setOfferLink(id, 'clear');
      userManager.setOffersCPC(id, 'clear');
      userManager.setOffersDataDSP(id, 'clear');
      userManager.setStep(id, 101);
      this.bot.sendMessage(chat, statics.editContent.getOperation, statics.editKeyboard.operation)
    } else if (change == "102") {
      userManager.setStep(id, 102);
      if (userManager.getOperation(id) == "MarMarOT") {
        this.bot.sendMessage(chat, statics.editContent.getOfferID, {parse_mode: 'Markdown'})
      }
    } else if (change == "103") {
      userManager.setStep(id, 103);
      this.bot.sendMessage(chat, statics.editContent.getTerms, {parse_mode: 'HTML'})
    } else if (change == "110") {
      userManager.setStep(id, 110);
      let offerBody = userManager.getOfferBody(id);
      let rawTerms = offerBody.url.split('&terms=')[1];
      let terms = '';
      let rawNewTerms = userManager.getTerms(id);
      let newTerms = '';
      while (rawTerms.includes('+')) {
        rawTerms = rawTerms.replace('+', ' ');
      }
      rawTerms = rawTerms.split(',');
      rawTerms.forEach((term, index) => {
        terms += `\n  ${index+1}) ${term}`;
      })
      while (rawNewTerms.includes('+')) {
        rawNewTerms = rawNewTerms.replace('+', ' ');
      }
      rawNewTerms = rawNewTerms.split(',');
      rawNewTerms.forEach((newTterm, index) => {
        newTerms += `\n  ${index+1}) ${newTterm}`;
      })
      this.bot.sendMessage(chat, `4${statics.content.getChangesDomain}\n\n<b>Offer ID: </b> ${offerBody.id}\n<b>Offer Name: </b> ${offerBody.namePostfix}\n<b>Offer Geo: </b> ${offerBody.country.code}\n<b>Old Offer Terms: </b> ${terms}\n<b>New Offer Terms: </b> ${newTerms}\n`, {parse_mode: 'HTML'})
      setTimeout(() => {
        this.bot.sendMessage(chat, statics.content.chooseChanges, statics.editKeyboard.changeMarMarOT)
      }, 200);
    } else if (change == "111") {
      this.inputOperationDone(id, chat);
    }
  }
  async inputOperationDone(id, chat){
    userManager.setStep(id, 0);
    this.bot.sendMessage(chat, statics.content.responceInputDone, {parse_mode: 'Markdown'});
    setTimeout(async () => {
      if (userManager.getOperation(id) == "MarMarOT") {
        let offerBody = userManager.getOfferBody(id);
        let terms = userManager.getTerms(id);
        while (terms.includes(' ')) {
          terms = terms.replace(' ', '+');
        }
        let url = offerBody.url.split('&terms=')[0]+'&terms='+terms;
        let body = {
          name: offerBody.namePostfix,
          url: url,
          country: { code: offerBody.country.code },
          affiliateNetwork: { id: 12 },
          payout: offerBody.payout
        }
        let request = await apiManager.getPeerclickOperation(
          userManager.getOperation(id),
          userManager.getOfferId(id),
          body
        );
        if (!request) {
          this.bot.sendMessage(chat, statics.content.errorCreationWrong);
        } else {
          await this.bot.sendMessage(chat, `<b>Offer ${userManager.getOfferId(id)} Terms has been updated</b>`, {parse_mode: 'HTML'});
        }
      }
    }, 200);
  }
}

module.exports = BotManager