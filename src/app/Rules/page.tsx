import { Metadata } from "next";
import rulesStyles from "./Rules.module.css";
import SmoothAnchor from "../components/Common/SmoothAnchor";

export const metadata: Metadata = {
    title: "Pravila - Cro Cube Comp",
    description:
        "Pravila za Cro Cube Comp natjecanja koja prate WCA pravilnik.",
    keywords: [
        "Cro Cube Comp",
        "Cro Cube Club",
        "Cro.cube.club@gmail.com",
        "Pravila Cro Cube Comp",
        "Pravila",
    ],
};

export const dynamic = "error";

export default function Rules() {
    return (
        <main>
            <nav>
                <ol>
                    <li>
                        <SmoothAnchor href="#pravila1">
                            SLOŽENO STANJE
                        </SmoothAnchor>
                    </li>
                    <li>
                        <SmoothAnchor href="#pravila2">PROSJEK</SmoothAnchor>
                    </li>
                    <li>
                        <SmoothAnchor href="#pravila3">INSPEKCIJA</SmoothAnchor>
                    </li>
                </ol>
            </nav>

            <article>
                <p>
                    Dragi natjecatelji, u nastavku se nalaze pravila natjecanja
                    u slaganju Rubikove kocke. Ova pravila temelje se na
                    službenom pravilniku organizacije WCA, a ovdje su sažeta i
                    prevedena radi lakšeg razumijevanja.
                </p>
                <p>
                    Riječ &quot;slagalica&quot; odnosi se na sve vrste kocka na
                    ovom natjecanju: 2x2, 3x3, 4x4, 5x5, 6x6, 7x7, skewb,
                    piraminx i clock.
                </p>

                <a id="pravila1"></a>
                <h2>1. SLOŽENO STANJE</h2>
                <p>
                    <span className={rulesStyles["numbering"]}>1.1 </span>U
                    obzir se uzima isključivo položaj Rubikove kocke u
                    mirovanju, nakon zaustavljanja mjerača vremena.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.2 </span>
                    Valjanim se smatra isključivo stanje slagalice u mirovanju,
                    nakon što je mjerač vremena zaustavljen.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.3 </span>
                    Slagalica može biti u bilo kojoj orijentaciji na kraju
                    rješavanja.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.4 </span>
                    Svi dijelovi slagalice moraju biti fizički pričvršćeni za
                    samu slagalicu i u potpunosti smješteni na svoja predviđena
                    mjesta.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.5 </span>
                    Ako nisu potrebni dodatni potezi kako bi slagalica dosegla
                    potpuno riješeno stanje, smatra se riješenom bez kazne.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.6 </span>
                    Ako je potreban jedan potez da bi se slagalica dovela u
                    riješeno stanje, rezultat se bilježi s vremenskom kaznom od{" "}
                    <span className={rulesStyles["yellow"]}>+2 sekunde</span>.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.6 </span>
                    Ako su potrebna dva ili više dodatna poteza, pokušaj se
                    smatra neuspješnim{" "}
                    <span className={rulesStyles["red"]}>
                        (DNF – Did Not Finish)
                    </span>
                    .
                </p>

                <p>
                    <span className={rulesStyles["numbering"]}>1.7 </span>
                    Granice dopuštenog neporavnanja određene su tako da jasno
                    razdvajaju stanje slagalice koje se smatra riješenim (bez
                    kazne) od onoga koje zahtijeva dodatni potez.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>1.8 </span>Za
                    kocke NxNxN: dopušteno je maksimalno neporavnanje do 45
                    stupnjeva.
                </p>

                <a id="pravila2"></a>
                <h2>2. PROSJEK</h2>
                <p>
                    <span className={rulesStyles["numbering"]}>2.1 </span>U
                    rundama koje se vrednuju prema pravilu &quot;Prosjek od
                    5&quot;, natjecateljima je dopušteno pet pokušaja. Od tih
                    pet pokušaja, najbolji i najgori rezultat se izostavljaju, a
                    aritmetička sredina preostala tri pokušaja određuje plasman
                    natjecatelja u toj rundi.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>2.2 </span>U
                    rundama tipa &quot;Prosjek od 5&quot;, jedan rezultat
                    označen kao{" "}
                    <span className={rulesStyles["red"]}>
                        DNF (Did Not Finish – nije dovršeno)
                    </span>{" "}
                    ili{" "}
                    <span className={rulesStyles["red"]}>
                        DNS (Did Not Start – nije započeto)
                    </span>{" "}
                    smije se uzeti kao najgori rezultat u rundi. Ako natjecatelj
                    ima dva ili više DNF i/ili DNS rezultata unutar iste runde,
                    njegov prosjek za tu rundu smatra se nevažećim{" "}
                    <span className={rulesStyles["red"]}>(DNF)</span>.
                </p>
                <p>Napomena:</p>
                <p>
                    &quot;Prosjek od 5&quot; (Average of 5, Ao5) je format u
                    kojem se rješava slagalica pet puta, a rezultat se računa
                    kao prosjek srednja tri vremena (nakon izbacivanja najbržeg
                    i najsporijeg).
                </p>
                <p>
                    DNF (Did Not Finish): pokušaj nije uspješno dovršen (npr.
                    slagalica nije riješena prema pravilima).
                </p>
                <p>
                    DNS (Did Not Start): pokušaj nije započet (npr. natjecatelj
                    nije pristupio pokušaju ili je odustao prije početka).
                </p>

                <a id="pravila3"></a>
                <h2>3 INSPEKCIJA</h2>
                <p>
                    <span className={rulesStyles["numbering"]}>3.1 </span>
                    Natjecatelj ima pravo pregledati slagalicu na početku svakog
                    pokušaja.
                </p>
                <p>
                    <span className={rulesStyles["numbering"]}>3.2 </span>Za
                    pregled slagalice i početak slaganja natjecatelju je
                    dopušteno najviše 15 sekundi, pri čemu slaganje mora
                    započeti prije nego što istekne petnaesta sekunda.
                </p>
            </article>
        </main>
    );
}
