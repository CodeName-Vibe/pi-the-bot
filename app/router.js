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

router.post('/ApiManager/get-tonik-rsoc1-info',async(req, res)=>{
  const tonicInfo = await dbManager.getTonicRSOC1Info(req.body.tonikIDd)
  if(tonicInfo.link&&tonicInfo.offer&&tonicInfo.country){
    res.status(200).send({
      ok:true,
      tonikLink:tonicInfo.direct_link,
      offerName:req.body.tonikIDd+" - "+tonicInfo.name,
      geo:tonicInfo.country
    })
  }else{
    res.status(200).send({
      ok:false
    })
  }
})
// /get-tonik-rsoc1-info  //API
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

router.post('/ApiManager/get-tonik-rsoc2-info',async(req, res)=>{
  const tonicInfo = await dbManager.getTonicRSOC2Info(req.body.tonikIDd)
  if(tonicInfo.link&&tonicInfo.offer&&tonicInfo.country){
    res.status(200).send({
      ok:true,
      tonikLink:tonicInfo.direct_link,
      offerName:req.body.tonikIDd+" - "+tonicInfo.name,
      geo:tonicInfo.country
    })
  }else{
    res.status(200).send({
      ok:false
    })
  }
})
// /get-tonik-rsoc2-info  //API
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
  if(peerOffer){
    console.log('CPC AFD Tracking link created');
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
//    link:str
//    trafficSource:str,
// } 
// res: 
// { 
//    peerclickLink:str
// }

router.post('/ApiManager/create-link-rsoc',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferRsocCPC(req.body)
  if(peerOffer){
    switch (req.body.trafficSource) {
      case 'MGID':
        console.log('CPC RSOC1 Tracking link created');
        break;
      case 'TABOOLA':
        console.log('CPC RSOC2 Tracking link created');
        break;
    }
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
// /create-link-rsoc  //API
// req: 
// { 
//    offerName:str,
//    geo:str,
//    trafficSource:str,
//    offersCPC:array<{tonikID:num, offerName:str, trackingLink:str, geo:str}>,
// } 
// res: 
// { 
//    peerclickLink:str
// }

router.post('/ApiManager/create-link-rsoc-dsp',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferRsocDSP(req.body)
  if(peerOffer){
    console.log('DSP RSOC Tracking link created');
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
// /create-link-rsoc  //API
// req: 
// { 
//    offerName:str,
//    geo:str,
//    trafficSource:str,
//    offersDSP:array<{tonikID:num, offerName:str, trackingLink:str, geo:str, offerText:str}>,
// } 
// res: 
// { 
//    peerclickLink:str
// }

router.post('/ApiManager/create-link-dsp',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferDSP(req.body)
  if(peerOffer){
    console.log('DSP AFD Tracking link created');
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
// /create-link-dsp
// req: 
// { 
//   offerName:str,
//   geo:str,
//   link:str,
//   trafficSource:str,
//   campaignText:str
// } 
// res: 
// { 
//   peerclickLink:str
// }

router.post('/ApiManager/create-link-domain',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferDomain(req.body)
  if(peerOffer){
    console.log('Domain Tracking link created');
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
// /create-link-domain
// req: 
// { 
//   offerName:str,
//   geo:str,
//   link:str,
//   trafficSource:str
// } 
// res: 
// { 
//   peerclickLink:str
// }

router.post('/ApiManager/create-link-inuvo',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferInuvo(req.body)
  if(peerOffer){
    console.log('Inuvo Tracking link created');
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
// /create-link-inuvo
// req: 
// { 
//   offerName:str,
//   geo:str,
//   trafficSource:str,
//   campId:num,
//   offerLinks:array<str>
// } 
// res: 
// { 
//   peerclickLink:str
// }

router.post('/ApiManager/create-link-marmar',async(req, res)=>{
  const peerOffer = await dbManager.createPeerclickOfferMarmar(req.body)
  if(peerOffer){
    console.log('MarMar Tracking link created');
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
// /create-link-marmar
// req: 
// { 
//   offerName:str,
//   geo:str,
//   trafficSource:str,
//   headline:str,
//   asid:str,
//   terms:str
// } 
// res: 
// { 
//   peerclickLink:str
// }

router.post('/ApiManager/get-peerclick-offer',async(req, res)=>{
  const offerBody = await dbManager.getPeerclickOffer(req.body.offerId)
  if(offerBody){
    res.status(200).send({
      ok:true,
      offer: offerBody
    })
  }else{
    res.status(200).send({
      ok:false
    })
  }
})
// /get-peerclick-offer
// req: 
// { 
//    offerId:number
// } 
// res: 
// {
//    ok: boolean,
//    offer: {}
// }

router.post('/ApiManager/edit-marmar-offer-terms',async(req, res)=>{
  const responce = await dbManager.setPeerclickMarmarOfferTerms(req.body.offerId, req.body.offerBody)
  if(responce){
    console.log('MarMar offer terms edited');
    res.status(200).send({
      ok:true
    })
  }else{
    res.status(200).send({
      ok:false
    })
  }
})
// /edit-marmar-offer-terms
// req: 
// { 
//    offerId:number
//    offerBody:{
//      name:str,
//      url:str,
//      country:{code:str},
//      affiliateNetwork:{id:number},
//      payout:{type:str,value:null,currency:str}
//    }
// } 
// res: 
// {
//    ok: boolean
// }

module.exports = router