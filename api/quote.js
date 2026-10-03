const SOL='So11111111111111111111111111111111111111112';
const USDC='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.JUPITER_API_KEY)return res.status(503).json({error:'JUPITER_API_KEY no configurada en Vercel'});
 const amount=String(req.query.amount||''); const side=req.query.side==='USDC_SOL'?'USDC_SOL':'SOL_USDC';
 if(!/^\d+$/.test(amount)||BigInt(amount)<=0n)return res.status(400).json({error:'Cantidad inválida'});
 const inputMint=side==='SOL_USDC'?SOL:USDC,outputMint=side==='SOL_USDC'?USDC:SOL;
 const u=new URL('https://api.jup.ag/swap/v1/quote');u.searchParams.set('inputMint',inputMint);u.searchParams.set('outputMint',outputMint);u.searchParams.set('amount',amount);u.searchParams.set('slippageBps','100');u.searchParams.set('restrictIntermediateTokens','true');
 try{const r=await fetch(u,{headers:{'x-api-key':process.env.JUPITER_API_KEY}});const data=await r.json();return res.status(r.status).json(data)}catch(e){return res.status(502).json({error:'No se pudo consultar Jupiter'})}
}
