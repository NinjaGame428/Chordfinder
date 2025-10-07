const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const songsData = [
  { "title": "JE VAIS BRILLER | Impact Gospel Choir - Joseph Moussio", "artist": "ICC TV", "date": "June 8, 2021" },
  { "title": "Si je me tais - Hosanna clips - Marcel Boungou", "artist": "EMCI TV", "date": "April 29, 2016" },
  { "title": "Jésus Tu es élevé / Ici et maintenant - Athoms Mbuma - EMCI Musique", "artist": "EMCI Musique", "date": "February 3, 2025" },
  { "title": "VICTOIRE PAR LE SANG DE JÉSUS - Adoration prophétique Ps Yvan Castanou", "artist": "ICC TV", "date": "December 17, 2019" },
  { "title": "DEBORAH LUKALU - RESTAURÉ 《TRUST IN THE STORM 》", "artist": "Deborah LUKALU", "date": "April 8, 2023" },
  { "title": "L'evangéliste Prosper TSB - SABAOTH (live recording)", "artist": "Prosper TSB", "date": "March 7, 2025" },
  { "title": "SION - TA GLOIRE EST EN CE LIEU / clip officiel (SOUFFLE NOUVEAU)", "artist": "SION _ OFFICIELLE", "date": "June 28, 2023" },
  { "title": "Jonathan C. Gambela - Je t'adore (Session Live + Lyrics)", "artist": "Jonathan C. Gambela", "date": "March 21, 2023" },
  { "title": "Gloire à l'agneau  | Claudia RAYIVO  & Impact Gospel Choir", "artist": "ICC MUSIQUE", "date": "March 6, 2024" },
  { "title": "Sion - tout s'écrie gloire /Clip officiel", "artist": "SION _ OFFICIELLE", "date": "September 15, 2023" },
  { "title": "Ouvre Les Yeux De Mon Coeur", "artist": "Paul Baloche - Topic", "date": "February 14, 2025" },
  { "title": "Open The Eyes Of My Heart (Live)", "artist": "Michael W. Smith - Topic", "date": "November 6, 2014" },
  { "title": "🎶 MON ÂME SOUPIRE APRÈS TOI  / ASSOIFFÉ DE DIEU / PLUS DE TOI |  IGC - Esther Akoun", "artist": "ICC TV", "date": "August 3, 2024" },
  { "title": "LES YEUX FIXÉS VERS TOI/INONDE CE LIEU DE TA PRÉSENCE/JE M'ATTENDS À TOI | IGC - Esther Do Rego", "artist": "ICC TV", "date": "March 16, 2020" },
  { "title": "À LA CROIX JE ME PROSTERNE / JÉSUS DÉTIENT LA VICTOIRE | IGC - Esther Do AKOUN, Estelle POUHA", "artist": "ICC TV", "date": "July 25, 2022" },
  { "title": "Praise - Bénis l'Éternel | Estelle POUHA & ICC Musique", "artist": "ICC MUSIQUE", "date": "February 4, 2025" },
  { "title": "Praise (feat. Brandon Lake, Chris Brown & Chandler Moore) | Elevation Worship", "artist": "Elevation Worship", "date": "May 22, 2023" },
  { "title": "Michael Manya -YESU (JÉSUS) #yeshua #gospel #music #jesus #Tokumisa #tiktok #tokumisa #maverick", "artist": "Michael Manya", "date": "September 4, 2021" },
  { "title": "Agneau Immolé - ICC Paris", "artist": "Dans Sa Gloire", "date": "February 25, 2019" },
  { "title": "🎶 Derek JONES à Paris Cité Royal - Royal Célébration ✨", "artist": "ICC TV", "date": "July 6, 2025" },
  { "title": "Rachel Kyalone |\"Assoiffé de Dieu\"| Live Recording \"Un chant, une prière 2\"", "artist": "Jonathan Munghongwa Official", "date": "August 12, 2022" },
  { "title": "Adoration Profonde  - Ciel Ouvert  (Grace Jocktane)", "artist": "Grace Jocktane Officiel", "date": "June 1, 2025" },
  { "title": "\"Dieu tu es bon\", \"Emerveillé en Ta présence\", \"Merci pour la croix\", \"Digne est ton nom\",...", "artist": "EMCI TV", "date": "December 14, 2022" },
  { "title": "JE SUIS BÉNI.E -- MOHAMMED SANOGO | Chant prophétique inspiré", "artist": "Pasteur Mohammed SANOGO", "date": "April 14, 2025" },
  { "title": "Joseph Moussio-Celui qui vit en moi", "artist": "JOSEPH MOUSSIO OFFICIEL", "date": "October 16, 2020" },
  { "title": "J ai la vie de Dieu en moi. Pasteur Mamadou karambiri", "artist": "DaviD ChrisT", "date": "June 4, 2015" },
  { "title": "CHRIST SEUL ME SUFFIT - Stéphane Quéry", "artist": "Raynold Boudreau", "date": "July 25, 2015" },
  { "title": "Christ Is Enough - Hillsong Worship", "artist": "Hillsong Worship", "date": "August 9, 2013" },
  { "title": "JE SUIS UN SACRIFICE - ENOCK BAHWERE", "artist": "Enock Bahwere Officiel", "date": "July 27, 2023" },
  { "title": "Seigneur nul n'est comme toi  (No one like the Lord) | Plénitude Music - Marie Zamor", "artist": "Église Plénitude", "date": "November 1, 2024" },
  { "title": "À l'agneau de Dieu soit la gloire (Élisabeth Bourbouze) - Marie Zamor - EMCI Musique", "artist": "EMCI Musique", "date": "January 31, 2025" },
  { "title": "Kadosh Medley // Yeshua Hamaschiach // Before the Lord Our God - Manji", "artist": "MANJI", "date": "September 2, 2024" },
  { "title": "Yeshua with lyrics- Nathaniel Bassey", "artist": "S𝒑𝒊𝒓𝒊𝒕 𝑭𝒊𝒍𝒍𝒆𝒅 𝑻𝑽", "date": "August 26, 2021" },
  { "title": "Dena Mwana - Le parfum de mon adoration - Concert à Douala Cameroun", "artist": "2Lcenter", "date": "March 23, 2022" },
  { "title": "Dena Mwana - Saint Esprit (Officiel)", "artist": "Dena Mwana", "date": "November 21, 2018" },
  { "title": "HONORÉ, TU ES HONORÉ / SAINT-ESPRIT TU ES HONORÉ I Adoration - Ps Yvan Castanou", "artist": "ICC TV", "date": "June 8, 2020" },
  { "title": "A LA CROIX (hillsong)", "artist": "sadet sarichesse", "date": "March 27, 2011" },
  { "title": "IL EST LE SAINT-ESPRIT | Impact Gospel Choir - Esther Akoun", "artist": "ICC TV", "date": "June 6, 2022" },
  { "title": "🎶 EH EH EH AH AH AH/ TA GLOIRE EST EN CE LIEU / QUE TON RÈGNE VIENNE / IYA IYA EH - SION", "artist": "ICC TV", "date": "July 6, 2024" },
  { "title": "DEBORAH LUKALU-YOU DESERVE/OVERFLOW LIVE(Official Video)", "artist": "Deborah LUKALU", "date": "October 15, 2016" },
  { "title": "Yeshua | Jesus Image | Michael Koulianos", "artist": "Jesus Image", "date": "February 4, 2020" },
  { "title": "Sylvain Kashila - YAHWEH SE MANIFESTERA feat Ruth Pala [ Video Officielle ]", "artist": "Sylvain Kashila", "date": "June 1, 2024" },
  { "title": "Dena Mwana - Le Sang Nous Justifie (Officiel)", "artist": "Dena Mwana", "date": "October 29, 2021" },
  { "title": "REÇOIS MA LOUANGE | Impact Gospel Choir - Joseph Moussio", "artist": "ICC TV", "date": "April 21, 2021" },
  { "title": "Priscilia Twambi & 50 Voix - Medley (Nathan Bunda, Christelle Twambi & Lloyd Tshibangu)", "artist": "Priscilia Twambi", "date": "November 27, 2023" },
  { "title": "ADONAI - Nathaniel Bassey (Cover) by Jasmin Faith", "artist": "Jasmin Faith", "date": "March 25, 2025" },
  { "title": "Allison LK - TA DEMEURE | Live Recording", "artist": "Allison LK", "date": "July 4, 2025" },
  { "title": "♪ PLUS DE TOI SEIGNEUR, PLUS DE TOI - Adoration prophétique | Pasteur Yvan CASTANOU", "artist": "Yvan Castanou TV", "date": "October 9, 2017" },
  { "title": "Homme de douleurs/La croix a le dernier mot | NV Worship avec Jean-Daniel Labrie", "artist": "Église Nouvelle Vie", "date": "April 12, 2021" },
  { "title": "DOMINER| Derek-Jones (feat. Iron Le Rappeur) VIDEO Contemplation Live 3 à Abidjan🇨🇮", "artist": "DEREK-JONES", "date": "December 26, 2023" },
  { "title": "🎶 POUSSONS VERS L'ETERNEL/ TU ES GRAND/ CHRIST FAIT TOUT À MERVEILLE | ICC Musique - Joseph MOUSSIO", "artist": "ICC TV", "date": "May 19, 2025" },
  { "title": "TU ES LÀ PRÉSENT PARMI NOUS JE T'ADORE..YOU ARE HERE -COVER", "artist": "VIBES ÉVANGÉLIQUES", "date": "November 5, 2022" },
  { "title": "Leeland - Way Maker (Official Live Video)", "artist": "Leeland", "date": "August 16, 2019" },
  { "title": "🎶 QUAND JE PRONONCE TON NOM / EMMANUEL EST LÀ / TU ES AU CONTRÔLE / TU ES MA FORCE - Joseph MOUSSIO", "artist": "ICC TV", "date": "July 10, 2024" },
  { "title": "Tasha Cobbs Leonard - Break Every Chain (Live At Passion City Church)", "artist": "TashaCobbsVEVO", "date": "November 2, 2018" },
  { "title": "IL Y A UN FEU / JESUS EST BON /  JE LE LOUE AVEC MA VOIX - Impact Gospel Choir Brazzaville", "artist": "ICC TV CONGO", "date": "April 29, 2022" },
  { "title": "Jonathan Munghongwa, Steev Y., SimianeMusic| Bénis L'Éternel |Live Recording\"Un chant, une prière 2\"", "artist": "Jonathan Munghongwa Official", "date": "August 12, 2022" },
  { "title": "OH CE NOM EST SI MERVEILLEUX / YESHOUA | Impact Gospel Choir - Joseph Moussio", "artist": "ICC TV", "date": "July 27, 2021" },
  { "title": "Nous élevons Ta présence | Impact Gospel Choir Brazzaville", "artist": "ICC TV CONGO", "date": "March 15, 2022" },
  { "title": "MADIN' GOSPEL FESTIVAL 2018 - VIDEO OFFICIELLE – KREYOL GOSPEL PARTS : Tous ensemble dans la joie !", "artist": "Madin Gospel Festival", "date": "June 24, 2018" },
  { "title": "DIGNE ES-TU AGNEAU DE DIEU / SEIGNEUR TU ES DIGNE I Impact Gospel Choir - Crina Tokoto", "artist": "ICC TV", "date": "September 8, 2019" },
  { "title": "YESHUA | Derek-Jones (Vidéo Live à C3)", "artist": "DEREK-JONES", "date": "August 16, 2024" },
  { "title": "🎶ATTACHÉ À LA CROIX POUR MOI | Ps Yvan Castanou", "artist": "Yvan Castanou TV", "date": "June 8, 2022" },
  { "title": "Je chanterai / Tu m'emmènes de gloire en gloire / C'est Jésus qui l'a fait - Impact Gospel Choir", "artist": "ICC TV CONGO", "date": "April 12, 2022" },
  { "title": "ADONAÏ | Dena Mwana", "artist": "Music Rhema", "date": "June 8, 2022" },
  { "title": "Dena Mwana  - Rassembler Les Adorateurs (Official video)", "artist": "Dena Mwana", "date": "May 30, 2025" },
  { "title": "TOUTE LOUANGE | Impact Gospel Choir - Joseph Moussio & Marcelle Kohou", "artist": "ICC TV", "date": "September 12, 2022" },
  { "title": "Every Praise", "artist": "Northland Church", "date": "July 15, 2015" },
  { "title": "🎵MON DÉSIR EST DE T'AIMER, TE CONNAÎTRE 🎵| Apôtre Yvan Castanou", "artist": "Yvan Castanou TV", "date": "January 11, 2025" },
  { "title": "APÔTRE YVAN CASTANOU : TON AMOUR TA PUISSANCE TA PRÉSENCE DANS MA VIE (@YvanCASTANOUTV )", "artist": "dominique SENDE TV", "date": "January 27, 2024" },
  { "title": "AU-DESSUS DE TOUT", "artist": "Bruma Hostel", "date": "June 27, 2010" },
  { "title": "Jésus Tu es tellement merveilleux - Medley alleluia  – FAVEUR MUKOKO  | Célina-Jo & ICC Musique", "artist": "ICC MUSIQUE", "date": "February 7, 2025" },
  { "title": "🎶 TES BONTÉS SE RENOUVELLENT / MIRACLE / À JAMAIS TU ES SAINT | ICC Musique - Joseph MOUSSIO", "artist": "ICC TV", "date": "April 7, 2025" },
  { "title": "No One Like The Lord (Live) - Bethel Music, Jenn Johnson", "artist": "Bethel Music", "date": "July 19, 2024" },
  { "title": "Nothing Like Your Presence - William McDowell ft. Travis Greene & Nathaniel Bassey (OFFICIAL VIDEO)", "artist": "William McDowell Music", "date": "September 17, 2019" },
  { "title": "C'EST TON SANG QUI PURIFIE - Cantique Perpignan", "artist": "Raynold Boudreau", "date": "October 27, 2019" },
  { "title": "JOSHUA ISRAEL PRAISE MEDLEY", "artist": "Joshua Israel PF", "date": "November 25, 2023" },
  { "title": "Tu es digne de recevoir la gloire - Grace Narciso (Cover)", "artist": "Grace Narciso", "date": "December 6, 2022" },
  { "title": "🎶 ATTIRE-MOI À TOI | Apôtre Yvan Castanou", "artist": "Yvan Castanou TV", "date": "February 22, 2023" },
  { "title": "Le parfum de mon adoration | Ceux qui se confient en l'Éternel - Deborah M.", "artist": "ICC TV GATINEAU", "date": "June 24, 2022" },
  { "title": "Fragrance To Fire - Dunsin Oyekan", "artist": "Dunsin Oyekan", "date": "March 15, 2020" },
  { "title": "Dena Mwana - \"Je suis victorieux/ Acclame ton Dieu\" (Gosp'Elles Celebration)", "artist": "Dena Mwana", "date": "August 2, 2019" },
  { "title": "Jesus nous te couronnons - Grace Narciso", "artist": "Grace Narciso", "date": "July 12, 2023" },
  { "title": "TON GRAND NOM !!", "artist": "franck dianza", "date": "November 21, 2018" },
  { "title": "JE SUIS UN CONQUERANT", "artist": "franck dianza", "date": "September 23, 2018" },
  { "title": "BÉNI SOIT LE SEIGNEUR / LOUONS LE SEIGNEUR I Impact Gospel Choir - Marianne Assogbavi", "artist": "ICC TV", "date": "August 19, 2019" },
  { "title": "Je veux chanter un chant d'amour - Hosanna clips - EDEN", "artist": "EMCI TV", "date": "December 4, 2017" },
  { "title": "POUR TOUT CE QUE TU ES / YESHUA / C'EST TOI | Impact Gospel Choir - Marianne Assogbavi", "artist": "ICC TV", "date": "August 2, 2021" },
  { "title": "A la croix", "artist": "franck dianza", "date": "November 27, 2014" },
  { "title": "🔥🔥 Powerful Worship Medley! (Worthy Medley) - Warehouse Worship ft Noria & Ati", "artist": "Warehouse Worship", "date": "November 27, 2024" },
  { "title": "PERSONNE D'AUTRE QUE TOI | Impact Gospel Choir - Esther Do Rego", "artist": "ICC TV", "date": "October 19, 2021" },
  { "title": "Yeshua ( VF ) - Jesus Image | Estelle POUHA & Impact Gospel Choir", "artist": "ICC MUSIQUE", "date": "June 14, 2024" },
  { "title": "🎶 LES CIEUX PROCLAMENT/ INONDE MON CŒUR/QUE TES VIVES EAUX/PÈRE NOUS T'ADORONS | Suzele KAMENI", "artist": "ICC TV", "date": "July 3, 2024" },
  { "title": "Saint, Saint", "artist": "FESEC2008", "date": "February 15, 2010" },
  { "title": "Dena Mwana & Dan Luiten - Saint Esprit/À Jamais - Momentum Musique", "artist": "eglise Momentum", "date": "January 12, 2020" },
  { "title": "🎶 CEUX QUI SE CONFIENT EN L'ETERNEL | Ps Yvan Castanou", "artist": "Yvan Castanou TV", "date": "October 12, 2022" },
  { "title": "African Praise Medley by Gabriel Eziashi", "artist": "Gabriel Eziashi TV", "date": "April 1, 2024" },
  { "title": "Rachel Anyeme - MIRACLE (Official Lyrics)", "artist": "RACHEL ANYEME OFFICIAL", "date": "March 4, 2022" },
  { "title": "\"ENTER HIS GATES\" by Pr Robert Kayanja featuring Isaac Serukenya - \"Faithful to Me\" Album", "artist": "Isaac Serukenya Music", "date": "October 13, 2016" },
  { "title": "MOGmusic - FIRE OF THE HOLY GHOST", "artist": "MOGmusic", "date": "January 17, 2024" },
  { "title": "Ô le sang de Jésus - Hosanna clips - Hosanna Music", "artist": "EMCI TV", "date": "March 4, 2019" },
  { "title": "LES TÉNÈBRES ONT RECULÉS | Adoration prophétique - P Yvan Castanou", "artist": "ICC TV", "date": "August 11, 2018" },
  { "title": "Hé, Hé Acclame ton Dieu - ICC Paris", "artist": "Dans Sa Gloire", "date": "December 1, 2019" },
  { "title": "Je reviens au coeur de l'adoration / Mes yeux sont sur Toi | Claudia RAYIVO & Impact Gospel Choir", "artist": "ICC MUSIQUE", "date": "June 8, 2024" },
  { "title": "I HAVE MORE THAN A SONG - DUNSIN OYEKAN | SUMMIT 2021 CONFERENCE", "artist": "The Summit Bible Church", "date": "November 10, 2021" },
  { "title": "Yvan Castanou : Dieu va faire encore", "artist": "ICChrist TV", "date": "February 18, 2024" },
  { "title": "ADONAÏ - Nathaniel BASSEY | Joseph MOUSSIO & Impact Gospel Choir", "artist": "ICC MUSIQUE", "date": "September 26, 2024" },
  { "title": "Tu es là ( Yves CASTANOU ) - Gloire à l'agneau - Yahweh se manifestera | Sahra (SION) & ICC Musique", "artist": "ICC MUSIQUE", "date": "February 25, 2025" },
  { "title": "La Force est en Christ", "artist": "La Saintete Music", "date": "September 22, 2021" },
  { "title": "RECONNAISSANT - Moses MANGOMBA | EDEN Worship 2 live", "artist": "Moses Mangomba", "date": "August 20, 2022" },
  { "title": "Hezekiah Walker New Video \"Every Praise\"", "artist": "Hezekiah Walker", "date": "October 17, 2013" },
  { "title": "EXO:Digne es tu agneau de Dieu", "artist": "musichretienne", "date": "September 15, 2009" },
  { "title": "MORE THAN A SONG - Dunsin Oyekan #dunsinoyekan #worship #morethanasong", "artist": "Dunsin Oyekan", "date": "July 12, 2020" },
  { "title": "Toi seul es digne / Joseph Moussio & Impact Gospel Choir", "artist": "ICC MUSIQUE", "date": "June 5, 2023" },
  { "title": "Sion - TU ES NOTRE DIEU (Vidéo live)", "artist": "SION _ OFFICIELLE", "date": "August 11, 2019" },
  { "title": "COMMENT NE PAS TE LOUER / KUMAMA (SOIS LOUÉ) - Impact Gospel Choir Brazzaville", "artist": "ICC TV CONGO", "date": "November 21, 2022" },
  { "title": "Elève toi", "artist": "FESEC2008", "date": "May 18, 2011" },
  { "title": "Don Moen - Arise (Live)", "artist": "DonMoenTV", "date": "February 15, 2022" },
  { "title": "1 Tu es tout ce qui compte", "artist": "ICC TV CONGO", "date": "May 15, 2021" },
  { "title": "ALLÉLUIA AMEN/ JE PARLERAI DE TA BONTÉ/ LE ROI DES ROIS C'EST JÉSUS | IGC - Esther Do Rego", "artist": "ICC TV", "date": "December 14, 2020" },
  { "title": "Adorons L'Eternel - Yahveh Okumama", "artist": "PQLiberiaStar", "date": "December 30, 2007" },
  { "title": "DEBORAH LUKALU  - IL EST LE PAPA LE PLUS RESPONSABLE + ADORATION MEDLEY [ ICC PARIS]", "artist": "MNC PRODUCTION", "date": "March 31, 2024" }
];

