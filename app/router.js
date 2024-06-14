const { Router } = require('express')
const router = Router()
const dbManager = require('./managers/dbManager')

router.post('/ApiManager/get-tonik-info',async(req, res)=>{
  const tonicInfo = await dbManager.getTonicInfo(req.body.tonikIDd)
  if(tonicInfo.link&&tonicInfo.offer&&tonicInfo.country){
    res.status(200).send({
      ok:true,
      tonikLink:"https://"+tonicInfo.link,
      offerName:req.body.tonikIDd+" - "+tonicInfo.name,
      geo:tonicInfo.country
    })
  }else{
    res.status(200).send({
      ok:false
    })
  }
})
// /get-tonik-info  //API
// req: 
// { 
//    tonikIDd:str
// } 
// res: 
// {
//    tokinLink:str,
//    offerName:str,
//    geo:str
// } 

router.post('/ApiManager/create-link',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOffer(req.body)
  console.log('peerOffer:', peerOffer);
  if(peerOffer){
    res.status(200).send({
      ok:true,
      peerclickLink: "https"+peerOffer.split('http')[1]
    })
  }else{
    res.status(200).send({
      ok:false,
    })
  }
})
// /create-link  //API
// req: 
// { 
//    offerName:str,
//    geo:str,
//    offerLink:str
//    trafficSource:str,
// } 
// res: 
// { 
//    peerclickLink:str
// }

router.post('/ApiManager/create-link-dsp',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferDSP(req.body)
  if(peerOffer){
    res.status(200).send({
      ok:false,
      peerclickLink: "https"+peerOffer.split('http')[1]
    })
  }else{
    res.status(200).send({
      ok:false,
    })
  }
})
// /create-link-dsp
// req: 
// { 
//   offerName:str,
//   geo:str,
//   tonicLink:str,
//   trafficSource:str,
//   campaignText:str
// } 
// res: 
// { 
//   peerclickLink:str
// }

module.exports = router