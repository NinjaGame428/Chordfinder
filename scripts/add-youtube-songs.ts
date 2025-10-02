import { createClient } from '@supabase/supabase-js';
import { youtubeMetadataService } from '../lib/youtube-metadata';

// YouTube URLs list
const youtubeUrls = [
  "https://youtu.be/HX9NKHUUSaA?si=jA5muzOgrAdcsu6L",
  "https://youtu.be/MiFpAs-0yuE?si=bOwx858CC-nOfiDk",
  "https://youtu.be/A_0tjaHQiIY?si=RPnhfCcjQvnIxwsv",
  "https://youtu.be/z3x83ZdsHF4?si=OfVpvWaFCg0_k2-t",
  "https://youtu.be/6ajgbGy5fMU?si=FVUSkMnqmMimKdgT",
  "https://youtu.be/0DJOiTn1AbE?si=a7id74kMMy-fjq-w",
  "https://youtu.be/cJO0M7uT8VY?si=DrC3zIDFtolapfaE",
  "https://youtu.be/He8GkGZUGsc?si=VpmUXAQxYV2rFBfO",
  "https://youtu.be/kPHeaZpF4QU?si=XqiGWLCSbBoZQtY0",
  "https://youtu.be/EEQ3YJAhzSY?si=lxlf7pRGHw8M_il0",
  "https://youtu.be/r5KpIpEFT5o?si=CX7e6c-XjQLZTfu0",
  "https://youtu.be/HwKCvuorI9E?si=2afGALCs08rsL5EV",
  "https://youtu.be/6kBuEU1QjMY?feature=shared",
  "https://youtu.be/LFuHm4KalY0?feature=shared",
  "https://youtu.be/xStS3GmrxFw?si=I9QTKad-Zj68mnyQ",
  "https://youtu.be/1tAX2Tk9M78?si=9_imO_CC0tY-yPh2",
  "https://youtu.be/f2oxGYpuLkw?si=_nfBFxWunOz9qhpT",
  "https://youtu.be/xTsxAqBhVWQ?si=akCI_faLE-_3Sjtw",
  "https://youtu.be/HVPb3obUmxc?si=Sw0Nuprx65xxcGiL",
  "https://youtu.be/Nzg3pnNwmh0?si=0MqU-IGoWdzywTzk",
  "https://youtu.be/fkxAyeGc-rc?si=Pv06T2Gps07AEC9m",
  "https://youtu.be/hkCYokw7kAI?si=tJ_lAHUaHum7VWZT",
  "https://youtu.be/TeLMRNqX2Jc?si=75Wzgq8Dg8bJRTvB",
  "https://youtu.be/PXSRfHjghsQ?si=spWkhjpyEnayIwnc",
  "https://youtu.be/BYv_NyZKFQ4?si=I2aNbYRB2livGXqC",
  "https://youtu.be/JoH75X0ZvHs?si=x7gjgZtDuKRfE2Eb",
  "https://youtu.be/nRDlSMgik7w?si=t-TBknE0gmOHKtq7",
  "https://youtu.be/teUxQpnhezY?si=pBEtbuLGvuHMvxU5",
  "https://youtu.be/kLP18RSQwxc?si=m2Lt5T69eBIu6i6J",
  "https://youtu.be/1rpvn3_FtmU?si=AZ-uqmVKLxXMbvGP",
  "https://youtu.be/jPmo2hxbXMY?si=BpGMiLLi5UAj7eU7",
  "https://youtu.be/srqdwy4_D64?si=H5z0wihJYWOCAbeV",
  "https://youtu.be/cEd5Tt4cGok?si=JlZzj8rmIFsgKr3b",
  "https://youtu.be/_1wdwl_t_ek?si=8Iv5S1DkYO9SkvXz",
  "https://youtu.be/JPyyX4zFraU?si=OV1lwkNLXtnNHFvK",
  "https://youtu.be/0C4-qkqieic?si=SyHWqa8zNm9Sio9n",
  "https://youtu.be/eHgaJFEgUk8?si=4jDBBxA893Eyt-IX",
  "https://youtu.be/hNzxEF_yk8c?si=TOMq1RI-vAEQLNiz",
  "https://youtu.be/-z8s_GgDs3A?si=7rdniV96YXalhhCF",
  "https://youtu.be/sDCKsyT_XKo?si=SEyDZK0ha_mvUEt",
  "https://youtu.be/ivUb1K0B0zE?si=r0BycqEKaHx92e2c",
  "https://youtu.be/7y8QspPFAcY?si=Wx4bhRe9FcSNjEHs",
  "https://youtu.be/M34wzA14_ls?si=7ZqjJgEne_IAYOIs",
  "https://youtu.be/d8I1Ylp6yUk?si=kdiqdXAy30EI2vBB",
  "https://youtu.be/WPzWzAbnfIo?si=fXW2LOWHFgEguIEd",
  "https://youtu.be/JhNN408ch5Q?si=TF2-7VmpEffSVXMA",
  "https://youtu.be/5rGLOdOhxL4?si=MnCccwe8mtXkOO4J",
  "https://youtu.be/IFIwZBllOYA?si=esoZndrzlSumP9n-",
  "https://youtu.be/6Kcvq2iTnYA",
  "https://youtu.be/R-UhImI7uqA?si=rUcVr9w81-06XhKm",
  "https://youtu.be/SLmwiS_5S8s?si=pRMOuTmTfbnLO4nZ",
  "https://youtu.be/j6OLT_d7wKU?si=Ne48qWwyaSSfFDni",
  "https://youtu.be/iJCV_2H9xD0?si=e_6zZzYX-ZYzBM2H",
  "https://youtu.be/bO6ymaPY77k?si=Qw6w-bj2Mn2sEyWr",
  "https://youtu.be/ucY6NwQTI3M?si=2sp7BMPhfIdLKFaO",
  "https://youtu.be/ARJriqGOoyk?si=7ku7qpzaEYwIbg92",
  "https://youtu.be/1ieckehNEO8?si=EHu7LQo-PAvyLke6",
  "https://youtu.be/9dl6_EIk1ys?si=bf7Msl7mr8LYxszz",
  "https://youtu.be/y7o7TkfLpD4?si=6ySOYtjLKYaimvb3",
  "https://youtu.be/c5K5cYUWDf0?si=tQgzhX4IEU-WP2zs",
  "https://youtu.be/gGRb5ckVsE0?si=-ATuJ3PiIHToj6Iw",
  "https://youtu.be/6tVPubFUavo?si=-OuY-cpBwsszPi0E",
  "https://youtu.be/qvbt97z_514?si=wuA1-4wFI285bA6C",
  "https://youtu.be/br2FTrYkkAQ?si=iYs2b9PPnEZcw-Kg",
  "https://youtu.be/l2MO_2m3IoU?si=H746RJmuqp6sYYxz",
  "https://youtu.be/tI_LG78QFKI?si=5FohRMsSZi1MY_eO",
  "https://youtu.be/T7jlejGpX30?si=0_ol892nKItLchq7",
  "https://youtu.be/4yhgrdkrmB0?si=7to5BvUozCeHn6WU",
  "https://youtu.be/MES7Qj-gilc?si=zbb62MBUl7mn7eJl",
  "https://youtu.be/vvjBlM6hwtg?si=zFi-jkisvpWvmsHB",
  "https://youtu.be/vzA-8hVwJs8?si=8ezlQh9Ej-Xdr9Ue",
  "https://youtu.be/1H3mB5qGPQo?si=-XUzgFPWdkPrk9uW",
  "https://youtu.be/ZDem13JkMdo?si=CB8dgBa4Egw4rfLA",
  "https://youtu.be/6DjKbUQfe9U?si=PP2F6fTFMFo9m6Qx",
  "https://youtu.be/N8zQuWTwk-Y?si=iAPMBetm2obKITVR",
  "https://youtu.be/Jqq7Tsc-v-E?si=LOdR3lGJS3zDlFjX",
  "https://youtu.be/FfotPWc1zCQ?si=WcpYE7hG-NEz2Qn5",
  "https://youtu.be/XgrKCHd06sU?si=d9ZYMBZppaAYsZHB",
  "https://youtu.be/OTBynCFgSFg?si=DQPNay0B_bzRcuHr",
  "https://youtu.be/z3x83ZdsHF4?si=Ht2FfIhLjThwnOFY",
  "https://youtu.be/T4oVDCuNmnc?si=6BmAsjPt8pcqVv7W",
  "https://youtu.be/gqIwEbCyxBo?si=fYXrSyhbRvmvwJwV",
  "https://youtu.be/t_KMncknJvo",
  "https://youtu.be/UhJX4HndYxU?feature=shared",
  "https://youtu.be/u8dyr_-ZeFI?feature=shared&t=296",
  "https://youtu.be/Q7wqPEJi-rI?feature=shared",
  "https://youtu.be/b-B7aaLVliE?si=zdyLADBqcFgjP2nw",
  "https://youtu.be/XGlEp2rzT6M?si=YdjaOjiaMnQsdN4Y",
  "https://youtu.be/18zLdOjsPPs?si=VKfWttv15TSw_Dne",
  "https://youtu.be/5Ew8Ohy9_2o?si=4UTLUFPZQ-B_oV9e",
  "https://youtu.be/F3EcwZgJEn0?si=aLe1reyNOcEI44ei",
  "https://youtu.be/YbBrDZ9r-eU?si=2CqdqJFSpxvyqIot",
  "https://youtu.be/hBgfOApf0WE?si=U-ssVVHQPus5_XcZ",
  "https://youtu.be/D8jKihUAfdY?si=vFSg6ef_tOV7bTPI",
  "https://youtu.be/PRvMxrvyouc?si=-Lw789iLu7j5ATsE",
  "https://youtu.be/pla64jwYnG4?si=FpowUGVh1Sm6gsgX",
  "https://youtu.be/xStS3GmrxFw?si=zeR_nUgrZqf248p5",
  "https://youtu.be/cg15k9joeSk?si=xfOkB9XhT2pnJ9KS",
  "https://youtu.be/ckjxHUAaxeA?si=hIJlZ9lfCRWQTGiN",
  "https://youtu.be/t4k4yL8igGQ?si=aRXct21e6UyOvc0c",
  "https://youtu.be/i_6_b8adeuU?si=PrAe2qRpo0n_0wWW",
  "https://youtu.be/_BOMurndcYA?si=0M9h0nk1S5LNrEb7",
  "https://youtu.be/_BOMurndcYA?si=_0M9h0nk1S5LNrEb7",
  "https://youtu.be/NG-V9RYT0WI?si=lsY7X1HziIAew1lx",
  "https://youtu.be/YmuFU9HWQQc?feature=shared",
  "https://youtu.be/l2FBnUEDv1s?feature=shared",
  "https://youtu.be/CB1X5r8f68?si=Aiv7O0mQN8FE6tay",
  "https://youtu.be/HSM8xVkIq7I?si=0NWqjHe96kfQZAt7",
  "https://youtu.be/HqFk_AezG5s?si=SOW0soiyKK5NMYKz",
  "https://youtu.be/eBjyBpxA0h0?si=gw8CFtgHWOyB2dOa",
  "https://youtu.be/eDPE69z_UyI?si=1d1-LvRhtMy3XjEd",
  "https://youtu.be/WUQNMe6UzWc?si=vNW0FCWw2GLQuDJP",
  "https://youtu.be/VtlU4kLLFUM?si=CfOCwzS1Up6cFIc_",
  "https://youtu.be/EEQ3YJAhzSY?si=_w3zzLH2b_YMW10H",
  "https://youtu.be/dbpyuPsCiDo?si=BoLPGR_ZAJCiQcgs",
  "https://youtu.be/-6LS0mtzd4Xep8so",
  "https://youtu.be/UuuZMg6NVeA?feature=shared",
  "https://youtu.be/iZXqR9Ccoek?feature=shared",
  "https://youtu.be/UkTYkRj4K90?feature=shared",
  "https://youtu.be/WsPD8niIQxo?si=u-u5b8WOHiHQtXAy",
  "https://youtu.be/P7v7v9ujvZI?si=pPlu2mbDGgQBU6_4",
  "https://youtu.be/qvbt97z_514?si=ku65vQop_Bfxo4xe",
  "https://youtu.be/8OrwygCpN0E?si=U01OUd2dnK3xjpFD",
  "https://youtu.be/uJBLAT-H-B0?feature=shared",
  "https://youtu.be/LD-QBrhi0qg?feature=shared",
  "https://youtu.be/uHTMhd2eSbU?feature=shared",
  "https://youtu.be/SpMvpjsoaIQ?si=qiM0QAiDjzhMpPIP",
  "https://youtu.be/g05u4hZh4rI?si=gD3IHsuUjfpv3MLJ",
  "https://youtu.be/FhCtaWjTuJk?si=gwoTBw7Zc_Kcg9Nq",
  "https://youtu.be/h3wpeklfIGA?si=Z2OgX-sLp73CrAxM",
  "https://youtu.be/vHOn5YpBVSQ?si=1mNA6otBCYnwoGGP",
  "https://youtu.be/MWqp1YQyneY?si=ekwfcltzmA9zRoz_",
  "https://youtu.be/2AtcTwp48MI?si=tmNcsHbc1a00BYtQ",
  "https://youtu.be/lrdmnAn9gxk?si=jp7Ejkw8rb_FZfJV",
  "https://youtu.be/-wf2HVtBkFE?si=AQky7miBLw4few",
  "https://youtu.be/FuER7RDLpps?si=jMkpCeRyhgFTSogG",
  "https://youtu.be/fbUM2Rr8f68?si=Aiv7O0mQN8FE6tay",
  "https://youtu.be/cDxIPUffUlQ?si=1p_JPhhs5ROakiyt",
  "https://youtu.be/xaLiG2rR_HI?si=bFuy1NVsytizM_RE",
  "https://youtu.be/NICDF5DNDKg?si=m-h5hLXwb0MwcdVH",
  "https://youtu.be/MFUkwFiTOMk?si=60ExWv087nk29XS-",
  "https://youtu.be/1ieckehNEO8?si=T2jTR3JwhrDO_7gO",
  "https://youtu.be/juzmJJKQnA4?si=dPthFH7gwYOeH0Vv",
  "https://youtu.be/wP1SYyKp7vU?si=xsFByVwQ9fuoQ-1x",
  "https://youtu.be/fSDos_rHD8M?si=2wQVIUBrBEJzHULQ",
  "https://youtu.be/q9wnVYhatIw?si=OHvRvmQGDKC35uIn",
  "https://youtu.be/ZcwHRUPE30M?si=CnVvTo45vTbIlwWF",
  "https://youtu.be/mhjI68dngrQ?si=-PUBJtJy2mdFpmII",
  "https://youtu.be/qnFF5D60_b8?si=GeovhCKGFwVJ7leh",
  "https://youtu.be/6X1JUQck4rU?si=9mnVG4idLVb2tigT",
  "https://youtu.be/NJp3ibKnwnE?si=JxzGLPrPHVc3Hx-M",
  "https://youtu.be/HQFSibzIxEc?si=Ac6Sm_ylNP4AxU5C",
  "https://youtu.be/Oji4665TsPw?si=hvAQa_QYyHte9iVL",
  "https://youtu.be/DyPStFcX5I8?si=tkQtJbpghdQKV3Xs",
  "https://youtu.be/l3T9Jozo9p8?si=_VwFavdcyAdOf3Sw",
  "https://youtu.be/QKZgS4E12CQ?si=ivv0pfa1sRtOdLTH",
  "https://youtu.be/dN_kn7wiiKM?si=LouC8o-P1dDdn5KW",
  "https://youtu.be/lyeIz8sZN2o?si=iSznKPY__i6ptRMr",
  "https://youtu.be/utI6WZubcHM?si=PskRQj239WfV3riR",
  "https://youtu.be/wzyPsl-Dq9A?si=ROKcYJb5FMa5AVyP",
  "https://youtu.be/P7v7v9ujvZI?si=GeYCbYJm7AEUvre9",
  "https://youtu.be/T7jlejGpX30?si=Z9rn7aI6eQTaR8hq",
  "https://youtu.be/hFWLmh73dFM?si=-5578-mTsWGIGmbb",
  "https://youtu.be/-d0tyye82EU?si=PPDJHfYkuCODLPLs",
  "https://youtu.be/d2CwJI1cUjo?si=BibldbSWAgg9n4Ns",
  "https://youtu.be/1LdH8_GYGvc?si=XBFkk_DKVebaqqGx",
  "https://youtu.be/br2FTrYkkAQ?si=GJODc758TCeWlRSe",
  "https://youtu.be/B9le1gUhE3E",
  "https://youtu.be/B_p3LFkXe_o",
  "https://youtu.be/zJ_CN9U9ByY",
  "https://youtu.be/wzyPsl-Dq9A",
  "https://youtu.be/AGXVHyeEzP0",
  "https://youtu.be/1Mbxr8XrsWs",
  "https://youtu.be/www.youtube.com/watch?v=pQIyU",
  "https://youtu.be/JL9ikMmRNW8",
  "https://youtu.be/VJg9aXrTNfM",
  "https://youtu.be/yHaorWCn_RM",
  "https://youtu.be/7y2JEDwWsBw",
  "https://youtu.be/7SPX_I0juzI",
  "https://youtu.be/ov9Xm-OoUNg",
  "https://youtu.be/nRDi31mQTRI",
  "https://youtu.be/zJ_CN9U9ByY",
  "https://youtu.be/_BOMurndcYA?si=_0M9h0nk1S5LNrEb7",
  "https://youtu.be/qS61q-dYcdY",
  "https://youtu.be/jlIPM3E_F38",
  "https://youtu.be/-9HC_ionqOo",
  "https://youtu.be/qS61q-dYcdY",
];

