import { checkImageIsSquare, generateRadiusAssets, generateResizedAssets } from '../../../services/image.processing';
import { config } from './config';
import { ANDROID_MAIN_PATH, ANDROID_MAIN_RES_PATH } from '../../config';
import { join } from 'path';
import { replaceInFile } from '../../../services/file.processing';
import { getHexColor } from '../../../services/color.processing';

export const addAndroidIcon = async (iconSource: string, backgroundColor: string) => {
  try {
    await checkImageIsSquare(iconSource);
    await generateLegacyIcons(iconSource);
    await generateAdaptiveIcons(iconSource, backgroundColor);
    await generateNotificationIcons(iconSource);
  } catch (err) {
    console.log(err);
  }
};

const generateLegacyIcons = (iconSource: string) =>
  Promise.all(
    config.androidIconSizes.map(size =>
      generateResizedAssets(
        iconSource,
        `${ANDROID_MAIN_RES_PATH}/mipmap-${size.density}/ic_launcher.png`,
        size.value
      )
    )
  );
  const generateNotificationIcons = (iconSource: string) =>
  Promise.all(
    config.androidIconSizes.map(size =>
      generateResizedAssets(
        iconSource,
        `${ANDROID_MAIN_RES_PATH}/drawable-${size.density}/ic_stat_onesignal_default.png`,
        size.value
      )
    )
  );
const generateAdaptiveIcons = (iconSource: string, backgroundColor: string) => {
  replaceInFile(
    join(__dirname, `../../../../templates/android/values/colors-icon.xml`),
    `${ANDROID_MAIN_RES_PATH}/values/colors-icon.xml`,
    [
      {
        newContent: getHexColor(backgroundColor),
        oldContent: /{{iconBackground}}/g,
      },
    ]
  );

  replaceInFile(
    `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
    `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
    [
      {
        newContent: '',
        oldContent: /^.*android:roundIcon.*[\r\n]/gm,
      },
    ]
  );

  replaceInFile(
    `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
    `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
    [
      {
        newContent: '      android:icon="@mipmap/ic_launcher"',
        oldContent: /^.*android:icon.*$/gm,
      },
    ]
  );

  return Promise.all(
    config.androidIconSizes.map(size => generateAdaptiveIcon(iconSource, size.density, size.value))
  );
};

const generateAdaptiveIcon = (iconSource: string, density: string, value: number) => {
  const destinationDirectoryPath = `${ANDROID_MAIN_RES_PATH}/mipmap-${density}`;
  // copyFile(
  //   join(__dirname, `../../../../templates/android/mipmap/ic_launcher.xml`),
  //   `${destinationDirectoryPath}/ic_launcher.xml`
  // );
  return generateRadiusAssets(
    iconSource,
    `${destinationDirectoryPath}/ic_launcher_round.png`,
    value
  );
};
