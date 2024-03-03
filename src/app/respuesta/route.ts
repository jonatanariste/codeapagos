import type {NextRequest} from "next/server";

import {MercadoPagoConfig, Payment} from "mercadopago";

const mercadopago = new MercadoPagoConfig({accessToken: "TEST-6537649453495569-030314-4c36cfce02b19ac590607a277cd3cf61-1708857327"});

export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data as {data: {id: string}});

  const payment = await new Payment(mercadopago).get({id: body.data.id});

console.log("--------------------->",payment)


  return Response.json({success: true});
}