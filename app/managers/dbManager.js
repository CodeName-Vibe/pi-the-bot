const axios = require("axios");
const staticData = require('../staticData.json')

class dbManager {
  key = '58cb6833bc2651bb50eaf108e258e897db93f2fc24f21257ae61769d1065adef';
  secret = 'c6b9761fef864106b87393872b3e4f35a6bfbe23df3554a0fa5b5a0f4a1ef963';

  constructor() {
    console.log('db manager conected')
  }

  async getTonicInfo(tonicId){
    try {
      const authResponse = await axios.post('https://api.publisher.tonic.com/jwt/authenticate', {
        consumer_key: this.key,
        consumer_secret: this.secret
      }, { headers: { 'Content-Type': 'application/json' } });

      const tonicInfoResponse = await axios.get(`https://api.publisher.tonic.com/privileged/v3/campaign/list?state=active&output=json`, {
        headers: {
          'Authorization': 'Bearer ' + authResponse.data.token,
          'Content-Type': 'application/json'
        }
      });

      let needed = {}
      tonicInfoResponse.data.forEach(rk => {
        if(rk.id==tonicId){
          needed = rk
        }
      });
      console.log('Needed Tonic Found');
      return needed;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async createPeerclickOffer(data){
    let token = 'a'
    const body = {
      email: "evgenii.teliatnykov@mirs.com",
      password: "sqADhv5kt>^UyK+e"
    };
    await axios.post('https://api.peerclick.com/v1_1/auth/session',body).then(a=>{
      token = a.data.token
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    let headers = {'api-token': token}
    let tail = 'no_tail('
    let ts = 0
    switch (data.trafficSource) {
      case 'MGID':
        ts = 1
        tail = staticData.tails.cpcMgid;
        break;
      case 'REV':
        ts = 2
        tail = staticData.tails.cpcRev;
        break;
      case 'OUT':
        ts = 3
        tail = staticData.tails.cpcOut;
        break;
      case 'TABOOLA':
        ts = 56
        tail = staticData.tails.cpcTaboola;
        break;
    }
    if(tail=='no_tail('){
      return false
    }else if(ts==0){
      return false
    }
    let offerBody = {
      name: data.offerName,
      workspaceId: 1,
      url: data.offerLink+tail,
      country: {
        code: data.geo
      },
      affiliateNetwork: {
        id: 1
      },
      payout: {
        type: "AUTO",
        value: null,
        currency: "USD"
      }

    }
    if(token=='a'){
      console.log('Invalid token');
      return false
    }
    let succ = {}
    await axios.post('https://api.peerclick.com/v1_1/offer',offerBody,{headers}).then(a=>{
      succ = a.data
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    if(succ.description!='Success'){
      console.log('Offer creation failed');
      return false
    }
    let cam = {
      name: data.offerName,
      workspaceId: 1,
      trafficSource: ts,
      costModel: {
        type: "AUTO",
        currency: "USD"
      },
      country: {
        code: data.geo
      },
      domain: "track.jjstrack.com",
      tags: [],
      redirectTarget: {
        destination: "PATH",
        path: {
          defaultPaths: [
            {
              weight: 100,
              direct: 1,
              offers: [
                {
                  weight: 100,
                  id: succ.offer.id,
                }
              ]
            }
          ]
        }
      }
    }
    let campSuc = {}
    await axios.post('https://api.peerclick.com/v1_1/campaign',cam,{headers}).then(a=>{
      campSuc = a.data
    }).catch(err=>{
      console.log(err.response.data.description)
      return false
    })
    if(campSuc.description!='Success'){
      console.log('Campaign creation failed');
      return false
    }
    const authResponse = await axios.post('https://api.publisher.tonic.com/jwt/authenticate', {
      consumer_key: this.key,
      consumer_secret: this.secret
    }, { headers: { 'Content-Type': 'application/json' } });
    let call = {
      campaign_id: data.tonicId,
      type: "preestimated_revenue",
      url: "http://pstb.gopeerclick.com/postback?userid=43738&cid={subid4}&status={event}&payout={revenue}&currency={currency}&status=approved&keyword={keyword}"
    }
    const tonicInfoResponse = await axios.post(`https://api.publisher.tonic.com/privileged/v3/campaign/callback`,call, {
      headers: {
        'Authorization': 'Bearer ' + authResponse.data.token,
        'Content-Type': 'application/json'
      }
    });
    return campSuc.campaign.url
  }

  async createPeerclickOfferDSP(data){
    // data = { 
    //   offerName:str,
    //   geo:str,
    //   tonicLink:str,
    //   trafficSource:str,
    //   campaignText:str,
    //   tonicId:str
    // } 
    let token = 'a'
    const body = {
      email: "evgenii.teliatnykov@mirs.com",
      password: "sqADhv5kt>^UyK+e"
    };
    await axios.post('https://api.peerclick.com/v1_1/auth/session',body).then(a=>{
      token = a.data.token
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    let headers = {'api-token': token}
    let tail = '?adtitle='
    for (let i = 0; i < data.campaignText.length; i++) {
      let symbol = data.campaignText[i]
      if(symbol==' '){
        tail += '%20'
      }else if(symbol=='{'){
        tail += '%7B'
      }else if(symbol=='}'){
        tail += '%7D'
      }else{
        tail += symbol
      }
    }
    tail += staticData.tails.dsp;
    let offerBody = {
      name: data.offerName,
      workspaceId: 1,
      url: data.tonicLink+tail,
      country: {
        code: data.geo
      },
      affiliateNetwork: {
        id: 1
      },
      payout: {
        type: "AUTO",
        value: null,
        currency: "USD"
      }

    }
    if(token=='a'){
      return false
    }
    let succ = {}
    await axios.post('https://api.peerclick.com/v1_1/offer',offerBody,{headers}).then(a=>{
      succ = a.data
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    if(succ.description!='Success'){
      console.log('Offer creation failed');
      return false
    }
    let ts = 0
    switch (data.trafficSource) {
      case 's10':
        ts = 41
        break;
      case 's15':
        ts = 42
        break;
      case 's20':
        ts = 43
        break;
      case 's25':
        ts = 44
        break;
      case 's30':
        ts = 45
        break;
      case 's35':
        ts = 46
        break;
      case 's40':
        ts = 47
        break;
      case 's45':
        ts = 48
        break;
      case 's50':
        ts = 49
        break;
      case 's55':
        ts = 50
        break;
      case 's60':
        ts = 51
        break;
      case 's65':
        ts = 52
        break;
      case 's70':
        ts = 53
        break;
      case 's75':
        ts = 54
        break;
      case 's80':
        ts = 55
        break;
      case 'sAuto':
        ts = 57
        break;
      case 'v10':
        ts = 38
        break;
      case 'v15':
        ts = 37
        break;
      case 'v20':
        ts = 36
        break;
      case 'v25':
        ts = 26
        break;
      case 'v30':
        ts = 30
        break;
      case 'v35':
        ts = 27
        break;
      case 'v40':
        ts = 28
        break;
      case 'v45':
        ts = 31
        break;
      case 'v50':
        ts = 29
        break;
      case 'v55':
        ts = 32
        break;
      case 'v60':
        ts = 33
        break;
      case 'v65':
        ts = 61
        break;
      case 'v70':
        ts = 35
        break;
      case 'v75':
        ts = 39
        break;
      case 'v80':
        ts = 34
        break;
      case 'vAuto':
        ts = 40
        break;
      case 'j10':
        ts = 18
        break;
      case 'j15':
        ts = 17
        break;
      case 'j20':
        ts = 9
        break;
      case 'j25':
        ts = 16
        break;
      case 'j30':
        ts = 10
        break;
      case 'j35':
        ts = 14
        break;
      case 'j40':
        ts = 6
        break;
      case 'j45':
        ts = 13
        break;
      case 'j50':
        ts = 4
        break;
      case 'j55':
        ts = 11
        break;
      case 'j60':
        ts = 7
        break;
      case 'j65':
        ts = 15
        break;
      case 'j70':
        ts = 58
        break;
      case 'j75':
        ts = 59
        break;
      case 'j80':
        ts = 8
        break;
      case 'jAuto':
        ts = 60
        break;
    }
    let cam = {
      name: data.offerName,
      workspaceId: 1,
      trafficSource: ts,
      costModel: {
        type: "AUTO",
        currency: "USD"
      },
      country: {
        code: data.geo
      },
      domain: "track.jjstrack.com",
      tags: [],
      redirectTarget: {
        destination: "PATH",
        path: {
          defaultPaths: [
            {
              weight: 100,
              direct: 1,
              offers: [
                {
                  weight: 100,
                  id: succ.offer.id,
                }
              ]
            }
          ]
        }
      }
    }
    let campSuc = {}
    await axios.post('https://api.peerclick.com/v1_1/campaign',cam,{headers}).then(a=>{
      campSuc = a.data
    }).catch(err=>{
      console.log(err.response.data.description)
      return false
    })
    if(campSuc.description!='Success'){
      console.log('Campaign creation failed');
      return false
    }
    const authResponse = await axios.post('https://api.publisher.tonic.com/jwt/authenticate', {
      consumer_key: this.key,
      consumer_secret: this.secret
    }, { headers: { 'Content-Type': 'application/json' } });
    let call = {
      campaign_id: data.tonicId,
      type: "click",
      url: "http://pstb.gopeerclick.com/postback?userid=43738&cid={subid4}&status={event}&payout={revenue}&currency={currency}&status=approved&keyword={keyword}"
    }
    const tonicInfoResponse = await axios.post(`https://api.publisher.tonic.com/privileged/v3/campaign/callback`,call, {
      headers: {
        'Authorization': 'Bearer ' + authResponse.data.token,
        'Content-Type': 'application/json'
      }
    });
    return campSuc.campaign.url
  }

  async createPeerclickOfferDomain(data){
    let token = 'a'
    const body = {
      email: "evgenii.teliatnykov@mirs.com",
      password: "sqADhv5kt>^UyK+e"
    };
    await axios.post('https://api.peerclick.com/v1_1/auth/session',body).then(a=>{
      token = a.data.token
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    let headers = {'api-token': token}
    let tail = 'no_tail('
    let ts = 0
    switch (data.trafficSource) {
      case 'OUT':
        ts = 3
        tail = staticData.tails.domainOut;
        break;
      case 'TABOOLA':
        ts = 56
        tail = staticData.tails.domainTaboola;
        break;
    }
    if(tail=='no_tail('){
      return false
    }else if(ts==0){
      return false
    }
    let offerBody = {
      name: data.offerName,
      workspaceId: 1,
      url: data.offerLink+tail,
      country: {
        code: data.geo
      },
      affiliateNetwork: {
        id: 7
      },
      payout: {
        type: "AUTO",
        value: null,
        currency: "USD"
      }

    }
    if(token=='a'){
      console.log('Invalid token');
      return false
    }
    let succ = {}
    await axios.post('https://api.peerclick.com/v1_1/offer',offerBody,{headers}).then(a=>{
      succ = a.data
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    if(succ.description!='Success'){
      console.log('Offer creation failed');
      return false
    }
    let cam = {
      name: data.offerName,
      workspaceId: 1,
      trafficSource: ts,
      costModel: {
        type: "AUTO",
        currency: "USD"
      },
      country: {
        code: data.geo
      },
      domain: "track.jjstrack.com",
      tags: [],
      redirectTarget: {
        destination: "PATH",
        path: {
          defaultPaths: [
            {
              weight: 100,
              direct: 1,
              offers: [
                {
                  weight: 100,
                  id: succ.offer.id,
                }
              ]
            }
          ]
        }
      }
    }
    let campSuc = {}
    await axios.post('https://api.peerclick.com/v1_1/campaign',cam,{headers}).then(a=>{
      campSuc = a.data
    }).catch(err=>{
      console.log(err.response.data.description)
      return false
    })
    if(campSuc.description!='Success'){
      console.log('Campaign creation failed');
      return false
    }
    return campSuc.campaign.url
  }
}

module.exports = new dbManager();