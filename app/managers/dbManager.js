const axios = require("axios");
const staticData = require('../staticData.json')

class dbManager {
  peerclickCredenrials = {
    email: "evgenii.teliatnykov@mirs.com",
    password: "L;7D+NXE%uHp#c6A"
  };

  afdCredentials = {
    key: '7af142ce33dc0306d155800050e4ef8ebdff2fdbcfab0ac51e05b013a8da5ac8',
    secret: '2d6bb6233349ba251d4c7cc2cbcf73b2ef1d6c10c50293abe8d1e701719fc30f'
  };

  rsocCredentials = {
    key: '38cff87ff8e88965cf5d3dfb6b630adf4579dcb6bcf6a476d94e3a835b8c98a3',
    secret: '72a347a66568c5af3629fa74ad182e0ae030774021231950b4908b3e1c321585'
  };

  constructor() {
    console.log('db manager conected')
  }

  async getTonicInfo(tonicId){
    try {
      const authResponse = await axios.post('https://api.publisher.tonic.com/jwt/authenticate', {
        consumer_key: this.afdCredentials.key,
        consumer_secret: this.afdCredentials.secret
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
      return needed;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async getTonicRSOCInfo(tonicId){
    try {
      const authResponse = await axios.post('https://api.publisher.tonic.com/jwt/authenticate', {
        consumer_key: this.rsocCredentials.key,
        consumer_secret: this.rsocCredentials.secret
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
      return needed;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async createPeerclickOffer(data){
    let token = 'a'
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
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
      consumer_key: this.afdCredentials.key,
      consumer_secret: this.afdCredentials.secret
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

  async createPeerclickOfferRsocCPC(data) {
    let token = 'a'
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
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
        tail = staticData.tails.cpcRsocMgid;
        break;
      case 'TABOOLA':
        ts = 56
        tail = staticData.tails.cpcRsocTaboola;
        break;
    }
    if(tail=='no_tail('){
      return false
    }else if(ts==0){
      return false
    }

    let offers = [];
    for (let offer of data.offersCPC) {
      let geo = offer.geo == 'WO' ? 'GLB' : offer.geo;
      let offerBody = {
        name: offer.offerName,
        workspaceId: 1,
        url: offer.trackingLink + tail,
        country: {
          code: geo
        },
        affiliateNetwork: {
          id: 1
        },
        payout: {
          type: "AUTO",
          value: null,
          currency: "USD"
        }
      };

      try {
        let response = await axios.post('https://api.peerclick.com/v1_1/offer', offerBody, { headers });
        let succ = response.data;

        if (succ.description !== 'Success') {
          console.log('Offer creation failed');
          return false;
        }

        offers.push({ weight: 100, id: succ.offer.id });
      } catch (err) {
        console.log(err.message);
        return false;
      }
    }

    let geo = data.geo == 'WO' ? 'GLB' : data.geo;
    let cam = {
      name: data.offerName,
      workspaceId: 1,
      trafficSource: ts,
      costModel: {
        type: "AUTO",
        currency: "USD"
      },
      country: {
        code: geo
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
              offers: offers
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
      consumer_key: this.rsocCredentials.key,
      consumer_secret: this.rsocCredentials.secret
    }, { headers: { 'Content-Type': 'application/json' } });
    for (let offer of data.offersCPC) {
      let call = {
        campaign_id: offer.tonikID,
        type: "preestimated_revenue",
        url: "http://pstb.gopeerclick.com/postback?userid=43738&cid={subid4}&status={event}&payout={revenue}&currency={currency}&status=approved&keyword={keyword}"
      }
      const tonicInfoResponse = await axios.post(`https://api.publisher.tonic.com/privileged/v3/campaign/callback`,call, {
        headers: {
          'Authorization': 'Bearer ' + authResponse.data.token,
          'Content-Type': 'application/json'
        }
      });
      console.log(tonicInfoResponse)
    }
    return campSuc.campaign.url
  }

  async createPeerclickOfferRsocDSP(data) {
    let token = 'a'
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
      token = a.data.token
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    let headers = {'api-token': token}
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
      case 'dAuto':
        ts = 64
        break;
      case 'lAuto':
        ts = 63
        break;
      case 'yAuto':
        ts = 62
        break;
    } 
    if(ts==0){
      return false
    }

    let offers = [];
    for (let offer of data.offersDSP) {
      let tail = '?adtitle='
      for (let i = 0; i < offer.offerText.length; i++) {
        let symbol = offer.offerText[i]
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
      let geo = offer.geo == 'WO' ? 'GLB' : offer.geo;
      let offerBody = {
        name: offer.offerName,
        workspaceId: 1,
        url: offer.trackingLink + tail,
        country: {
          code: geo
        },
        affiliateNetwork: {
          id: 1
        },
        payout: {
          type: "AUTO",
          value: null,
          currency: "USD"
        }
      };

      try {
        let response = await axios.post('https://api.peerclick.com/v1_1/offer', offerBody, { headers });
        let succ = response.data;

        if (succ.description !== 'Success') {
          console.log('Offer creation failed');
          return false;
        }

        offers.push({ weight: 100, id: succ.offer.id });
      } catch (err) {
        console.log(err.message);
        return false;
      }
    }

    let geo = data.geo == 'WO' ? 'GLB' : data.geo;
    let cam = {
      name: data.offerName,
      workspaceId: 1,
      trafficSource: ts,
      costModel: {
        type: "AUTO",
        currency: "USD"
      },
      country: {
        code: geo
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
              offers: offers
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
      consumer_key: this.rsocCredentials.key,
      consumer_secret: this.rsocCredentials.secret
    }, { headers: { 'Content-Type': 'application/json' } });
    for (let offer of data.offersDSP) {
      let call = {
        campaign_id: offer.tonikID,
        type: "preestimated_revenue",
        url: "http://pstb.gopeerclick.com/postback?userid=43738&cid={subid4}&status={event}&payout={revenue}&currency={currency}&status=approved&keyword={keyword}"
      }
      const tonicInfoResponse = await axios.post(`https://api.publisher.tonic.com/privileged/v3/campaign/callback`,call, {
        headers: {
          'Authorization': 'Bearer ' + authResponse.data.token,
          'Content-Type': 'application/json'
        }
      });
      console.log(tonicInfoResponse)
    }
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
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
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
      case 'dAuto':
        ts = 64
        break;
      case 'lAuto':
        ts = 63
        break;
      case 'yAuto':
        ts = 62
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
      consumer_key: this.afdCredentials.key,
      consumer_secret: this.afdCredentials.secret
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
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
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

  async createPeerclickOfferInuvo(data){
    let token = 'a'
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
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
        tail = staticData.tails.inuvoMgid;
        break;
      case 'REV0':
        ts = 68
        tail = staticData.tails.inuvoRev;
        break;
      case 'REV1':
        ts = 67
        tail = staticData.tails.inuvoRev;
        break;
      case 'REV2':
        ts = 66
        tail = staticData.tails.inuvoRev;
        break;
    }
    if(tail=='no_tail('){
      return false
    }else if(ts==0){
      return false
    } else if(token=='a'){
      console.log('Invalid token');
      return false
    }

    let offers = [];
    for (let [i, offerLink] of data.offerLinks.entries()) {
      let offerBody = {
        name: data.offerName + ' - ' + (i + 1),
        workspaceId: 1,
        url: offerLink + tail + data.campId,
        country: {
          code: data.geo
        },
        affiliateNetwork: {
          id: 10
        },
        payout: {
          type: "AUTO",
          value: null,
          currency: "USD"
        }
      };

      try {
        let response = await axios.post('https://api.peerclick.com/v1_1/offer', offerBody, { headers });
        let succ = response.data;

        if (succ.description !== 'Success') {
          console.log('Offer creation failed');
          return false;
        }

        offers.push({ weight: 100, id: succ.offer.id });
      } catch (err) {
        console.log(err.message);
        return false;
      }
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
              offers: offers
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
    return campSuc.campaign.url.replace("&rc_uuid={rc_uuid}", "")
  }

  async createPeerclickOfferMarmar(data){
    let token = 'a'
    await axios.post('https://api.peerclick.com/v1_1/auth/session',this.peerclickCredenrials).then(a=>{
      token = a.data.token
    }).catch(err=>{
      console.log(err.message)
      return false
    })
    let headers = {'api-token': token}
    let urlLink = 'no_url('
    let ts = 0
    switch (data.trafficSource) {
      case 'NEWSBREAK':
        ts = 69
        urlLink = staticData.tails.marmarNewsbreakPretail+data.trafficSource.toLowerCase()+'&locale='+data.geo+'&q='+data.headline+'&rac={token6}&asid='+data.asid+'&terms='+data.terms;
        break;
      case 'REVCONTENT':
        ts = 2
        urlLink = staticData.tails.marmarRevcontentPretail+data.trafficSource.toLowerCase()+'&locale='+data.geo+'&q='+data.headline+'&rac={trackingField5}&asid='+data.asid+'&terms='+data.terms;
        break;
    }
    if(urlLink=='no_url('){
      return false
    }else if(ts==0){
      return false
    }
    let offerBody = {
      name: data.offerName,
      workspaceId: 1,
      url: urlLink,
      country: {
        code: data.geo.split('_')[1]
      },
      affiliateNetwork: {
        id: 12
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
        code: data.geo.split('_')[1]
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