# !/bin/bash
npx cap sync
npx cap copy ios
rm -rf ios/App/App/public/en-US
mkdir ios/App/App/public/en-US
find ios/App/App/public -name "*.js" -exec mv '{}' ios/App/App/public/en-US \;
find ios/App/App/public -name "*.css" -exec mv '{}' ios/App/App/public/en-US \;
mv ios/App/App/public/assets ios/App/App/public/en-US/assets \;
