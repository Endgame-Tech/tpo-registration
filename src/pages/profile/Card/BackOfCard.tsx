import { CardLogo } from "../../../components/TopLogo";

export default function BackOfCard() {
  return (
    <section className="grid gap-8 dark:text-text-light">
      <p className="text-white">Back of Card</p>
      <div className="flex flex-col p-8 gap-4 justify-between from-accent-green/80 to-accent-red/60 relative w-[500px] h-[315px] rounded-3xl   bg-hero overflow-hidden isolate">
        <img
          src="/tnnp_bkg.jpg"
          className="absolute top-0 left-0 w-[500px] h-[315px] -z-10"
        />
        <figure className="flex justify-center">
          <CardLogo className="w-48" />
        </figure>
        <div className="flex flex-col  text-center text-sm">
          <p className="font-black text-xl text-[#096F30]">
            Contact Information
          </p>
          <p>www.tnnp.com</p>
          <p>support@tnnp.com</p>
        </div>

        <div className="p-0.5 rounded-md bg-gradient-to-r from-[#096F30] to-accent-red/60">
          <p className="text-center text-sm p-2 bg-white  rounded-md">
            This card remains the property of the Obidient Movement. <br />
            Unauthorized use, duplication, or misrepresentation is prohibited.
          </p>
        </div>
      </div>
    </section>
  );
}
