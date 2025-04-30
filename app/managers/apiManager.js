const staticData = require('../staticData.json')
const userManager = require('./userManager')
const axios = require('axios')

const PORT = process.env.PORT || 3000;

class ApiManager {
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

    this.getTonikRSOCInfo = async function(id, tonikId) {
      let tonikInfo;
      if (userManager.getBranch(id) == "DSP" && userManager.getOfferDSP(id, tonikId)) {
        return true
      } else {
        tonikInfo = await axios.post(staticData.APIUrl+PORT+'/ApiManager/get-tonik-rsoc-info',{tonikIDd:tonikId}).catch(err=>{console.log(err)})
      }
      if(tonikInfo.data.ok) {
        if (userManager.getBranch(id) == "CPC") {
          userManager.setOffersCPC(id, tonikId, tonikInfo.data.offerName, tonikInfo.data.geo, tonikInfo.data.tonikLink);
        } else if (userManager.getBranch(id) == "DSP") {
          userManager.setOffersDataDSP(id, tonikId, tonikInfo.data.offerName, tonikInfo.data.geo, tonikInfo.data.tonikLink);
        }
        return true
      }
      return false
    }

    this.getPeerclickLink = async function(network, tonicId, offerName, geo, branch, tonikLink, trafficSource, campaignText, team, campId, offerLinks, offersCPC, offersDSP) {
      if (network == "Tonik0") {
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
          let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link',data).catch(err=>{
            console.log(err)
            return false
          })
          if (!createLink.data.ok) {
            return false
          } else {
            return createLink.data
          }
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
          let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link-dsp',data).catch(err=>{
            console.log(err)
            return false
          })
          if (!createLink.data.ok) {
            return false
          } else {
            return createLink.data
          }
        }
      } else if (network == "Tonik1") {
        if (branch == "CPC") {
          let ts = ''
          if (trafficSource == "Mgid") {
            ts = 'MGID'
          }
          let data = { 
            offerName: offerName,
            geo: geo,
            trafficSource: ts,
            offersCPC: offersCPC
          }
          let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link-rsoc',data).catch(err=>{
            console.log(err)
            return false
          })
          if (!createLink.data.ok) {
            return false
          } else {
            return createLink.data
          }
        } else if (branch == "DSP") {
          // let ts = "";
          // if (team == "StapMgidDSP") {
          //   ts = "s" + trafficSource
          // } else if (team == "VladMgidDSP") {
          //   ts = "v" + trafficSource
          // } else if (team == "MgidDSP") {
          //   ts = "j" + trafficSource
          // }
          // let data = { 
          //   offerName: offerName,
          //   geo: geo,
          //   tonicLink: tonikLink,
          //   trafficSource: ts,
          //   campaignText: campaignText,
          //   tonicId:tonicId
          // }
          // let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link-dsp',data).catch(err=>{
          //   console.log(err)
          //   return false
          // })
          // if (!createLink.data.ok) {
          //   return false
          // } else {
          //   return createLink.data
          // }
        }
      } else if (network == "Domain") {
        let ts = ''
          if (trafficSource == "Outbrain") {
            ts = 'OUT'
          } else if (trafficSource == "Taboola") {
            ts = 'TABOOLA'
          }
          let data = { 
            offerName: offerName,
            geo: geo,
            offerLink: tonikLink,
            trafficSource: ts
          }
          let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link-domain',data).catch(err=>{
            console.log(err)
            return false
          })
          if (!createLink.data.ok) {
            return false
          } else {
            return createLink.data
          }
      } else if (network == "Inuvo") {
        let ts = ''
          if (trafficSource == "Mgid") {
            ts = 'MGID'
          } else if (trafficSource == "Rev0") {
            ts = 'REV0'
          } else if (trafficSource == "Rev1") {
            ts = 'REV1'
          } else if (trafficSource == "Rev2") {
            ts = 'REV2'
          }
          let data = { 
            offerName: offerName,
            geo: geo,
            trafficSource: ts,
            campId: campId,
            offerLinks: offerLinks,
          }
          let createLink = await axios.post(staticData.APIUrl+PORT+'/ApiManager/create-link-inuvo',data).catch(err=>{
            console.log(err)
            return false
          })
          if (!createLink.data.ok) {
            return false
          } else {
            return createLink.data
          }
      }
      // return "peerclick-link-for-test"
    }
  }
}

module.exports = new ApiManager()