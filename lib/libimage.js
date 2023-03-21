const sharp = require('sharp')
const fs = require("fs");

const getMetaData = async (file) => {
    try {
        const metadata = await sharp(file).metadata();
        // console.log(metadata)
        return metadata;
    } catch (error) {
        console.log(`An error occurred during processing: ${error}`);
    }
    return false;
}

const resizeImage = () => {
    const resize = sharp('./images/robo.jpg')
        .resize(350, 260)
        .toFile(__dirname + '/processed_images/resize_robo.jpg')

    console.log(resize)
}


const formatImage = async (databf, target = 'webp') => {
    const {data, info} = await sharp(databf)
        .toFormat(target, { quality: 60})
        .toBuffer({ resolveWithObject: true })

        return data;
}

module.exports = {
    getMetaData,
    formatImage
}

// formatImage()