import type { NextRequest } from "next/server";

import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken:
    "TEST-6537649453495569-030314-4c36cfce02b19ac590607a277cd3cf61-1708857327",
});

export async function POST(request: NextRequest) {
  const body = await request
    .json()
    .then((data) => data as { data: { id: string } });

  const payment = await new Payment(mercadopago).get({ id: body.data.id });

  console.log("--------------------->", payment.external_reference);
  const url = "https://us-central1-edrfinal.cloudfunctions.net/addVenta";

  // $options = array(
  //     'http' => array(
  //         'header'  => "Content-type: application/x-www-form-urlencoded",
  //         'method'  => 'POST',
  //         'content' => http_build_query($data)
  //     )
  // );
  let elUID = [] as Array;
  elUID = payment.external_reference?.split(",");
  let datita = {
    texto: "vendido",
    uid: elUID[1],
    fecha: "23/3/24",
    curso: elUID[0],
    garbage: payment,
  };
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",

        // "Content-Type": "application/x-www-form-urlencoded",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
  }

  if (payment.status == "approved")
    postData(url, datita).then((data) => {
      console.log(
        "-------------------------------------",
        "MANDADO",
        datita.uid,
        datita.curso
      ); // JSON data parsed by `data.json()` call
    });

  return Response.json({ success: true });

  //return Response.json({ success: true });
}
