<template>
  <section class="about cs-container">
    <h2 class="cs-title">The Principle Of Life</h2>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item"
        v-for="(principle, index) in principles"
      >{{ principle }}</li>
    </ul>
    <h2 class="cs-title">Hobby</h2>
    <ul class="cs-list">
      <li
        :key="index"
        class="cs-list__item"
        v-for="(hobby, index) in hobbies"
      >{{ hobby }}</li>
    </ul>
    <p class="cs-text">
      <small>* hebatfirgoladgilecaojfacdilwufiewpeetegotahnumizon</small>
    </p>
  </section>
</template>

<script>
/* eslint-disable no-console */
import appConfig from '@/config/app.config';

export default {
  name: 'about',
  head() {
    return {
      title: `About - ${appConfig.meta.title}`,
    };
  },
  data() {
    return {
      principles: [
        'gojeajimidzukcodappowdumorikbedirvaljelkopponjubcuowfobvugiotokezuganezlotgiceciufgugvodsihoilgeriha',
        'dobjeretapavoofafunovretjavmuhudabdefsugosejaburihaonewipesaskebcahwoacaubihamirumuttojfapinsorodkem',
        'revjodehapadoromsumedkermefespunsurobiifgipotwilwagmituvidarudluijigufikalkatavkuvhumisdewpigemukzuw',
        'hopokoihoduhasozaajidikgagwuvitgazwizuwkufticozruhsossizhafoolibusugekuzaonlagoogikilfowilnorasukefu',
        'urbiboijubuudidetagtefwochedatiglowikajeelpejjavarilawatiziezihudazlawuwevdicekvettuaneccogozcocusog',
        'hafafgorahwehmigukfecbeliawewusehetazjoomutupodzodulofijzemugelifaciduifurovjuaniroagegivadorehohwih',
        'jemguherukerifefkivzaptupukejcotretcaapovlilesudiruimmisimuahetozcekvofosapailiifoidenejatolicitcabi',
        'vikrutahavrinbakaduhvorlombewpajhuralgenmuklajziwholmatpudoemolakowsumafiasudisetugfujaowaredawebhas',
        'puvhicunikevfijupsajgoiruajraujacuktibuvawmudeptihbiupoenmaafzadagouhidiwocceufjuhuvigjuevemcebhakid',
        'wovnasivrifadhovsivolasakalbaowawushukuleahsudelunehujakivelulkobcolrugwopukusawekkeezulitzanicjenun',
        'weulociagvuzavogwazlatbunbulavijcajebolagannadgaszadeakvocepimugetowwigeobuomutazhuevujematejerituan',
      ],
      hobbies: ['Guitar 🎸', 'Reading 📚', 'Running 🏃'],
    };
  },
};
</script>