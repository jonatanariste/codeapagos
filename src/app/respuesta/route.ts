import type { NextRequest } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import axios from "axios";

const mercadopago = new MercadoPagoConfig({
  accessToken:
    "APP_USR-8928404133394808-030200-82b0e5e66c5ef336eff7814e687319e3-225552793",
});

async function postData(url = "", data = {}) {
  let loqueresulta = await axios
    .post(url, data)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  return loqueresulta;
  // Default options are marked with *
  // console.log("postData-a:", url);
  // const response = await fetch(url, {
  //   method: "POST", // *GET, POST, PUT, DELETE, etc.
  //   mode: "cors", // no-cors, *cors, same-origin
  //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: "same-origin", // include, *same-origin, omit
  //   headers: {
  //     "Content-Type": "application/json",

  //     // "Content-Type": "application/x-www-form-urlencoded",
  //     // 'Content-Type': 'application/x-www-form-urlencoded',
  //   },
  //   redirect: "follow", // manual, *follow, error
  //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //   body: JSON.stringify(data), // body data type must match "Content-Type" header
  // });
  // return response;
}
export async function POST(request: NextRequest) {
  const body = await request
    .json()
    .then((data) => data as { data: { id: string } });

  const payment = await new Payment(mercadopago).get({ id: body.data.id });

  console.log("Lo que vendimos------->", payment.external_reference);

  // console.log("--------------------->", payment.external_reference);
  // console.log("transaction_amount: ", payment.transaction_amount);
  // console.log("transaction_details:", payment.transaction_details);
  // console.log("payment_method_id:", payment.payment_method_id);
  // console.log("payer identification:", payment.payer);
  // console.log("date_created:", payment.date_created);
  //console.log("statement_descriptor:",payment.statement_descriptor)

  let referencias = payment.external_reference;
  let elUID: String[];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  elUID = referencias?.split(",");

  let datita = {
    texto: "vendido",
    uid: elUID[1],
    fecha: payment.date_created,
    curso: elUID[0],
    garbage: payment,
  };
  console.log("payment.status:", payment.status);
  if (payment && payment.status == "approved") {
    postData(process.env.API_URL, datita).then((data) => {
      console.log("Lo que respondió Firebase: ", data); // JSON data parsed by `data.json()` call
    });
  }

  return Response.json({ success: true });
}
