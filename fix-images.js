const fs = require('fs');
let content = fs.readFileSync('./backpackeriq-app/src/data/destinationsData.js', 'utf8');

const fixes = {
  'bundi': 'https://images.unsplash.com/photo-1526711657229-e7e080961425?auto=format&fit=crop&w=600&q=80',
  'chittorgarh': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  'delhi': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
  'old-delhi': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  'araku-valley': 'https://images.unsplash.com/photo-1609519543350-da3a9a5f5a7a?auto=format&fit=crop&w=600&q=80',
  'loktak-lake': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
  'gwalior': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  'chilika-lake': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80',
  'anjuna': 'https://images.unsplash.com/photo-1590123591090-0e73f8ef7834?auto=format&fit=crop&w=600&q=80',
  'tirthan-valley': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=600&q=80',
  'dibang-valley': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
};

let count = 0;
for (const id of Object.keys(fixes)) {
  const newUrl = fixes[id];
  const search = "id: '" + id + "'";
  const idx = content.indexOf(search);
  if (idx === -1) { console.log('Not found:', id); continue; }
  const slice = content.slice(idx, idx + 600);
  const imgKey = "image_url: '";
  const imgIdx = slice.indexOf(imgKey);
  if (imgIdx === -1) { console.log('No image_url near:', id); continue; }
  const start = idx + imgIdx + imgKey.length;
  const end = content.indexOf("'", start);
  content = content.slice(0, start) + newUrl + content.slice(end);
  count++;
}

fs.writeFileSync('./backpackeriq-app/src/data/destinationsData.js', content);
console.log('Fixed', count, 'remaining image URLs');

const urlMatches = Array.from(content.matchAll(/image_url: '([^']+)'/g)).map(function(m) { return m[1]; });
console.log('Unique images now:', new Set(urlMatches).size, '/', urlMatches.length);
