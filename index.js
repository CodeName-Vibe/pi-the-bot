const TelegramBot = require('node-telegram-bot-api');
const BotManager = require('./app/managers/botManager');
const userManager = require('./app/managers/userManager');
const statics = require('./app/staticData.json');
const express = require('express');
const routes = require('./app/router');

const app = express();

app.use(express.json());
app.use([routes]);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const token = '7106816891:AAHc5MKlu10ph-rrKL27n1_QXp0UVbaH0oI';

const bot = new TelegramBot(token, {polling: true});
const botManager = new BotManager(bot);

bot.on('message', (msg) => {
  if (typeof(msg.text) == "string") {
    if (msg.text == "/start") {
      botManager.responseStart(msg);
    } else if(userManager.getUser(msg.from.id)) {
      if (msg.text == "/report") {
        bot.sendMessage(msg.chat.id, statics.content.getReport, {parse_mode: 'Markdown'})
      } else if (msg.text == "/help") {
        botManager.responseInstruction(msg);
      } else if (msg.text == "/create") {
        userManager.setOnRework(msg.from.id, 0);
        userManager.setStep(msg.from.id, 1);
        bot.sendMessage(msg.chat.id, statics.content.getTonikID, {parse_mode: 'Markdown'})
      } else if (userManager.getStep(msg.from.id) == 1) {
        if (userManager.getOnRework(msg.from.id) == 1) {
          botManager.responseTonikID(msg, 1);
        } else {
          botManager.responseTonikID(msg, 0);
        }
      } else if (userManager.getStep(msg.from.id) == 2) {
        bot.sendMessage(msg.chat.id, statics.content.errorSelectBranch, statics.keyboard.branch);
      } else if (userManager.getStep(msg.from.id) == 3) {
        if (userManager.getOnRework(msg.from.id) == 1) {
          botManager.responseCampaignText(msg, 1);
        } else {
          botManager.responseCampaignText(msg, 0);
        }
      } else if (userManager.getStep(msg.from.id) == 4) {
        bot.sendMessage(msg.chat.id, statics.content.errorSelectTeam, statics.keyboard.team);
      } else if (userManager.getStep(msg.from.id) == 5) {
        if (userManager.getBranch(msg.from.id) == "CPC") {
          bot.sendMessage(msg.chat.id, statics.content.errorSelectTraffic, statics.keyboard.trafficCPC);
        } else if (userManager.getBranch(msg.from.id) == "DSP") {
          bot.sendMessage(msg.chat.id, statics.content.errorSelectTraffic, statics.keyboard.trafficDSP);
        }
      } else if (userManager.getStep(msg.from.id) == 6) {
        if (userManager.getBranch(msg.from.id) == "CPC") {
          bot.sendMessage(msg.chat.id, statics.content.errorSelectChange, statics.keyboard.changeCPC);
        } else if (userManager.getBranch(msg.from.id) == "DSP") {
          bot.sendMessage(msg.chat.id, statics.content.errorSelectChange, statics.keyboard.changeDSP);
        }
      } else {
        bot.sendMessage(msg.chat.id, statics.content.errorNotActive, {parse_mode: 'Markdown'})
      }
    } else {
      bot.sendMessage(msg.chat.id, statics.content.errorNotStarted, {parse_mode: 'Markdown'})
    }
  } else {
    bot.sendMessage(msg.chat.id, statics.content.errorNotString, {parse_mode: 'Markdown'})
  }
});

bot.on('callback_query', (query) => {
  if (!userManager.getUser(query.from.id)) {
    bot.sendMessage(query.message.chat.id, statics.content.errorNotStarted, {parse_mode: 'Markdown'})
  } else if ((query.data == "CPC" || query.data == "DSP") && userManager.getStep(query.from.id) == "2") {
    botManager.responseBranch(query)
  } else if (userManager.getStep(query.from.id) == "4" && (query.data == "VladMgidDSP" || query.data == "StapMgidDSP" || query.data == "MgidDSP")) {
    botManager.responseTeam(query, userManager.getOnRework(query.from.id))
  } else if (userManager.getBranch(query.from.id) == "CPC" && userManager.getStep(query.from.id) == "5" && (query.data == "Outbrain" || query.data == "Mgid" || query.data == "Revcontent" || query.data == "Taboola")) {
    botManager.responseTrafficSource(query)
  } else if (userManager.getBranch(query.from.id) == "DSP" && userManager.getStep(query.from.id) == "5" && (query.data == "10" || query.data == "15" || query.data == "20" || query.data == "25" || query.data == "30" || query.data == "35" || query.data == "40" || query.data == "45" || query.data == "50" || query.data == "55" || query.data == "60" || query.data == "65" || query.data == "70" || query.data == "75" || query.data == "80" || query.data == "Auto")) {
    botManager.responseTrafficSource(query)
  } else if (userManager.getStep(query.from.id) == "6" && (query.data == "1" || query.data == "2" || query.data == "3" || query.data == "4" || query.data == "5" || query.data == "7")) {
    botManager.responseChange(query.data, query.message.chat.id, query.from.id)
  }
});