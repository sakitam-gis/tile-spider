import * as fs from 'fs';

const loadImage = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(err, squid) {
      if (err) reject(err);
      const img = new global['Image'];
      img.src = squid;
      resolve(img);
    });
  }).then(res => res).catch(error => {
    console.log(error);
  });
};

export {
  loadImage
};
