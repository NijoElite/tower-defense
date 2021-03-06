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
    '61.png', '8.png', 'map.jpg',
    'enemy_1/frame0000.png', 'enemy_1/frame0004.png',
    'enemy_1/frame0008.png', 'enemy_1/frame0012.png',
    'enemy_1/frame0001.png', 'enemy_1/frame0005.png',
    'enemy_1/frame0009.png', 'enemy_1/frame0013.png',
    'enemy_1/frame0002.png', 'enemy_1/frame0006.png',
    'enemy_1/frame0010.png', 'enemy_1/frame0014.png',
    'enemy_1/frame0003.png', 'enemy_1/frame0007.png',
    'enemy_1/frame0011.png', 'enemy_1/frame0015.png',
    'enemy_2/frame0000.png', 'enemy_2/frame0004.png',
    'enemy_2/frame0008.png', 'enemy_2/frame0012.png',
    'enemy_2/frame0001.png', 'enemy_2/frame0005.png',
    'enemy_2/frame0009.png', 'enemy_2/frame0013.png',
    'enemy_2/frame0002.png', 'enemy_2/frame0006.png',
    'enemy_2/frame0010.png', 'enemy_2/frame0014.png',
    'enemy_2/frame0003.png', 'enemy_2/frame0007.png',
    'enemy_2/frame0011.png', 'enemy_2/frame0015.png',
    'enemy_3/frame0000.png', 'enemy_3/frame0004.png',
    'enemy_3/frame0008.png', 'enemy_3/frame0012.png',
    'enemy_3/frame0001.png', 'enemy_3/frame0005.png',
    'enemy_3/frame0009.png', 'enemy_3/frame0013.png',
    'enemy_3/frame0002.png', 'enemy_3/frame0006.png',
    'enemy_3/frame0010.png', 'enemy_3/frame0014.png',
    'enemy_3/frame0003.png', 'enemy_3/frame0007.png',
    'enemy_3/frame0011.png', 'enemy_3/frame0015.png',
    'enemy_4/frame0000.png', 'enemy_4/frame0004.png',
    'enemy_4/frame0008.png', 'enemy_4/frame0012.png',
    'enemy_4/frame0001.png', 'enemy_4/frame0005.png',
    'enemy_4/frame0009.png', 'enemy_4/frame0013.png',
    'enemy_4/frame0002.png', 'enemy_4/frame0006.png',
    'enemy_4/frame0010.png', 'enemy_4/frame0014.png',
    'enemy_4/frame0003.png', 'enemy_4/frame0007.png',
    'enemy_4/frame0011.png', 'enemy_4/frame0015.png',
    'pause-btn.png', 'pause-bg.png', 'place.png'];


const ASSETS_PATH = 'assets/'
const resources = new Map<string, ImageBitmap>();

function isLoaded(asset: string): boolean {
    return resources.has(asset);
}

function load(assets: string[]): Promise<ImageBitmap[]> {
    const result: ImageBitmap[] = [];

    const promise = new Promise<ImageBitmap[]>((resolve: Function, reject: Function): void => {
        assets.forEach((fileName: string): void => {
            if (isLoaded(fileName)) { 
                result.push(resources.get(fileName));
                if (result.length == assets.length) resolve(result);                
                return;
            }
    
            const image = new Image();
            image.src = ASSETS_PATH + fileName;
    
            image.onload = (): void => {
                createImageBitmap(image).then((bitmap): void => {
                    resources.set(fileName, bitmap);
                    result.push(bitmap);
                    if (result.length == assets.length) resolve(result);
                });
            };
        });
    });

    return promise;
}

function getResources(names: string[]): Promise<ImageBitmap[]> {
    return load(names);
}

export default {getResources};
