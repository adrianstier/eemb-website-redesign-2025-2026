const http = require('http');

// Second round: trim long bios, expand short ones
// Target: 80-120 words, career-focused

const standardizedBios = [
  {
    slug: 'scott-hodges',
    bio: `Dr. Hodges received his undergraduate degrees in Botany and Biology from the University of California, Berkeley, where he also earned his Ph.D. in Botany in Herbert Baker's laboratory. He taught Ecology at Barnard College in Manhattan before completing a postdoctoral position at the University of Georgia in Mike Arnold's laboratory, where he began his influential studies on the evolutionary genetics of Aquilegia (columbines). His research focuses on the genetic basis of adaptation and speciation in plants, particularly examining how floral traits evolve and diversify.`
  },
  {
    slug: 'anna-james',
    bio: `Dr. James earned her Ph.D. in Marine Science from UCSB, where she studied ocean-dwelling bacteria in the Carlson lab. As a postdoctoral researcher in the Wilbanks lab, she developed interdisciplinary collaborations to study the giant kelp microbiome. She holds a joint appointment as Assistant Teaching Professor in EEMB and the College of Creative Studies, where she is helping build the Marine Science program. Her research examines interactions between marine microbes and their environments, and she is passionate about developing innovative, research-based practices in undergraduate biology education.`
  },
  {
    slug: 'leander-anderegg',
    bio: `Dr. Anderegg earned his B.A. in Human Biology from Stanford University in 2011 and his Ph.D. in Biology from the University of Washington in 2017, where he studied plant ecology with Janneke Hille Ris Lambers. His dissertation focused on within-species physiological variation and species geographic range constraints. Before joining UCSB, he completed two years as an NSF Biological Collections postdoctoral fellow and two years as a NOAA Climate and Global Change fellow, working with Todd Dawson (UC Berkeley) and Joe Berry (Carnegie Institution for Science) on plant responses to global change through drought physiology and remote sensing.`
  },
  {
    slug: 'jesus-martinez-gomez',
    bio: `Dr. Martínez-Gómez earned his B.S. in Molecular, Cellular, and Developmental Biology from the University of Washington and his Ph.D. in Plant Biology from Cornell University in the lab of Chelsea Specht. He conducted postdoctoral research at UC Berkeley as both an NSF Postdoctoral Fellow in Biology and a UC President's Postdoctoral Fellow, working in the lab of Benjamin Blackman with co-advising from Yun Song. His research focuses on the developmental genetic basis of plant life history traits, particularly floral ultraviolet pigmentation patterns and cold tolerance plasticity in monkeyflowers.`
  },
  {
    slug: 'joel-rothman',
    bio: `Dr. Rothman earned his B.S. from UC Davis in 1978 and his Ph.D. from the University of Oregon in 1988. As a Helen Hay Whitney fellow and EMBO fellow at the Medical Research Council in Cambridge, England, he initiated genetic studies of embryonic development in C. elegans. He was on the faculty at the University of Wisconsin, Madison (1991-96) before joining UCSB in 1996. He is a member of the Neuroscience Research Institute and the Biomolecular Sciences and Engineering Program, and recipient of the Searle Scholars Award and Shaw Scientists Award. He co-directed the Woods Hole Marine Biological Laboratory Embryology Course from 2001-06.`
  },
  {
    slug: 'joel-sharbrough',
    bio: `Dr. Sharbrough earned his B.S. from the University of Notre Dame and his Ph.D. from the University of Iowa, where he was mentored by Maurine Neiman studying the evolutionary maintenance of sexual reproduction. He completed postdoctoral research with Dan Sloan at Colorado State University studying cytonuclear interactions of allopolyploids. He was an Assistant Professor at New Mexico Tech from 2020-2024 before joining the EEMB faculty at UCSB. His lab investigates the genetic and evolutionary forces affecting mitochondrial and chloroplast function in both plants and animals.`
  }
];

async function fetchFacultyId(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/faculties?filters[slug][$eq]=${slug}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data && json.data.length > 0) {
            resolve(json.data[0].id);
          } else {
            resolve(null);
          }
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function updateFacultyBio(id, bio) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ data: { bio } });
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/faculties/${id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          console.error(`Failed: ${res.statusCode} - ${data}`);
          resolve(false);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Standardizing remaining faculty bios...\n');

  for (const { slug, bio } of standardizedBios) {
    try {
      const id = await fetchFacultyId(slug);
      if (id) {
        const wordCount = bio.split(/\s+/).length;
        const success = await updateFacultyBio(id, bio);
        if (success) {
          console.log(`✅ ${slug}: ${wordCount} words`);
        } else {
          console.log(`❌ Failed: ${slug}`);
        }
      } else {
        console.log(`⚠️ Not found: ${slug}`);
      }
    } catch (error) {
      console.error(`Error: ${slug}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