const addSongs = async () => {
  console.log('🎵 Starting to add songs to Supabase...\n');
  console.log(`📊 Total songs to process: ${songsData.length}\n`);

  let artistsCreated = 0;
  let artistsExisting = 0;
  let songsCreated = 0;
  let songsSkipped = 0;
  const artistCache = new Map();

  try {
    for (let i = 0; i < songsData.length; i++) {
      const { title, artist: artistName, date } = songsData[i];
      console.log(`\n[${i + 1}/${songsData.length}] Processing: "${title.substring(0, 50)}..."`);
      
      let artistId;

      // Check cache first
      if (artistCache.has(artistName)) {
        artistId = artistCache.get(artistName);
        console.log(`   ✓ Artist "${artistName}" (cached)`);
      } else {
        // Check if artist exists
        const { data: existingArtist, error: artistCheckError } = await supabase
          .from('artists')
          .select('id, name')
          .eq('name', artistName)
          .single();

        if (artistCheckError && artistCheckError.code !== 'PGRST116') {
          console.error(`   ❌ Error checking artist:`, artistCheckError.message);
          continue;
        }

        if (existingArtist) {
          artistId = existingArtist.id;
          artistCache.set(artistName, artistId);
          artistsExisting++;
          console.log(`   ✓ Artist "${artistName}" exists`);
        } else {
          // Create new artist
          const { data: newArtist, error: artistCreateError } = await supabase
            .from('artists')
            .insert({
              name: artistName,
              genre: 'Gospel',
            })
            .select('id')
            .single();

          if (artistCreateError) {
            console.error(`   ❌ Error creating artist:`, artistCreateError.message);
            continue;
          }

          artistId = newArtist.id;
          artistCache.set(artistName, artistId);
          artistsCreated++;
          console.log(`   ✅ Created artist "${artistName}"`);
        }
      }

      // Check if song exists (by title and artist_id)
      const { data: existingSong, error: songCheckError } = await supabase
        .from('songs')
        .select('id')
        .eq('title', title)
        .eq('artist_id', artistId)
        .single();

      if (songCheckError && songCheckError.code !== 'PGRST116') {
        console.error(`   ❌ Error checking song:`, songCheckError.message);
        continue;
      }

      if (existingSong) {
        songsSkipped++;
        console.log(`   ⏭️  Song already exists, skipping`);
        continue;
      }

      // Create new song
      const { error: songCreateError } = await supabase
        .from('songs')
        .insert({
          title: title,
          artist_id: artistId,
          genre: 'Gospel',
          key_signature: 'C',
          tempo: 120,
          description: `Published on ${date}`,
          year: new Date(date).getFullYear(),
          chords: ['C', 'G', 'Am', 'F']
        });

      if (songCreateError) {
        console.error(`   ❌ Error creating song:`, songCreateError.message);
        continue;
      }

      songsCreated++;
      console.log(`   ✅ Created song`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Import complete!');
    console.log('='.repeat(60));
    console.log(`👥 Artists created: ${artistsCreated}`);
    console.log(`👥 Artists existing: ${artistsExisting}`);
    console.log(`🎵 Songs created: ${songsCreated}`);
    console.log(`⏭️  Songs skipped (duplicates): ${songsSkipped}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }
};

addSongs();