interface ScrapedSong {
  title: string;
  artist: string;
  genre: string;
  key_signature: string | null;
  tempo: number | null;
  youtube_url: string;
  youtube_id: string;
  description: string;
  thumbnail_url: string;
  duration: string;
  published_at: string;
}

async function extractVideoId(url: string): Promise<string | null> {
  return youtubeMetadataService.extractVideoId(url);
}

async function scrapeYouTubeVideo(url: string): Promise<ScrapedSong | null> {
  try {
    const videoId = await extractVideoId(url);
    
    if (!videoId) {
      console.log(`❌ Could not extract video ID from: ${url}`);
      return null;
    }

    console.log(`📹 Fetching metadata for video ID: ${videoId}`);
    
    const videoDetails = await youtubeMetadataService.getVideoDetails(videoId);
    
    if (!videoDetails) {
      console.log(`❌ Could not fetch details for video ID: ${videoId}`);
      return null;
    }

    // Parse duration
    let durationText = '0:00';
    if (videoDetails.duration) {
      const durationSeconds = youtubeMetadataService.parseDuration(videoDetails.duration);
      durationText = youtubeMetadataService.formatDuration(durationSeconds);
    }

    const song: ScrapedSong = {
      title: videoDetails.title,
      artist: videoDetails.channelTitle,
      genre: 'Gospel', // Default genre
      key_signature: null, // YouTube doesn't provide this
      tempo: null, // YouTube doesn't provide this
      youtube_url: url,
      youtube_id: videoId,
      description: videoDetails.description.substring(0, 500),
      thumbnail_url: videoDetails.thumbnails.high?.url || videoDetails.thumbnails.medium?.url,
      duration: durationText,
      published_at: videoDetails.publishedAt,
    };

    console.log(`✅ Successfully scraped: ${song.title} by ${song.artist}`);
    return song;

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error);
    return null;
  }
}

