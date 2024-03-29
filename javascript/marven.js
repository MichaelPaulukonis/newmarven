const params = {
  etype: '',
  ngram: 0,
  curIndex: 0
}

var getEngine = (input, etype, ngram) => {

  // TODO: this should be part of the library
  // EXCEPT.... it's not a static object, so it's not availbe yet.....
  var markovModels = {
    markov: "markov",
    cento: "cento",
    overlap: "1-char overlap"
  };

  const opts = {
    inputString: input,
    model: etype,
    ngramLength: ngram
  }

  const w = new markov(opts);

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

const getRandom = (arr, n = 1) => {
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

  // const engine = getEngine(text, params.etype, params.ngram);
  // const words = engine.GetWords(1000);

  const markov = RiTa.markov(1);
  // let rm = RiTa.markov(3);
  // rm.addText("The girl went to a game after dinner.\
  //             The teacher went to dinner with a girl.");
  // sentences = rm.generate(2);

  // debugger
  markov.addText(text);

  const words = markov.generate(10).join(' ').replace(/\<s\>/ig, '').split(/\s+/)

  const bites = randomChunks(words)


  const neons = ['#FFFF00', '#FFFF33', '#F2EA02', '#E6FB04', '#FF0000', '#FD1C03', 
    '#FF3300', '#FF6600', '#00FF00', '#00FF33', '#00FF66', '#33FF00', '#00FFFF', 
    '#099FFF', '#0062FF', '#0033FF', '#FF00FF', '#FF00CC', '#FF0099', '#CC00FF', 
    '#9D00FF', '#CC00FF', '#6E0DD0', '#9900FF']

  // TODO: pick two colors from an array each time
  // they cannot be the same colors (text to be visble)
  // const palette = [ '#FF6037', '#FF9966', '#FF9933',
  //   '#FFCC33', '#FFFF66', '#FFFF66', '#CCFF00', '#66FF66', '#AAF0D1',
  //   '#50BFE6', '#FF6EFF', '#EE34D2', '#FF00CC', ]/

  // https://htmlcolorcodes.com/color-picker/
  // using a core color ('color'), find the complement
  // then, get the analogous colors for the complement
  // NOTE: some of the complements are too similar and have to be manually removed
  const palettes = [
    // { color: '#ff355e', complements: ['#35ffd6', '#35c3ff', '#355eff', '#7135ff', '#d635ff' ], blendMode: true },
    // { color: '#fd5b78', complements: ['#5bfde0', '#5bc9fd', '#5b78fd', '#8f5bfd', '#e05bfd', '#fd5bc9'], blendMode: true },
    // { color: '#ff00cc', complements: ['#00ff33', '#00ffb2', '#00ccff', '#004cff', '#3300ff', '#b300ff'], blendMode: true },
    // { color: '#ff355e', complements: ['#3366ff', '#6633ff', '#cc33ff', '#ff33cc', '#ff3366', '#ff6633'], blendMode: true },
    // { color: '#7FFFD4', complements: ['#da7fff', '#ffda7f', 'FF7FA4'], blendMode: true },
    // { color: '#7FFFD4', complements: ['#da7fff', '#ffda7f', 'FF7FA4'], blendMode: true },
    // // the following should NOT have difference mix-blend mode
    // { color: '#FCF340', complements: ['#fb33db', '#0310ea', '#7fff00']},
    // { color: '#7fff00', complements: ['#fb33db', '#0310ea', '#FCF340']},
    // // { color: '#0310ea', complements: ['#fb33db', '#7fff00', '#FCF340']}, // almost the same as background sigh
    // { color: '#fb33db', complements: ['#0310ea', '#7fff00', '#FCF340']},

    // { color: '#FFFF00', complements: [
    //   // '#FF0000',
    //   // '#33FF00',
    //   // '#0033FF',
    //   '#9900FF',
    //   '#FF00FF',
    //   '#FF00CC',
    //   '#FF0099',
    //   '#CC00FF',
    //   ]},

// Neon Yellow:
// #FFFF00
// #FFFF33
// #F2EA02
// #E6FB04
// Neon Red:
// #FF0000
// #FD1C03
// #FF3300
// #FF6600
// Neon Green:
// #00FF00
// #00FF33
// #00FF66
// #33FF00
// Neon Blue:
// #00FFFF
// #099FFF
// #0062FF
// #0033FF
// Neon Pink:
// #FF00FF
// #FF00CC
// #FF0099
// #CC00FF
// Neon Purple:
// #9D00FF
// #CC00FF
// #6E0DD0
// #9900FF

    // { color: '#7FFF00', complements: []},
    // { color: '#00FA9A', complements: []},
    // { color: '#DDA0DD', complements: []},
    // { color: '#FF1493', complements: []},
    // { color: '#F8F8FF', complements: []},
    // { color: '#778899', complements: []},
    // { color: '#F4A460', complements: []},
  ]
  .concat(neons.map(n => ({ color: n })))

  // https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
  const palette = pickOne(palettes)
  const foreGrounds = getRandom(['white', 'black', 'red', 'yello', 'lime', '#FF4500', '#00BFFF'], 3)
  const blendMode = palette.blendMode ? 'mix-blend-mode: difference;' : ''
  if (!palette.complements || palette.complements.length === 0) {
    palette.complements = foreGrounds
  }
  // if no complements, use foreGrounds
  const makeSpan = t => {
    return `<span style='color: ${pickOne(palette.complements)}; ${blendMode} background: ${palette.color};'>${t}</span>`
  }
  const allText = bites.map(makeSpan).join('\n')
  $('#content').html(allText)
};

$(document).ready(() => launch() )

// nothing is in #content (by default)
// cycle through #hidden
// take one span at a time
//   place into #content
//   maximize size
const launch = () => {

  let input;

  params.etype = SketchLib.GetOption('engine') || 'markov'; // TODO: make sure is a valid engine
  params.ngram = parseInt(SketchLib.GetOption('ngram'), 10) || 5;
  var c = SketchLib.GetOption('content') || 'raw';

  var testinput = "as an apple is to a beta, this bridge is over the any hill. who says? she says! so says the soothsayer rapunzel. As Brad the Bard and Ken knew, the can-can can not know how to do it like an apple, like a bridge, like a beast of burden with a heavy load. And so what? The bald bearded bard sings a braided tale of happiness, of woe, of bitter embargoed apples on a barge passing under a bridegroom's bridge by a tepid, vapid moon. His beer is here, and all ale is well, hale, and hearty. This is not my bridge, it is your bridge, your toll bridge, your tool for trolls and travellers. I see you singing, Bradley Bard, I hear you. Your embalmer blames the bridge, his badge is barely adequate for the aqueduct, he ducks his dock responsibilities badly, baldly. Who is the third that walks beside you? How is he known, and how can he see in the dark (if, in fact, he can.) All what? All right, that is okay, he said.";

  var infoHide = $this => {
    $this.stop().animate({ bottom: infoBottom, opacity: 0.01 }, 'slow');
  };

  var infoShow = function ($this) {
    $this.stop().animate({ bottom: 0, opacity: 0.85 }, 'slow');
  };

  const $info = $('#info')
  const infoBottom = $info.css('bottom');
  $info.mouseenter(() =>  infoShow($info) ).mouseleave(() => infoHide($info) );

  infoShow($info);
  $info.fadeTo(10000, 0.01);

  tumblrRandomPost()
    .then(corpus => {
      const getIndex = pickFromRange(corpus.length - 1)
      params.curIndex = getIndex()
      const gen = generate(corpus, params)

      $(document).bind('keydown', 'r', () => gen())
      $(document).bind('keydown', 'h', () => infoHide($info))

      $(document).bind('keydown', 'n', () => {
        params.curIndex = getIndex()
        gen()
      })

      gen()

      $('#infobox').fadeOut(1000);
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
