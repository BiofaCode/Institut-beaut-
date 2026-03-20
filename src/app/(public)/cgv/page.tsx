import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CGVPage() {
  return (
    <div className="pt-32 pb-20 bg-[#FEFCF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-4xl text-[#2C2C2C] mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Conditions Générales de Vente
        </h1>
        <p className="text-[#6B6B6B] mb-10">Institut Belle & Sereine — Lausanne, Suisse</p>

        <div className="space-y-8 text-[#6B6B6B]">
          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>1. Réservations</h2>
            <p className="leading-relaxed">
              Les réservations sont acceptées en ligne via notre site, par téléphone ou en institut.
              Toute réservation est soumise à disponibilité. La confirmation est envoyée par email
              après validation de la réservation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>2. Acompte</h2>
            <p className="leading-relaxed">
              Un acompte de 20% peut être demandé lors de la réservation de certains soins.
              Cet acompte est débité via Stripe de manière sécurisée. Il est déduit du montant total
              lors du paiement en institut.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>3. Annulation et modification</h2>
            <p className="leading-relaxed mb-3">
              Toute annulation ou modification doit être effectuée au minimum 24 heures avant le rendez-vous.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Annulation &gt; 24h avant : remboursement intégral de l&apos;acompte</li>
              <li>Annulation &lt; 24h avant : l&apos;acompte est conservé</li>
              <li>No-show (absence sans annulation) : l&apos;acompte est conservé et un frais supplémentaire peut être facturé</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>4. Tarifs et paiement</h2>
            <p className="leading-relaxed">
              Tous nos tarifs sont en francs suisses (CHF) et incluent la TVA au taux en vigueur.
              Les modes de paiement acceptés sur place sont : TWINT, carte bancaire (Visa, Mastercard),
              espèces. Les chèques ne sont pas acceptés.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>5. Retards</h2>
            <p className="leading-relaxed">
              En cas de retard de votre part, nous ferons notre maximum pour réaliser le soin.
              Cependant, si le retard dépasse 15 minutes, nous nous réservons le droit de raccourcir
              ou d&apos;annuler le soin, le tarif complet restant dû.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>6. Contre-indications</h2>
            <p className="leading-relaxed">
              Il est de votre responsabilité de nous informer de toute condition médicale, allergie,
              grossesse ou contre-indication avant votre soin. L&apos;institut ne saurait être tenu
              responsable en cas d&apos;omission de ces informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>7. Droit applicable</h2>
            <p className="leading-relaxed">
              Les présentes CGV sont soumises au droit suisse. Tout litige sera de la compétence
              exclusive des tribunaux de Lausanne.
            </p>
          </section>

          <p className="text-xs text-[#A0A0A0] pt-4 border-t border-[#E8E0D5]">
            Dernière mise à jour : mars 2024
          </p>
        </div>
      </div>
    </div>
  );
}
