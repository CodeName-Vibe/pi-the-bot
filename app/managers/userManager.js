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
          tonikID: '',
          branch: '',
          campaignText: '',
          team: '',
          trafficSource: ''
        },
        apiData: {
          offerName: '',
          geo: '',
          tonikLink: ''
        }
      }
      this.database.push(this.buffer);
    };

    this.setStep = function(id, step) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.step = step;
    }

    this.setOnRework = function(id, onRework) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.onRework = onRework;
    }

    this.setAPI = function(id, tonikID, offerName, geo, tonikLink) {
      const searchResult = this.database.find(obj => obj.id === id);
      searchResult.userData.tonikID = tonikID;
      searchResult.apiData.offerName = offerName;
      searchResult.apiData.geo = geo;
      searchResult.apiData.tonikLink = tonikLink;
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

    this.getTonikLink = function(id){
      const searchResult = this.database.find(obj => obj.id === id);
      return searchResult.apiData.tonikLink;
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
  }
}

module.exports = new UserManager()
