// src/app/(frontend)/about/page.tsx
import FooterContact from "@/app/components/FooterContact";
import About from "@/app/components/About";


export default async function Page() {


  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <About />
        <FooterContact />
      </div>
    </main>
  );
}
