import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui//input";
import { Textarea } from "@/components/ui/textarea";
// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-6537649453495569-030314-4c36cfce02b19ac590607a277cd3cf61-1708857327",
});
export default async function Home() {
  async function pagar(formData: FormData) {
    "use server";
    console.log("Formulario enviado");
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "donacion",
            title: formData.get("mensaje") as string,
            quantity: 1,
            unit_price: Number(formData.get("biyuya")),
          },
        ],
        external_reference:
          (formData.get("mensaje") as string) +
          "," +
          (formData.get("uid") as string),
      },
    });
    redirect(preference.sandbox_init_point!);
  }

  return (
    <>
      <form action={pagar} className="m-auto grid max-w-96 gap-8 border p-4">
        <Input type="number" placeholder="Ingrese monedita" name="biyuya" />
        <Input type="text" placeholder="Ingrese UID" name="uid" />
        <Textarea
          name="mensaje"
          placeholder="cursos separados x un -"
        ></Textarea>
        <Button type="submit">Enviar</Button>
      </form>
    </>
  );
}
