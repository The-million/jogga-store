import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// https://unsplash.com/photos/{id}
const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop`;

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin + demo users ──────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin1234!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@jogga.store' },
    update: { passwordHash: adminHash, role: 'ADMIN' },
    create: {
      email: 'admin@jogga.store',
      passwordHash: adminHash,
      fullName: 'Admin Jogga',
      phone: '+242060000001',
      role: 'ADMIN',
    },
  });

  const customerHash = await bcrypt.hash('Demo1234!', 10);
  await prisma.user.upsert({
    where: { email: 'client@demo.com' },
    update: {},
    create: {
      email: 'client@demo.com',
      passwordHash: customerHash,
      fullName: 'Marie Mboungou',
      phone: '+242060000002',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Utilisateurs: admin@jogga.store / Admin1234!  |  client@demo.com / Demo1234!');

  // ── Categories ──────────────────────────────────────────────
  const catData = [
    {
      slug: 'electronique',
      name: 'Électronique',
      imageUrl: U('1518770660439-4636190af475'),
    },
    {
      slug: 'mode-homme',
      name: 'Mode Homme',
      imageUrl: U('1490578474895-699cd4e2cf59'),
    },
    {
      slug: 'mode-femme',
      name: 'Mode Femme',
      imageUrl: U('1483985988355-763728e1935b'),
    },
    {
      slug: 'maison',
      name: 'Maison & Déco',
      imageUrl: U('1484154218962-a197022b5858'),
    },
    {
      slug: 'sport',
      name: 'Sport & Fitness',
      imageUrl: U('1571019613454-1cb2f99b2d8b'),
    },
    {
      slug: 'beaute',
      name: 'Beauté & Soin',
      imageUrl: U('1596755377451-c208f6b3266a'),
    },
  ];

  const cats = await Promise.all(
    catData.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, imageUrl: c.imageUrl },
        create: c,
      })
    )
  );

  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));
  console.log(`✅ ${cats.length} catégories`);

  // ── Products ────────────────────────────────────────────────
  const products = [
    // ── ÉLECTRONIQUE (12) ──────────────────────────────────────
    {
      name: 'Écouteurs Sans Fil Pro ANC',
      slug: 'ecouteurs-sans-fil-pro-anc',
      description:
        'Réduction de bruit active, Bluetooth 5.3. Autonomie 8h + étui charge 32h. Son Hi-Fi, micro ENC pour appels clairs. Résistance IPX5, design ergonomique.',
      price: 15000,
      comparePrice: 25000,
      stock: 48,
      cat: 'electronique',
      img: U('1505740420928-5e560c06d30e'),
    },
    {
      name: 'Montre Connectée Sport GPS',
      slug: 'montre-connectee-sport-gps',
      description:
        'GPS intégré, fréquence cardiaque 24h, SpO2, 100+ modes sportifs. Étanche 5ATM, autonomie 14 jours. Écran AMOLED 1.43". Compatible Android & iOS.',
      price: 28000,
      comparePrice: 42000,
      stock: 31,
      cat: 'electronique',
      img: U('1523275335684-37898b6baf30'),
    },
    {
      name: 'Batterie Externe 20000mAh 65W',
      slug: 'batterie-externe-20000mah-65w',
      description:
        'Charge ultra-rapide 65W compatible MacBook, tablettes et smartphones. 3 USB-A + 1 USB-C. Affichage LED. Certifié compagnies aériennes. Garantie 1 an.',
      price: 22000,
      comparePrice: 32000,
      stock: 55,
      cat: 'electronique',
      img: U('1609592806596-9e0bef89c34f'),
    },
    {
      name: 'Enceinte Bluetooth 360° Waterproof',
      slug: 'enceinte-bluetooth-360-waterproof',
      description:
        'Son stéréo 30W, basses profondes. Résistance IPX7 (immersion 1m/30min). Autonomie 15h, micro intégré. Connexion TWS pour coupler 2 enceintes.',
      price: 38000,
      comparePrice: 55000,
      stock: 22,
      cat: 'electronique',
      img: U('1608043152269-423dbba4e7e1'),
    },
    {
      name: 'Câble USB-C Rapide 2m Renforcé',
      slug: 'cable-usb-c-rapide-2m-renforce',
      description:
        'Charge rapide 100W, transfert données 10Gbps. Gaine tressée nylon haute durabilité, tête zinc anti-déchirement. Compatible tous appareils USB-C.',
      price: 4500,
      comparePrice: 7000,
      stock: 200,
      cat: 'electronique',
      img: U('1587145820266-a5951ee6f620'),
    },
    {
      name: 'Casque Gaming RGB 7.1 Surround',
      slug: 'casque-gaming-rgb-7-1-surround',
      description:
        'Son surround 7.1 virtuel, micro directionnel antibruit. Coussinets mémoire de forme, arceau réglable. Éclairage RGB personnalisable. Compatible PC/PS5/Xbox.',
      price: 25000,
      comparePrice: 38000,
      stock: 18,
      cat: 'electronique',
      img: U('1598550476-3037-4b77-b8d5-ef58a88b3c5d'),
    },
    {
      name: 'Chargeur Rapide 67W Multi-Ports',
      slug: 'chargeur-rapide-67w-multi-ports',
      description:
        '4 ports simultanés : 2 USB-C PD + 2 USB-A QC4. Charge téléphone 0-50% en 15 min. Protection surtension, compact pliable. Compatible universelle.',
      price: 16000,
      comparePrice: 24000,
      stock: 80,
      cat: 'electronique',
      img: U('1526738549149-8e07eca56360'),
    },
    {
      name: 'Webcam 4K Grand Angle 120°',
      slug: 'webcam-4k-grand-angle-120',
      description:
        'Résolution 4K 30fps, autofocus AI, grand angle 120°. Micro stéréo antibruit intégré. Plug & play USB, compatible Zoom, Teams, Google Meet.',
      price: 35000,
      comparePrice: 50000,
      stock: 14,
      cat: 'electronique',
      img: U('1611532736597-de2d4265fba3'),
    },
    {
      name: 'Souris Sans Fil Silencieuse Ergonomique',
      slug: 'souris-sans-fil-silencieuse-ergonomique',
      description:
        'Design vertical ergonomique, clics 90% silencieux. DPI réglable 800-2400, récepteur USB nano. Autonomie 18 mois avec 2 piles AA. Ambidextre.',
      price: 18000,
      comparePrice: 26000,
      stock: 42,
      cat: 'electronique',
      img: U('1527864550417-7fd91fc51a46'),
    },
    {
      name: 'Tablette Android 10 pouces 4G',
      slug: 'tablette-android-10-pouces-4g',
      description:
        'Écran IPS Full HD 10", processeur octa-core, 4GB RAM + 64GB stockage. 4G LTE, WiFi 6, Bluetooth 5. Batterie 6000mAh, caméra 13MP. Android 14.',
      price: 120000,
      comparePrice: 160000,
      stock: 9,
      cat: 'electronique',
      img: U('1561154464-02bf7e16f3e0'),
    },
    {
      name: 'Stabilisateur Gimbal Smartphone 3 Axes',
      slug: 'stabilisateur-gimbal-smartphone',
      description:
        'Stabilisation 3 axes, suivi IA du visage/corps. Autonomie 8h, pliable compact. Application dédication (timelapse, panorama, slow motion). USB-C rechargeable.',
      price: 45000,
      comparePrice: 65000,
      stock: 11,
      cat: 'electronique',
      img: U('1526170375885-4d8ecf77b99f'),
    },
    {
      name: 'Lampe LED Bureau USB Tactile',
      slug: 'lampe-led-bureau-usb-tactile',
      description:
        'Luminosité 5 niveaux, 3 températures (chaud/naturel/froid). Bras flexible 360°. Port USB-A intégré. Minuterie auto-extinction 30/60 min. Économie d\'énergie.',
      price: 12000,
      comparePrice: 18000,
      stock: 67,
      cat: 'electronique',
      img: U('1567538096621-38d2284b23ff'),
    },

    // ── MODE HOMME (8) ─────────────────────────────────────────
    {
      name: 'Polo Business Slim Fit Coton Piqué',
      slug: 'polo-business-slim-fit',
      description:
        '100% coton piqué premium, coupe slim moderne. Col classique 3 boutons, broderie logo discret. Disponible en 6 coloris. Lavable en machine à 40°C. Tailles S-3XL.',
      price: 18000,
      comparePrice: 28000,
      stock: 75,
      cat: 'mode-homme',
      img: U('1598300388-b39df8b18f57'),
    },
    {
      name: 'Jean Slim Premium Stretch Dark',
      slug: 'jean-slim-premium-stretch-dark',
      description:
        'Denim stretch 98% coton / 2% élasthanne. Coupe slim confortable, délavage dark stone. Poches renforcées, ceinture ajustable. Tailles 28-42 en longueur 30/32.',
      price: 32000,
      comparePrice: 48000,
      stock: 56,
      cat: 'mode-homme',
      img: U('1542272604-787c3835535d'),
    },
    {
      name: 'Veste Blazer Casual Lin-Coton',
      slug: 'veste-blazer-casual-lin-coton',
      description:
        'Mélange lin/coton léger, respirant. Coupe moderne légèrement déstructurée. Boutons dorés, 2 poches extérieures. Idéal bureau ou soirées. Tailles S-XL.',
      price: 55000,
      comparePrice: 80000,
      stock: 18,
      cat: 'mode-homme',
      img: U('1593030761757-71fae45fa0e7'),
    },
    {
      name: 'Sac à Dos Business 30L USB',
      slug: 'sac-a-dos-business-30l-usb',
      description:
        'Compartiment laptop 17", port USB externe intégré, poche antivol cachée. Matière waterproof polyester 1680D. Bretelles ergonomiques. Inclut housse de pluie.',
      price: 24000,
      comparePrice: 38000,
      stock: 40,
      cat: 'mode-homme',
      img: U('1553062407-98eeb64c6a62'),
    },
    {
      name: 'Chemise Oxford Slim Fit à Carreaux',
      slug: 'chemise-oxford-slim-fit-carreaux',
      description:
        'Tissu Oxford coton premium, coupe slim. Motif vichy bicolore tendance. Col button-down, poignet simple bouton. Tailles S-XXL. Convient bureau décontracté.',
      price: 22000,
      comparePrice: 32000,
      stock: 48,
      cat: 'mode-homme',
      img: U('1521572163474-6864f9cf17ab'),
    },
    {
      name: 'Short Sport Léger 2-en-1',
      slug: 'short-sport-leger-2-en-1',
      description:
        'Short running double couche (short intégré compression). Tissu polyester respirant Quick-Dry. Poche téléphone zippée. Tailles S-XXL. Plusieurs coloris.',
      price: 12000,
      comparePrice: 18000,
      stock: 90,
      cat: 'mode-homme',
      img: U('1591195853828-11db59a44f43'),
    },
    {
      name: 'Ceinture Cuir Véritable Classique',
      slug: 'ceinture-cuir-veritable-classique',
      description:
        'Cuir pleine fleur tanné végétal. Boucle inoxydable argentée ou dorée. Largeur 3.5cm, longueurs 90-120cm. Convient costumes et jeans. Boîte cadeau incluse.',
      price: 16000,
      comparePrice: 25000,
      stock: 60,
      cat: 'mode-homme',
      img: U('1611911813223-1d0d2e17b16b'),
    },
    {
      name: 'Sneakers Urban Low Cuir Perforé',
      slug: 'sneakers-urban-low-cuir-perfore',
      description:
        'Tige cuir perforé respirant, semelle intermédiaire EVA amorti. Style urbain polyvalent, semelle caoutchouc durée. Tailles 39-47. Coloris blanc/noir/camel.',
      price: 45000,
      comparePrice: 65000,
      stock: 24,
      cat: 'mode-homme',
      img: U('1542291026-7eec264c27ff'),
    },

    // ── MODE FEMME (9) ─────────────────────────────────────────
    {
      name: 'Robe Midi Tropicale Viscose',
      slug: 'robe-midi-tropicale-viscose',
      description:
        'Viscose légère, imprimé tropical coloré. Coupe fluide et flatteuse, fines bretelles réglables. Dos smocké élastiqué pour un ajustement parfait. Tailles XS-XL.',
      price: 26000,
      comparePrice: 40000,
      stock: 38,
      cat: 'mode-femme',
      img: U('1496747986642-b680e4d0fd55'),
    },
    {
      name: 'Sac Cabas Tressé Rafia Naturel',
      slug: 'sac-cabas-tresse-rafia-naturel',
      description:
        'Rafia naturel tressé à la main, anses en cuir. Grand format 40x35cm, doublure coton. Fermeture magnétique. Parfait plage, marché et sorties casual.',
      price: 22000,
      comparePrice: 35000,
      stock: 29,
      cat: 'mode-femme',
      img: U('1548036161-82f52950d8e9'),
    },
    {
      name: 'Ensemble Boubou Pagne Wax Festif',
      slug: 'ensemble-boubou-pagne-wax-festif',
      description:
        'Tissu wax 100% coton, motifs traditionnels africains contemporains. Ensemble 2 pièces (haut + jupe). Couture main artisanale. Plusieurs coloris disponibles. Tailles S-XXL.',
      price: 45000,
      comparePrice: 65000,
      stock: 20,
      cat: 'mode-femme',
      img: U('1567401347348-6b5b3ff70bf1'),
    },
    {
      name: 'Sandales Compensées Cuir Doré',
      slug: 'sandales-compensees-cuir-dore',
      description:
        'Tige cuir véritable, semelle compensée liège 6cm. Brides réglables chevillères. Très confortables pour la marche. Tailles 36-41. Idéales fêtes et soirées.',
      price: 32000,
      comparePrice: 48000,
      stock: 26,
      cat: 'mode-femme',
      img: U('1515347850540-9e88b4f0c9e5'),
    },
    {
      name: 'Lunettes de Soleil Cat-Eye Dorées',
      slug: 'lunettes-soleil-cat-eye-dorees',
      description:
        'Monture acétate légère, verres polarisés protection UV400. Forme cat-eye tendance, monture dorée. Inclut étui rigide et chiffon. Certification CE.',
      price: 18000,
      comparePrice: 28000,
      stock: 44,
      cat: 'mode-femme',
      img: U('1511499767150-a7a1aaaa1a74'),
    },
    {
      name: 'Blouse Brodée Manches Longues',
      slug: 'blouse-brodee-manches-longues',
      description:
        'Coton léger broderie anglaise, col V, manches légèrement évasées. Coupe flottante élégante. Se porte rentrée ou par-dessus jeans. Tailles XS-XL. Entretien facile.',
      price: 20000,
      comparePrice: 30000,
      stock: 52,
      cat: 'mode-femme',
      img: U('1581044777873-bc2ba76ef7f1'),
    },
    {
      name: 'Jupe Portefeuille Batik Imprimé',
      slug: 'jupe-portefeuille-batik-imprime',
      description:
        'Tissu batik coton, imprimés artisanaux uniques. Jupe portefeuille ajustable taille unique (XS à L). Longueur mi-genou, légère et respirante. Création artisanale.',
      price: 18000,
      comparePrice: null,
      stock: 35,
      cat: 'mode-femme',
      img: U('1515372039744-dc8c44a78b4b'),
    },
    {
      name: 'Sneakers Plateforme Pastel',
      slug: 'sneakers-plateforme-pastel',
      description:
        'Semelle plateforme 4cm, tige canvas respirant. Lacets plats, doublure coton. Tailles 36-41. Coloris pastel (rose, bleu ciel, menthe, lavande). Urban & tendance.',
      price: 28000,
      comparePrice: 40000,
      stock: 33,
      cat: 'mode-femme',
      img: U('1584735935682-7ad4df4dbd29'),
    },
    {
      name: 'Foulard Soie Imprimé Fleuri 90x90',
      slug: 'foulard-soie-imprime-fleuri',
      description:
        'Soie naturelle 100%, imprimé floral multi-usage. 90x90cm, bords roulottés main. Peut se porter au cou, cheveux, sac ou poignets. Boîte cadeau incluse.',
      price: 25000,
      comparePrice: 38000,
      stock: 42,
      cat: 'mode-femme',
      img: U('1590004987778-cf7a88dbed6a'),
    },

    // ── MAISON & DÉCO (8) ─────────────────────────────────────
    {
      name: 'Bougie Parfumée Soja Grand Format',
      slug: 'bougie-parfumee-soja-grand-format',
      description:
        'Cire de soja 100% naturelle, 3 mèches, 65h combustion. Parfums : vétiver/cèdre, jasmin/vanille ou citrus/basilic. Pot verre rechargeable. Idée cadeau.',
      price: 18000,
      comparePrice: 25000,
      stock: 65,
      cat: 'maison',
      img: U('1603006905003-be319227b34c'),
    },
    {
      name: 'Coussin Velours Brodé 45x45',
      slug: 'coussin-velours-brode-45x45',
      description:
        'Velours de coton, broderie géométrique dorée. Rembourrage plumes synthétiques hypoallergéniques. Housse zippée lavable. Coloris 5 teintes. Vendu à l\'unité.',
      price: 14000,
      comparePrice: 20000,
      stock: 80,
      cat: 'maison',
      img: U('1584100936595-c35d9a8a8a58'),
    },
    {
      name: 'Vase Céramique Artisanal Mat',
      slug: 'vase-ceramique-artisanal-mat',
      description:
        'Céramique tournée à la main, glaçure mate. H 30cm, ouverture 8cm. Collection de formes organiques uniques. Convient fleurs séchées ou fraîches. Fabriqué localement.',
      price: 28000,
      comparePrice: null,
      stock: 18,
      cat: 'maison',
      img: U('1547592180-85f173990554'),
    },
    {
      name: 'Miroir Rotin Ovale Naturel',
      slug: 'miroir-rotin-ovale-naturel',
      description:
        'Cadre rotin tressé naturel brut. Format 50x70cm, glace sans mercure. Crochet mural inclus. Tendance naturelle & bohème. Poids léger 1.2kg. Apporte clarté à tout espace.',
      price: 35000,
      comparePrice: 50000,
      stock: 12,
      cat: 'maison',
      img: U('1616046229478-9901af7d7b73'),
    },
    {
      name: 'Plante Artificielle Monstera Réaliste',
      slug: 'plante-artificielle-monstera-realiste',
      description:
        'Feuilles soie haute qualité, imitation parfaite. H 80cm dans pot décoratif béton gris. Sans entretien, sans arrosage. Résistant poussière, facile à nettoyer.',
      price: 22000,
      comparePrice: 32000,
      stock: 30,
      cat: 'maison',
      img: U('1484818264-5a31cd5fad08'),
    },
    {
      name: 'Set Cuisine Bambou 5 Pièces',
      slug: 'set-cuisine-bambou-5-pieces',
      description:
        'Spatule, louche, cuillère, fourchette, pince en bambou certifié FSC. Résistant chaleur 200°C, ne raye pas les poêles. Rangement mural magnétique inclus.',
      price: 16000,
      comparePrice: 24000,
      stock: 50,
      cat: 'maison',
      img: U('1493663720-53bb2b2f32a0'),
    },
    {
      name: 'Tableau Toile Abstraite XL 80x60',
      slug: 'tableau-toile-abstraite-xl',
      description:
        'Impression haute résolution sur toile canvas. Format XL 80x60cm. Chassis bois flottant 3cm. Art contemporain abstrait, tons chauds ou froids. Prêt à accrocher.',
      price: 40000,
      comparePrice: 60000,
      stock: 15,
      cat: 'maison',
      img: U('1541961017774-22349e4a1262'),
    },
    {
      name: 'Organisateur Bureau Multifonction Bois',
      slug: 'organisateur-bureau-multifonction-bois',
      description:
        'Bambou massif, 8 compartiments. Range stylos, cartes de visite, câbles, cahiers. Support téléphone intégré. Montage sans vis. Format 35x20x15cm. Moderne épuré.',
      price: 18000,
      comparePrice: 26000,
      stock: 44,
      cat: 'maison',
      img: U('1518455027359-f3f8164ba6bd'),
    },

    // ── SPORT & FITNESS (7) ────────────────────────────────────
    {
      name: 'Tapis Yoga Premium 6mm TPE',
      slug: 'tapis-yoga-premium-6mm-tpe',
      description:
        'Double face antidérapante TPE écologique sans latex ni PVC. 183x61cm, 6mm épaisseur. Lignes de repère imprimées. Inclus sangle de transport. Lavable à l\'eau.',
      price: 16000,
      comparePrice: 24000,
      stock: 60,
      cat: 'sport',
      img: U('1601925228008-2a04ae7bacd7'),
    },
    {
      name: 'Gourde Isotherme Inox 750ml',
      slug: 'gourde-isotherme-inox-750ml',
      description:
        'Inox 18/8 double paroi. Garde froid 24h / chaud 12h. Bouchon sport anti-fuite. 750ml. Sans BPA. Lavable au lave-vaisselle (corps uniquement). Poids 290g.',
      price: 9500,
      comparePrice: 15000,
      stock: 110,
      cat: 'sport',
      img: U('1544145945-f90425340c7e'),
    },
    {
      name: 'Corde à Sauter Réglable Acier',
      slug: 'corde-a-sauter-reglable-acier',
      description:
        'Câble acier PVC 3m réglable, roulements à billes basse friction. Poignées ergonomiques EVA. Compteur numérique intégré. Idéale cardio, boxe, CrossFit.',
      price: 7500,
      comparePrice: 12000,
      stock: 95,
      cat: 'sport',
      img: U('1544367577-f5ab0c4c5d7f'),
    },
    {
      name: 'Haltères Hexagonaux Caoutchouc 2x5kg',
      slug: 'halteres-hexagonaux-caoutchouc-2x5kg',
      description:
        'Fonte hexagonale enrobée caoutchouc antidérapant. Poignée chromée striée. Paire 2x5kg. Ne roulent pas, préservent le sol. Idéal home gym débutant/intermédiaire.',
      price: 35000,
      comparePrice: 50000,
      stock: 20,
      cat: 'sport',
      img: U('1517838-277963-c8a42b3f21c'),
    },
    {
      name: 'Bande Résistance Fitness Set 5 Niveaux',
      slug: 'bandes-resistance-fitness-set-5',
      description:
        'Set 5 élastiques latex naturel : XL/L/M/S/XS (5 à 50kg résistance). Inclus sac de transport, 2 poignées, ancre de porte, chevilles. Full-body workout.',
      price: 14000,
      comparePrice: 20000,
      stock: 75,
      cat: 'sport',
      img: U('1571019613454-1cb2f99b2d8b'),
    },
    {
      name: 'Chaussures Running Ultra-Light Mesh',
      slug: 'chaussures-running-ultra-light-mesh',
      description:
        'Mesh respirant FlyKnit, semelle intermédiaire foam PEBA ultra-léger. Amorti réactif, maintien talon. Poids 220g. Tailles 38-47. Idéales 5K à semi-marathon.',
      price: 42000,
      comparePrice: 62000,
      stock: 28,
      cat: 'sport',
      img: U('1542291026-7eec264c27ff'),
    },
    {
      name: 'Sac Sport 40L Imperméable',
      slug: 'sac-sport-40l-impermeable',
      description:
        'Polyester 600D imperméable. Compartiment chaussures isolé, poche humide zippée. Bretelles rembourrées convertibles. Convient gym, natation, week-end. 40L.',
      price: 18000,
      comparePrice: 28000,
      stock: 38,
      cat: 'sport',
      img: U('1491553895911-0055eca6402d'),
    },

    // ── BEAUTÉ & SOIN (6) ─────────────────────────────────────
    {
      name: 'Crème Hydratante Karité Bio 200ml',
      slug: 'creme-hydratante-karite-bio-200ml',
      description:
        'Beurre de karité pur 30%, aloe vera bio, huile de jojoba. Nourrissante intense pour peaux sèches à très sèches. Formule vegan et cruelty-free. Sans paraben.',
      price: 14000,
      comparePrice: 20000,
      stock: 85,
      cat: 'beaute',
      img: U('1596755377451-c208f6b3266a'),
    },
    {
      name: 'Sérum Vitamine C Éclat 30ml',
      slug: 'serum-vitamine-c-eclat-30ml',
      description:
        '15% vitamine C pure stabilisée, niacinamide 5%, hyaluronate sodium. Illumine, unifie et repulpe en 4 semaines. Texture légère sans résidu. Tous types de peaux.',
      price: 22000,
      comparePrice: 35000,
      stock: 50,
      cat: 'beaute',
      img: U('1571219933-29f7a61e4d2a'),
    },
    {
      name: 'Coffret Parfum Femme Oriental 50ml',
      slug: 'coffret-parfum-femme-oriental-50ml',
      description:
        'Eau de parfum 50ml notes chypre-florales orientales. Notes de tête : bergamote & fleur d\'oranger. Cœur : rose de Damas & oud. Fond : musc blanc & vanille. Vaporisateur.',
      price: 35000,
      comparePrice: 55000,
      stock: 22,
      cat: 'beaute',
      img: U('1559854027-2d63d9c6fe2e'),
    },
    {
      name: 'Palette Maquillage 12 Teintes Nude',
      slug: 'palette-maquillage-12-teintes-nude',
      description:
        '12 ombres à paupières longue tenue : 8 mats + 4 shimmer. Pigmentation haute, buildable. Convient peaux claires à très foncées. Miroir inclus. Vegan & cruelty-free.',
      price: 18000,
      comparePrice: 28000,
      stock: 40,
      cat: 'beaute',
      img: U('1571781926-c5c810d0e2ec'),
    },
    {
      name: 'Masque Cheveux Noix de Coco 300ml',
      slug: 'masque-cheveux-noix-coco-300ml',
      description:
        'Huile de coco pressée à froid 25%, kératine végétale. Répare, hydrate et illumine. Idéal cheveux crépus, frisés ou colorés. Pose 5-10 min. Parfum tropical léger.',
      price: 12000,
      comparePrice: 18000,
      stock: 70,
      cat: 'beaute',
      img: U('1512207544691-9f01f9bd9de4'),
    },
    {
      name: 'Brosse Nettoyante Visage Électrique',
      slug: 'brosse-nettoyante-visage-electrique',
      description:
        '2 vitesses, 4 têtes incluses (soie/mousse/exfoliant/massage). 30 secondes = nettoyage 20x plus efficace. Rechargeable USB, étanche IPX7. Peaux normales à mixtes.',
      price: 25000,
      comparePrice: 40000,
      stock: 18,
      cat: 'beaute',
      img: U('1560180474-7c1b4a0e9eba'),
    },
  ];

  let created = 0;
  for (const p of products) {
    const catId = bySlug[p.cat]?.id;
    if (!catId) { console.warn(`⚠️  Catégorie introuvable: ${p.cat}`); continue; }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stockQuantity: p.stock,
        imageUrls: [p.img],
        categoryId: catId,
        isActive: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        stockQuantity: p.stock,
        imageUrls: [p.img],
        categoryId: catId,
        isActive: true,
      },
    });
    created++;
  }

  console.log(`✅ ${created} produits créés/mis à jour`);
  console.log('\n🎉 Seed terminé !');
  console.log('   👤 Admin → admin@jogga.store / Admin1234!');
  console.log('   👤 Client démo → client@demo.com / Demo1234!');
  console.log('   🖥️  Admin panel → http://localhost:3001/admin');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