async function addSongsToSupabase(songs: ScrapedSong[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`\n📊 Adding ${songs.length} songs to Supabase...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const song of songs) {
    try {
      // Check if song already exists by YouTube URL
      const { data: existingSongs, error: checkError } = await supabase
        .from('songs')
        .select('id')
        .or(`description.ilike.%${song.youtube_id}%,title.eq.${song.title}`);

      if (checkError) {
        console.error(`❌ Error checking for existing song: ${song.title}`, checkError);
        errorCount++;
        continue;
      }

      if (existingSongs && existingSongs.length > 0) {
        console.log(`⏭️  Song already exists: ${song.title}`);
        continue;
      }

      // Insert the song
      const { data, error } = await supabase
        .from('songs')
        .insert({
          title: song.title,
          artist: song.artist,
          genre: song.genre,
          key_signature: song.key_signature,
          tempo: song.tempo,
          description: `${song.description}\n\nYouTube: ${song.youtube_url}\nVideo ID: ${song.youtube_id}\nDuration: ${song.duration}\nPublished: ${new Date(song.published_at).toLocaleDateString()}`,
          chords: null,
          lyrics: null,
          year: new Date(song.published_at).getFullYear(),
          rating: 0,
          downloads: 0,
        });

      if (error) {
        console.error(`❌ Error inserting song: ${song.title}`, error);
        errorCount++;
      } else {
        console.log(`✅ Successfully added: ${song.title}`);
        successCount++;
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error processing song: ${song.title}`, error);
      errorCount++;
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`✅ Successfully added: ${successCount} songs`);
  console.log(`❌ Failed: ${errorCount} songs`);
}

