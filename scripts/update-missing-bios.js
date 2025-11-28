const http = require('http');

const biosToUpdate = [
  {
    slug: 'thomas-even',
    bio: `Thomas Even is a Senior Lecturer in the Department of Ecology, Evolution and Marine Biology at UC Santa Barbara. His research focuses on population and community ecology, river ecology, predator-prey interactions, and science education. He specializes in aquatic biology, ecology, limnology, organismal biology, and population and community ecology, with particular emphasis on ecological interactions in freshwater systems and educational initiatives related to scientific study.`
  },
  {
    slug: 'gretchen-hofmann',
    bio: `The Hofmann Lab investigates the ecological physiology of marine organisms, in particular kelp, invertebrates and perciform fishes, with emphasis on how temperature and oceanographic conditions influence species distribution patterns in marine environments.

Our research spans several key areas: (1) Macrophysiology examining physiological stress at species' biogeographic range extremes; (2) Environmental genomics using DNA microarrays to map gene expression patterns across marine species ranges; (3) Gene expression profiling and cold adaptation in Antarctic and New Zealand notothenioid fishes; (4) Larval physiology studying thermotolerance of marine invertebrate larvae; and (5) Temperature stress physiology of corals.`
  },
  {
    slug: 'armand-kuris',
    bio: `Our laboratory is engaged in four interlocking areas of research. The underlying theory being developed in our lab concerns the nature of adaptive peaks for different types of trophic interactions (links in the food web; predator/prey, parasite/host). This theory expands the concept of parasitic castration as a distinct type of trophic phenomenon. In our lab, this work has had many spin-offs concerning interactions between larval trematodes, the impact of parasites on fisheries, and the development of biological control for marine pests, as well as human schistosomiasis.

Most of our field work is done in salt marshes using a speciose guild of larval trematode parasitic castrators. These parasitic castrators are strong interactors in the snail first intermediate host. Thus, we are examining the relationship between the parasites in the first and second intermediate hosts. The relative vagility of the second intermediate host effectively integrates the spatial patches of the first intermediate host. Among our recent findings is the ability to sample the water column and to collect and identify the abundant cercarial larvae. We are using molecular tools to test the hypothesis that transmission from host to host integrates spatial heterogeneity. At the largest scale, we propose that movement of the final host (birds) produces some of the most widely distributed species known.

A series of studies on the impact of infectious diseases in fisheries culminated in a model showing that diseases could cause great losses in fisheries which critically depends on the relative scale of host and parasite recruitment and on fishery management. Thus, changes in management strategy can reduce losses to disease and increase the fisheries' yield. Several crab fisheries are now being consciously managed using this principle.

In 1993, with the coming of the pestiferous European green crab, Carcinus maenas, to California, we began investigating a marine pest biocontrol program using parasitic castrators as natural enemies. In addition, we are dealing with public policy issues and are developing specifics for biocontrol of the European green crab in California and Tasmania. Our principal goals are to ensure that biocontrol agents will not damage native species and to understand the conditions whereby biocontrol will be effective in the marine environment.

For many years we have sought a biocontrol approach to the major tropical disease, human schistosomiasis. As part of a large team from UCSB, University of New Mexico, Kenya Medical Research Institute, and The Kenya Division of Vector Borne Diseases, we completed a critical test of the ability of Louisiana crayfish to block transmission of urinary schistosomiasis to school children by feeding on the snail intermediate hosts. Control was achieved, and consequently prevalence dropped from 68% to 20% in treated children at one heavily infected school.`
  },
  {
    slug: 'john-latto',
    bio: `John Latto is a Senior Lecturer in the Department of Ecology, Evolution and Marine Biology at UC Santa Barbara. His research focuses on population and community ecology, with particular emphasis on host-parasitoid interactions. He studies the dynamics of ecological communities and how species interact through predation, parasitism, and competition.`
  },
  {
    slug: 'joshua-schimel',
    bio: `Our research bridges ecosystem and microbial ecology, examining the role of soil microbes in controlling ecosystem scale processes. We investigate how microbial community changes influence ecosystem dynamics, particularly regarding plant-soil linkages.

In Arctic ecosystems, we study soil organic matter dynamics in Alaska and Greenland tundra, focusing on carbon storage and release in response to warming. Winter microbial activity is a particular emphasis, as it may account for all of the annual net carbon efflux.

In California grasslands, we examine how invasive annual grasses alter soil conditions and nitrogen cycling in oak savanna ecosystems, working to understand community changes over the past century.

Our microbial ecology research investigates how soil stress from drying/rewetting cycles and resource availability regulate microbial diversity and function using molecular techniques. This work contributes to understanding how climate change affects soil carbon dynamics and ecosystem functioning.`
  }
];

async function fetchFacultyId(slug) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api/faculties?filters[slug][$eq]=${slug}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function updateFacultyBio(id, bio) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      data: { bio }
    });

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
  console.log('Updating missing faculty bios...\n');

  for (const { slug, bio } of biosToUpdate) {
    try {
      const id = await fetchFacultyId(slug);
      if (id) {
        const success = await updateFacultyBio(id, bio);
        if (success) {
          console.log(`✅ Updated bio for: ${slug}`);
        } else {
          console.log(`❌ Failed to update: ${slug}`);
        }
      } else {
        console.log(`⚠️ Faculty not found: ${slug}`);
      }
    } catch (error) {
      console.error(`Error processing ${slug}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
