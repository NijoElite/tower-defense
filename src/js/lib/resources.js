const filenames = ['10.png', '13.png', '16.png',
  '19.png', '21.png', '24.png', '27.png',
  '2.png', '32.png', '35.png', '38.png',
  '40.png', '43.png', '46.png', '49.png',
  '51.png', '54.png', '57.png', '5.png',
  '6.png', '9.png', '11.png', '14.png',
  '17.png', '1.png', '22.png', '25.png',
  '28.png', '30.png', '33.png', '36.png',
  '39.png', '41.png', '44.png', '47.png',
  '4.png', '52.png', '55.png', '58.png',
  '60.png', '7.png', '12.png', '15.png',
  '18.png', '20.png', '23.png', '26.png',
  '29.png', '31.png', '34.png', '37.png',
  '3.png', '42.png', '45.png', '48.png',
  '50.png', '53.png', '56.png', '59.png',
  '61.png', '8.png', 'map.jpg'];


const onReadyCallbacks = [];
const resources = {};

function load() {
  filenames.forEach((fileName) => {
    const image = new Image();
    image.src = 'assets/' + fileName;

    image.onload = () => {
      createImageBitmap(image).then((bitmap) => {
        resources[fileName] = bitmap;
        if (isReady()) {
          onReadyCallbacks.forEach((func) => func());
        }
      });
    };
  });
}

function isReady() {
  for (let i = 0; i < filenames.length; i++) {
    if (!resources.hasOwnProperty(filenames[i])) {
      return false;
    }
  }
  return true;
}

function onReady(func) {
  onReadyCallbacks.push(func);
}

function getResources(...names) {
  const result = [];
  names.forEach((name) => {
    result.push(resources[name]);
  });

  return result;
}

module.exports = {
  onReady: onReady,
  isReady: isReady,
  load: load,
  getResources: getResources,
};