async function main() {
  console.log('🎵 YouTube Songs Scraper and Database Importer\n');
  console.log(`📋 Total URLs to process: ${youtubeUrls.length}\n`);

  // Remove duplicates
  const uniqueUrls = [...new Set(youtubeUrls)];
  console.log(`📋 Unique URLs after deduplication: ${uniqueUrls.length}\n`);

  // Filter out invalid URLs
  const validUrls = uniqueUrls.filter(url => {
    if (url.includes('www.youtube.com/watch?v=pQIyU')) return false;
    if (url.includes('-6LS0mtzd4Xep8so')) return false;
    return true;
  });

  console.log(`📋 Valid URLs: ${validUrls.length}\n`);
  console.log('🔍 Starting to scrape YouTube videos...\n');

  const scrapedSongs: ScrapedSong[] = [];

  // Process URLs in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < validUrls.length; i += batchSize) {
    const batch = validUrls.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(validUrls.length / batchSize)}...`);
    
    const batchResults = await Promise.all(
      batch.map(url => scrapeYouTubeVideo(url))
    );

    const successfulResults = batchResults.filter((song): song is ScrapedSong => song !== null);
    scrapedSongs.push(...successfulResults);

    // Wait between batches
    if (i + batchSize < validUrls.length) {
      console.log('⏳ Waiting before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n✅ Successfully scraped ${scrapedSongs.length} songs out of ${validUrls.length} URLs\n`);

  if (scrapedSongs.length > 0) {
    await addSongsToSupabase(scrapedSongs);
  } else {
    console.log('❌ No songs were scraped successfully. Please check your YouTube API key.');
  }

  console.log('\n✨ Process completed!');
}

// Run the script
main().catch(console.error);

