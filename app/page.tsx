import React from "react";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center align-center grow bg-[url('../public/laakis.jpg')]">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-2">Tekoäly-Laudatur</h2>
        <p className="text-2xl">
          BilsaGPT on virtuaalinen oppimisympäristö, jossa robottiope valmentaa
          sinut <i>voittoon</i>.
        </p>
      </div>
    </section>
  );
}
