const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'lib', 'db-sqlserver.ts');
let content = fs.readFileSync(file, 'utf8');

const realImages = [
  'https://images.unsplash.com/photo-1486262715619-670810a044e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1616010531535-64bc7754eb44?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560946222-38f322dc8c8a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1536643265008-01e4ec8f081d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1618342468305-b7782efdfcc1?auto=format&fit=crop&w=800&q=80'
];

let imgIndex = 0;
const newContent = content.replace(/"https:\/\/loremflickr\.com[^"]+"/g, function() {
  const img = realImages[imgIndex % realImages.length];
  imgIndex++;
  return '"' + img + '"';
});

fs.writeFileSync(file, newContent);
console.log('Imagens corrigidas com sucesso!');
