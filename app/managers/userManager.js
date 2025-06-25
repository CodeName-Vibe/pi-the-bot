class UserManager{
  constructor() {
    console.log('User Manager connected!')

    this.database = [];

    this.newUser = function(id) {
      this.buffer = {
        step: 0,
        onRework: 0,
        id: id,
        userData: {
          network: '',
          tonikID: '',
          campId: 0,
          offerLink: {},
          offersCPC: {},
          offersDSP: {},
          currentOfferID: 0,
          branch: '',
          campaignText: '',
          team: '',
          trafficSource: '',
          headline: '',
          asid: '',
          terms: ''
        },
        editUserData: {
          operation: '',
          offerId: 0
        },
        apiData: {
          offerName: '',
          geo: '',
          trackingLink: '',
          offerBody: {}
        }
      }
      this.database.push(this.buffer);
      console.log(this.database.length)
    };

    this.setStep = function(id, step) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.step = step;
    }

    this.setOnRework = function(id, onRework) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.onRework = onRework;
    }

    this.setNetwork = function(id, network) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.network = network;
    }

    this.setName = function(id, offerName) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.apiData.offerName = offerName;
    }

    this.setLink = function(id, trackingLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.apiData.trackingLink = trackingLink;
    }

    this.setGeo = function(id, geo) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.apiData.geo = geo;
    }

    this.setCampId = function(id, campId) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.campId = campId;
    }

    this.setOfferLink = function(id, offerLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      if (offerLink == 'clear') {
        searchResult.userData.offerLink = {};
        return;
      } else {
        if (searchResult.userData.offerLink[offerLink]) {
          delete searchResult.userData.offerLink[offerLink];
        } else {
          searchResult.userData.offerLink[offerLink] = offerLink;
        }
      }
    }
    
    this.setOffersCPC = function(id, tonikID, offerName, geo, trackingLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      if (tonikID == 'clear') {
        searchResult.userData.offersCPC = {};
      } else {
        if (searchResult.userData.offersCPC[tonikID]) {
          delete searchResult.userData.offersCPC[tonikID];
        } else {
          searchResult.userData.offersCPC[tonikID] = {
            tonikID: tonikID,
            offerName: offerName,
            geo: geo,
            trackingLink: trackingLink
          };
        }
      }
    }

    this.setOffersDataDSP = function(id, tonikID, offerName, geo, trackingLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      if (tonikID == 'clear') {
        searchResult.userData.offersDSP = {};
      } else {
        if (!searchResult.userData.offersDSP[tonikID]) {
          searchResult.userData.offersDSP[tonikID] = {
            tonikID: tonikID,
            offerName: offerName,
            geo: geo,
            trackingLink: trackingLink,
            offerText: ''
          };
        }
      }
    }
    this.setOffersTextDSP = function(id, tonikID, offerText) {
      const searchResult = this.database.find(obj => obj.id === id);
      if (offerText == '/delete') {
        delete searchResult.userData.offersDSP[tonikID];
      } else {
        searchResult.userData.offersDSP[tonikID].offerText = offerText;
      }
    }

    this.setCurrentOfferID = function(id, currentOfferID) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.currentOfferID = currentOfferID;
    }

    this.setAPI = function(id, tonikID, offerName, geo, trackingLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.tonikID = tonikID;
      searchResult.apiData.offerName = offerName;
      searchResult.apiData.geo = geo;
      searchResult.apiData.trackingLink = trackingLink;
    }
    
    this.setBranch = function(id, branch) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.branch = branch;
    }
    
    this.setCampaignText = function(id, campaignText) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.campaignText = campaignText;
    }

    this.setTeam = function(id, team) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.team = team;
    }
    
    this.setTrafficSource = function(id, trafficSource) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.trafficSource = trafficSource;
    }
    
    this.setHeadline = function(id, headline) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.headline = headline;
    }

    this.setAsid = function(id, asid) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.asid = asid;
    }

    this.setTerms = function(id, terms) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.terms = terms;
    }

    this.setOperation = function(id, operation) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.editUserData.operation = operation;
    }

    this.setOfferId = function(id, offerId) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.editUserData.offerId = offerId;
    }



    this.getOnRework = function(id) {
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.onRework;
    }

    this.getStep = function(id) {
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.step;
    }

    this.getUser = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult;
    }

    this.getNetwork = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.network;
    }

    this.getTonikID = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.tonikID;
    }

    this.getOfferName = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.apiData.offerName;
    }

    this.getGeo = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.apiData.geo;
    }

    this.getCampId = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.campId;
    }

    this.getOfferLink = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return Object.values(searchResult.userData.offerLink);
    }

    this.getOffersCPC = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return Object.values(searchResult.userData.offersCPC);
    }

    this.getOffersDSP = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return Object.values(searchResult.userData.offersDSP);
    }
    this.getOfferDSP = function(id, tonikId){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.offersDSP[tonikId]?? null;
    }

    this.getCurrentOfferID = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.currentOfferID;
    }

    this.getTrackingLink = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.apiData.trackingLink;
    }

    this.getBranch = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.branch;
    }

    this.getCampaignText = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.campaignText;
    }

    this.getTeam = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.team;
    }

    this.getTrafficSource = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.trafficSource;
    }

    this.getHeadline = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.headline;
    }

    this.getAsid = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.asid;
    }

    this.getTerms = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.userData.terms;
    }

    this.getOperation = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.editUserData.operation;
    }

    this.getOfferId = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.editUserData.offerId;
    }
  }
}

module.exports = new UserManager()
