const params = {
  etype: '',
  ngram: 0,
  curIndex: 0
}

var getEngine = function (input, etype, ngram) {

  var opts = {};

  // TODO: this should be part of the library
  // EXCEPT.... it's not a static object, so it's not availbe yet.....
  var markovModels = {
    markov: "markov",
    cento: "cento",
    overlap: "1-char overlap"
  };

  opts.inputString = input;

  opts.model = etype;

  // this is a char-based engine
  opts.ngramLength = ngram;

  var w = new markov(opts);

  return w;

};

const pickOne = arr => arr[Math.floor(Math.random() * (arr.length - 0))]
const pickFromRange = max => () => Math.floor(Math.random() * (max))

var randomChunks = function (words) {

  var chunks = [];

  // range: Math.floor(Math.random() * (max - min + 1)) + min;

  var tot = 0; // words.length;

  while (tot < words.length) {
    var grab = Math.floor(Math.random() * 10) + 1; // grab 1...10 words
    // if random > length of array, only grab what is remaining
    if (tot + grab > words.length) {
      grab = words.length - tot;
    }
    var bite = words.slice(tot, tot + grab);
    tot += grab;
    chunks.push(bite.join(' '));
  }

  return chunks;
};

const getRandom = (arr, n) => {
  const result = new Array(n)
  let len = arr.length
  let taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

var generate = (corpus, params) => () => {
  const text = corpus[params.curIndex]
  // var engine = getEngine(text, params.etype, params.ngram);

  // var words = engine.GetWords(1000);
  // var bites = randomChunks(text.split(' '));
  // var content = $('#content');
  // content.html('<span>' + bites.join('</span>\n<span>') + '</span>');
  // content.html(`<span style='color: blue; background: yellow;'> ${bites.join('</span>\n<span>')} </span>`);

  const engine = getEngine(text, params.etype, params.ngram);
  const words = engine.GetWords(1000);
  const bites = randomChunks(words)

  // TODO: pick two colors from an array each time
  // they cannot be the same colors (text to be visble)
  // const palette = [ '#FF6037', '#FF9966', '#FF9933',
  //   '#FFCC33', '#FFFF66', '#FFFF66', '#CCFF00', '#66FF66', '#AAF0D1',
  //   '#50BFE6', '#FF6EFF', '#EE34D2', '#FF00CC', ]

  const palettes = [
    { color: '#ff355e', complements: ['#35ffd6', '#35c3ff', '#355eff', '#7135ff', '#d635ff' ] },
    { color: '#fd5b78', complements: ['#5bfde0', '#5bc9fd', '#5b78fd', '#8f5bfd', '#e05bfd', '#fd5bc9']},
    { color: '#ff00cc', complements: ['#00ff33', '#00ffb2', '#00ccff', '#004cff', '#3300ff', '#b300ff']},
    { color: '#ff355e', complements: ['#3366ff', '#6633ff', '#cc33ff', '#ff33cc', '#ff3366', '#ff6633']}
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
    // { color: '#', complements: []},
  ]
  const palette = pickOne(palettes)
  const makeSpan = t => {
    const [color1, color2] = getRandom(palette, 2)
    return `<span style='color: ${pickOne(palette.complements)}; background: ${palette.color};'>${t}</span>`
  }
  const allText = bites.map(makeSpan).join('\n')
  $('#content').html(allText)
};

$(document).ready(function () {

  page17();

});

// nothing is in #content (by default)
// cycle through #hidden
// take one span at a time
//   place into #content
//   maximize size
const page17 = function () {

  var input;

  params.etype = SketchLib.GetOption('engine') || 'markov'; // TODO: make sure is a valid engine
  params.ngram = parseInt(SketchLib.GetOption('ngram'), 10) || 5;
  var c = SketchLib.GetOption('content') || 'raw';

  var testinput = "as an apple is to a beta, this bridge is over the any hill. who says? she says! so says the soothsayer rapunzel. As Brad the Bard and Ken knew, the can-can can not know how to do it like an apple, like a bridge, like a beast of burden with a heavy load. And so what? The bald bearded bard sings a braided tale of happiness, of woe, of bitter embargoed apples on a barge passing under a bridegroom's bridge by a tepid, vapid moon. His beer is here, and all ale is well, hale, and hearty. This is not my bridge, it is your bridge, your toll bridge, your tool for trolls and travellers. I see you singing, Bradley Bard, I hear you. Your embalmer blames the bridge, his badge is barely adequate for the aqueduct, he ducks his dock responsibilities badly, baldly. Who is the third that walks beside you? How is he known, and how can he see in the dark (if, in fact, he can.) All what? All right, that is okay, he said.";

  tumblrRandomPost()
    .then(corpus => {
      const getIndex = pickFromRange(corpus.length - 1)
      params.curIndex = getIndex()
      const gen = generate(corpus, params)

      $(document).bind('keydown', 'r', () => gen())
      $(document).bind('keydown', 'n', () => {
        params.curIndex = getIndex()
        gen()
      })

      gen()

      $('#infobox').fadeOut(5000);
    })

  // switch (c) {
  //   case 'raw':
  //   case 1:
  //     input = $('#raw').html();
  //     break;

  //   case 'material':
  //   case 2:
  //     input = $('#material').html();
  //     break;

  //   case 'test':
  //   case 3:
  //     input = testinput;
  //     break;

  //   default:
  //     input = decodeURI(c);
  //     break;

  // }

  // generate(input, etype, ngram);
};

$(document).ready(function () {

  // preliminary hide/show code for "new" info-box at bottom of page
  var infoDisappear = function ($this) {
    $this.stop().animate({ bottom: infoBottom, opacity: 0.01 }, 'slow');
    console.log('disappeared');
  };

  var infoAppear = function ($this) {
    $this.stop().animate({ bottom: 0, opacity: 0.85 }, 'slow');
    console.log('appeared');
  };

  var $info = $('#info'),
    infoBottom = $info.css('bottom');
  $info.mouseenter(function () { infoAppear($info); }).mouseleave(function () { infoDisappear($info); });

  infoAppear($info);
  $info.fadeTo(10000, 0.01);
});
