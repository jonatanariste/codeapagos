import type { NextRequest } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-8928404133394808-030200-82b0e5e66c5ef336eff7814e687319e3-225552793",
});

export async function POST(request: NextRequest) {
  console.log("--------------------------- NE LLAMARON");

  let data = await request.formData();
  const json = JSON.stringify(Object.fromEntries(data));
  const datos = JSON.parse(json);
  console.log(datos.uid);

  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: datos.nombre,
          title: datos.producto,
          quantity: 1,
          unit_price: parseInt(datos.precio),
        },
      ],
      external_reference:
        (datos.producto as string) + "," + (datos.uid as string),
    },
  });
  redirect(preference.init_point!);

  return Response.json({ success: true });

  //return Response.json({ success: true });
}
