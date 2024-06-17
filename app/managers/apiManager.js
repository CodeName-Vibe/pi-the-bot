const staticData = require('../staticData.json')
const userManager = require('./userManager')
const axios = require('axios')

const PORT = process.env.PORT || 3000;

class ApiManager{
  constructor() {
    console.log('Api Manager connected!')

    this.getTonikInfo = async function(id, tonikId) {
      let tonikInfo = await axios.post(staticData.APIUrl+PORT+'/ApiManager/get-tonik-info',{tonikIDd:tonikId}).catch(err=>{console.log(err)})
      if(tonikInfo.data.ok) {
        userManager.setAPI(id, tonikId, tonikInfo.data.offerName, tonikInfo.data.geo, tonikInfo.data.tonikLink);
        return true
      }
      return false
      // userManager.setAPI(id, tonikId, "Dental Implants", "geo", "http://some-link-123");
      // return true;
    }

    this.getPeerclickLink = async function(tonicId, offerName, geo, branch, tonikLink, trafficSource, campaignText, team) {
      if (branch == "CPC") {
        let ts = ''
        if (trafficSource == "Outbrain") {
          ts = 'OUT'
        } else if (trafficSource == "Mgid") {
          ts = 'MGID'
        } else if (trafficSource == "Revcontent") {
          ts = 'REV'
        } else if (trafficSource == "Taboola") {
          ts = 'TABOOLA'
        }
        let data = { 
          offerName: offerName,
          geo: geo,
          offerLink: tonikLink,
          trafficSource: ts,
          tonicId:tonicId
        }
        let createLink = await axios.post(staticData.APIUrl+'/ApiManager/create-link',data).catch(err=>{console.log(err)})
        return createLink.data
      } else if (branch == "DSP") {
        let ts = "";
        if (team == "StapMgidDSP") {
          ts = "s" + trafficSource
        } else if (team == "VladMgidDSP") {
          ts = "v" + trafficSource
        } else if (team == "MgidDSP") {
          ts = "j" + trafficSource
        }
        let data = { 
          offerName: offerName,
          geo: geo,
          tonicLink: tonikLink,
          trafficSource: ts,
          campaignText: campaignText,
          tonicId:tonicId
        }
        let createLink = await axios.post(staticData.APIUrl+'/ApiManager/create-link-dsp',data).catch(err=>{console.log(err)})
        return createLink.data
      }
      // return "peerclick-link-for-test"
    }
  }
}

module.exports = new ApiManager()