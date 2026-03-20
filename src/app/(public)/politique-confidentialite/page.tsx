import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité (LPD)",
  description: "Politique de protection des données personnelles conformément à la nLPD 2023.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="pt-32 pb-20 bg-[#FEFCF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-4xl text-[#2C2C2C] mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Politique de confidentialité
        </h1>
        <p className="text-[#6B6B6B] mb-10">Conforme à la nLPD — Loi fédérale sur la Protection des Données (en vigueur depuis le 1er septembre 2023)</p>

        <div className="prose max-w-none text-[#2C2C2C]">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>1. Responsable du traitement</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Institut Belle & Sereine<br />
                Rue de la Paix 15, 1003 Lausanne, Suisse<br />
                contact@bellesereine.ch — +41 21 123 45 67
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>2. Données collectées</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Nous collectons les données suivantes dans le cadre de notre activité :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
                <li>Données d&apos;identification : nom, prénom, email, numéro de téléphone</li>
                <li>Données de réservation : services réservés, dates, historique des rendez-vous</li>
                <li>Données de paiement : traitées de manière sécurisée par Stripe (nous ne stockons pas les données bancaires)</li>
                <li>Notes de consultation : informations sur votre peau ou préférences communiquées volontairement</li>
                <li>Données de navigation : cookies techniques nécessaires au fonctionnement du site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>3. Finalités du traitement</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
                <li>La gestion de vos réservations et rendez-vous</li>
                <li>L&apos;envoi de confirmations et rappels de rendez-vous</li>
                <li>La personnalisation de vos soins</li>
                <li>La facturation et le traitement des paiements</li>
                <li>Le respect de nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>4. Base légale</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Le traitement de vos données repose sur : l&apos;exécution d&apos;un contrat (gestion des réservations),
                votre consentement (communications marketing), et nos obligations légales (comptabilité, TVA).
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>5. Conservation des données</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Vos données de clientèle sont conservées pendant 5 ans après votre dernière visite.
                Les données de paiement sont conservées 10 ans conformément aux obligations comptables suisses.
                Vous pouvez demander la suppression de vos données à tout moment (sous réserve des obligations légales).
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>6. Partage des données</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
                Stripe (paiements), Resend (emails transactionnels), nos hébergeurs en Suisse/UE.
                Ces prestataires sont liés par des accords de traitement conformes au RGPD et à la nLPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>7. Vos droits</h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-3">
                Conformément à la nLPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-1 text-[#6B6B6B]">
                <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
                <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
                <li><strong>Droit de suppression</strong> : demander l&apos;effacement de vos données</li>
                <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition</strong> : s&apos;opposer à certains traitements</li>
              </ul>
              <p className="text-[#6B6B6B] mt-3">
                Pour exercer ces droits : contact@bellesereine.ch
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>8. Cookies</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Ce site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement
                (session d&apos;authentification, préférences). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl text-[#8B7355] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>9. Réclamations</h2>
              <p className="text-[#6B6B6B] leading-relaxed">
                Si vous estimez que le traitement de vos données viole la nLPD, vous pouvez déposer
                une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT) :
                <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline ml-1">
                  www.edoeb.admin.ch
                </a>
              </p>
            </section>

            <p className="text-xs text-[#A0A0A0] pt-4 border-t border-[#E8E0D5]">
              Dernière mise à jour : mars 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
