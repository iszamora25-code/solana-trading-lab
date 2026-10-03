export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.JUPITER_API_KEY)return res.status(503).json({error:'JUPITER_API_KEY no configurada en Vercel'});
 const {userPublicKey,quoteResponse}=req.body||{};
 if(!userPublicKey||!quoteResponse)return res.status(400).json({error:'Faltan datos del swap'});
 const impact=Number(quoteResponse.priceImpactPct||0);if(!Number.isFinite(impact)||impact>0.02)return res.status(400).json({error:'Impacto de precio superior al 2%'});
 try{const r=await fetch('https://api.jup.ag/swap/v1/swap',{method:'POST',headers:{'content-type':'application/json','x-api-key':process.env.JUPITER_API_KEY},body:JSON.stringify({userPublicKey,quoteResponse,dynamicComputeUnitLimit:true,prioritizationFeeLamports:{priorityLevelWithMaxLamports:{priorityLevel:'medium',maxLamports:100000}}})});const data=await r.json();return res.status(r.status).json(data)}catch(e){return res.status(502).json({error:'No se pudo construir el swap'})}
}
