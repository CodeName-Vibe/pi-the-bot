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

router.post('/ApiManager/get-tonik-rsoc-info',async(req, res)=>{
  const tonicInfo = await dbManager.getTonicRSOCInfo(req.body.tonikIDd)
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
    console.log('CPC RSOC Tracking link created');
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
//    offersCPC:array<{offerName:str, offerLink:str, geo:str}>,
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

module.exports = router