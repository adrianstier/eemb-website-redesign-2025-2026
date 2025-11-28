const http = require('http');

// Framework: 80-120 words, focusing on:
// 1. Educational background (degrees, institutions)
// 2. Postdoctoral/prior positions
// 3. When they joined UCSB
// 4. Current role/appointments (if notable)

const standardizedBios = [
  {
    slug: 'susan-j-mazer',
    bio: `Dr. Mazer earned her B.S. in Biology from Yale University in 1981, followed by an M.S. in Botany (1983) and Ph.D. in Botany (1986) from the University of California, Davis. She joined the UCSB faculty in 1988 and has been Director of the California Phenology Project since 2011. Her research focuses on the mechanisms by which plants adapt to ecological risks and opportunities, exploring genetic constraints that may limit the rate or degree of adaptation using tools from quantitative genetics, comparative biology, and plant demography.`
  },
  {
    slug: 'douglas-mccauley',
    bio: `Dr. McCauley earned dual B.A. degrees in Integrative Biology and Political Science from UC Berkeley in 2001 and his Ph.D. in Biology from Stanford University's Hopkins Marine Station in 2010. He conducted postdoctoral research at Stanford University, Princeton University, and UC Berkeley before joining the UCSB faculty in 2014. The following year he was named an Alfred P. Sloan Research Fellow. In 2016, he founded the Benioff Ocean Science Laboratory at UCSB's Marine Science Institute. His research focuses on understanding how community structure influences ecosystem dynamics across diverse marine environments.`
  },
  {
    slug: 'nick-nidzieko',
    bio: `Dr. Nidzieko earned his B.S. in Marine Biology from UCLA and both an M.S. and Ph.D. in Environmental Fluid Mechanics from Stanford University. Following postdoctoral work at Woods Hole Oceanographic Institution, he joined the faculty of the University of Maryland Center for Environmental Science at Horn Point Laboratory. He moved to UCSB in 2016 and currently serves as Chair of the Interdepartmental Graduate Program in Marine Science. His research as a coastal physical oceanographer examines how physical processes affect marine ecosystems through novel measurements using autonomous platforms and emerging sensor technologies.`
  },
  {
    slug: 'thomas-even',
    bio: `Thomas Even is a Senior Lecturer in the Department of Ecology, Evolution and Marine Biology at UC Santa Barbara, where he has been recognized as one of the department's most engaging instructors. His research focuses on population and community ecology, river ecology, and predator-prey interactions in freshwater systems. He is particularly interested in aquatic biology, limnology, and science education, working to develop effective approaches for teaching ecological concepts to undergraduate students.`
  },
  {
    slug: 'john-latto',
    bio: `Dr. Latto earned his B.Sc. in Ecology from the University of York (1986) and his Ph.D. in Ecology from Imperial College London (1989). After a postdoctoral position at UCSB (1989-1991), he joined the faculty at the University of Westminster in London (1992-1997), then worked as a Lecturer and researcher at UC Berkeley (1997-2007). He joined UCSB in 2007 and currently holds a joint position in EEMB and the College of Creative Studies, where he also serves as Associate Dean in the College of Letters & Science. His research focuses on population and community ecology, particularly host-parasitoid interactions.`
  },
  {
    slug: 'armand-kuris',
    bio: `Dr. Kuris earned his Ph.D. from UC Berkeley in 1969, where he initially planned to specialize in minnow taxonomy before pivoting to parasitology under the mentorship of UCSB zoologist Elmer R. Noble. He has been on the UCSB faculty for over five decades and is one of the world's leading authorities on parasite ecology. His research examines trophic interactions in food webs, particularly parasitic castration, and has applications in fisheries management and biological control of marine pests. He has received numerous honors including the UCSB Chancellor's Award for Undergraduate Research Mentorship and the ASP Eminent Parasitologist award.`
  },
  {
    slug: 'gretchen-hofmann',
    bio: `Dr. Hofmann earned her B.S. from the University of Wyoming and both her M.S. and Ph.D. in Environmental, Population and Organismal Biology from the University of Colorado at Boulder. She is a Distinguished Professor at UCSB, where her research focuses on the ecological physiology of marine organisms, particularly how temperature and oceanographic conditions influence species distribution patterns. Her work spans macrophysiology, environmental genomics using DNA microarrays, cold adaptation in Antarctic fishes, and the physiological responses of marine larvae and corals to temperature stress and ocean acidification.`
  },
  {
    slug: 'joshua-schimel',
    bio: `Dr. Schimel earned his Ph.D. in Soil Microbiology from UC Berkeley, with additional training under William H. Schlesinger at Duke University. He began his faculty career at the University of Alaska Fairbanks before joining UCSB, where he is now Professor of Ecology, Evolution and Marine Biology. He is an Aldo Leopold Leadership Fellow, a Fellow of the Ecological Society of America and the American Academy of Microbiology, and recipient of the Soil Ecology Society's Career Achievement Award. His research bridges ecosystem and microbial ecology, examining how soil microbes control ecosystem-scale carbon and nitrogen cycling. He is also author of the book "Writing Science."`
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
          console.error(`Failed to update: ${res.statusCode} - ${data}`);
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
  console.log('Standardizing faculty bios (80-120 words, career-focused)...\n');

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
      console.error(`Error processing ${slug}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
