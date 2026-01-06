const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const images = [
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2025-11/Becky-and-Elizabeth_Blackburn-IMG_9899-web-smaller.jpg", filename: "becky-and-elizabeth-blackburn.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2025-11/Lake-Tef%C3%A9-cropped-Miguel-Monteiro.jpg", filename: "lake-tefe.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2025-04/Rattus_rattus_01.jpg", filename: "rattus-rattus.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2024-12/monique-carrati-ekRRG_cdT8I-unsplash_small.jpg", filename: "coconut-palms.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2023-02/NathanStephensonUSGS.jpg", filename: "nathan-stephenson.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2022-02/columbine.jpg", filename: "columbine.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-11/ocean-internet-of-things-istock-uc-santa-barbara.jpg", filename: "ocean-internet-of-things.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-10/no-silver-bullet-01.jpg", filename: "no-silver-bullet.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-08/bulk-sampling.jpg", filename: "bulk-sampling.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-04/crunching-on-coral-01.jpg", filename: "crunching-on-coral.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-03/stier-1416.jpeg", filename: "stier.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-03/Erika-Eliason-1421.jpg", filename: "erika-eliason.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2021-02/kelp-forest-floor-01.jpg", filename: "kelp-forest-floor.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-12/ancient-alliance-01.jpg", filename: "ancient-alliance.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-10/purse-seine-boat-01.jpg", filename: "purse-seine-boat.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-09/revisiting-ratios-01.jpg", filename: "revisiting-ratios.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-08/news-1321-teaser.jpg", filename: "columbine-spurs.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-08/supporting-solutions-01.jpg", filename: "supporting-solutions.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-08/1306-teaser.jpg", filename: "aquaculture-framework.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-04/humpback.jpg", filename: "humpback.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-02/acropora-at-moorea.jpg", filename: "acropora-at-moorea.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2020-01/news-1251.jpg", filename: "river-recovery.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-12/marine-biodiversity-teaser.jpg", filename: "marine-biodiversity.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-11/news-1241-teaser.jpg", filename: "nautical-by-nature.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-10/news-teaser-1141.jpg", filename: "hippos-hidden-world.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-08/kelp-forest_0.jpg", filename: "kelp-forest.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-08/teaser-976.jpg", filename: "moorea-corals.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-08/971-teaser.jpg", filename: "campus-cat.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-07/ucsb-lagoon.jpg", filename: "ucsb-lagoon.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-06/professor-giving-lecture.jpg", filename: "professor-giving-lecture.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-05/turning-off-the-tap-1.jpg", filename: "turning-off-the-tap.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-04/moeller-fig.jpg", filename: "moeller-fig.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-03/891-teaser_0.jpg", filename: "coral-spa-treatment.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-03/grey-sharks-noaa.jpg", filename: "grey-sharks-noaa.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-03/hoodwinker-sunfish-876.jpg", filename: "hoodwinker-sunfish.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-01/entanglement-noaa-uc-santa-barbara_0.jpg", filename: "entanglement-noaa.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2019-01/jacob-eurich-field-uc-santa-barbara_0.jpg", filename: "jacob-eurich-field.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-10/colorado-columbine.jpg", filename: "colorado-columbine.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-07/news-teaser-546.jpg", filename: "jellyfish-eyes.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-06/commencement-2016-teaser.jpg", filename: "commencement-2016.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-05/umi-glacier.jpg", filename: "umi-glacier.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-05/447-teaser.jpg", filename: "hippos.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-03/purple-sea-urchin-eggs_0.jpg", filename: "purple-sea-urchin-eggs.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-03/teaser-image-373.jpg", filename: "animal-migrations.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-03/teaser-image-322_0.jpg", filename: "ecological-honors.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-04/teaser-323.jpg", filename: "disappearing-act.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-303.jpg", filename: "applying-conservation-science.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-237.jpg", filename: "social-susceptibility.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/mccauley.jpg", filename: "mccauley.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-43.jpg", filename: "field-trips-future.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-234.jpg", filename: "little-diatoms.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-235.jpg", filename: "susan-mazer.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/243-marine-microbes-teaser.jpg", filename: "marine-microbes.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2017-12/236-cauliflower-coral-larva.jpg", filename: "cauliflower-coral-larva.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2017-10/teaser-44.jpg", filename: "tale-two-sites.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/244-teaser.jpg", filename: "rebuild-wildlife.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/henly-gate_0.jpg", filename: "henly-gate.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-265.jpg", filename: "crowdsourcing-sea-change.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/news-teaser-268.jpg", filename: "ucsb-ranking.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-269.jpg", filename: "apex-predator.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-270.jpg", filename: "pollen-performance.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-271.jpg", filename: "ocean-below.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-272.jpg", filename: "conservation-sea-change.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-273.jpg", filename: "chemicals-ecosystems.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-274.jpg", filename: "complex-web.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-275_0.jpg", filename: "living-color.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-276.jpg", filename: "octopus-skin.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-277.jpg", filename: "african-rivers.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-278.jpg", filename: "greener-world.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-279.jpg", filename: "craig-carlson.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-280.jpg", filename: "wildlife-loss-ocean.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-293.jpg", filename: "sea-opportunity.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-295.jpg", filename: "catastrophic-animal-loss.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-296.jpg", filename: "global-wildlife-decline.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-297.jpg", filename: "disease-risk.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-289.jpg", filename: "oarfish.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-290.jpg", filename: "titan-arum.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-291.jpg", filename: "parasite-energetics.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-292.jpg", filename: "parasites-food-web.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-287_0.jpg", filename: "ocean-acidification.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-287.jpg", filename: "fish-populations.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-283.jpg", filename: "flower-petals.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-282.jpg", filename: "viruses-ocean.jpg" },
  { url: "https://www.eemb.ucsb.edu/sites/default/files/styles/medium_landscape/public/2018-01/teaser-image-281.jpg", filename: "amphibian-disease.jpg" }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'news');

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);

    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      console.error(`Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log(`Downloading ${images.length} images to ${outputDir}...`);

  for (const img of images) {
    try {
      await downloadImage(img.url, img.filename);
    } catch (err) {
      console.error(`Failed to download ${img.filename}`);
    }
  }

  console.log('Done!');
}

downloadAll();
