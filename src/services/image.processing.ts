import { normalize } from 'path';
import sharp, { ResizeOptions } from 'sharp';
import { createDirectoryIfNotExists } from './file.processing';

export const generateResizedAssets = async (
  sourcePath: string,
  destinationPath: string,
  width: number,
  height: number = width,
  options: ResizeOptions = {
    fit: 'contain',
  }
) => {
  createDirectoryIfNotExists(destinationPath);
  return sharp(normalize(sourcePath))
    .resize(width, height, options)
    .toFile(destinationPath);
};
export const generateRadiusAssets = async (
  sourcePath: string,
  destinationPath: string,
  width: number,
  height: number = width,
  options: ResizeOptions = {
    fit: 'contain',
  }
) => {
  const rect = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${width}" rx="${Math.ceil(width/2)}" ry="${Math.ceil(height/2)}"/></svg>`
  );
  createDirectoryIfNotExists(destinationPath);
  return sharp(normalize(sourcePath))
    .resize(width, height, options)
    .composite([{ input: rect, blend: 'dest-in' }])
    .toFile(destinationPath);
};
export const generateResizedAssetsWithoutAlpha = async (
  sourcePath: string,
  destinationPath: string,
  width: number,
  height: number = width,
  options: ResizeOptions = {
    fit: 'contain',
  }
) => {
  createDirectoryIfNotExists(destinationPath);
  return sharp(normalize(sourcePath))
    .resize(width, height, options)
    .removeAlpha()
    .toFile(destinationPath);
};

export const checkImageIsSquare = async (sourcePath: string) => {
  const { width, height } = await sharp(normalize(sourcePath)).metadata();
  if (width !== height) {
    throw new Error('Image is not squared');
  }
};
