const { Client } = require('pg');
const c = new Client({
  host: 'db.reipdepbltfbfxnjjegy.supabase.co',
  port: 5432, database: 'postgres', user: 'postgres',
  password: '02uL6rlxF2feKlY8', ssl: { rejectUnauthorized: false }
});

const BOOKS = [
  { slug: 'lulu-garden', title_zh: '露露的秘密花園', title_en: "Lulu's Secret Garden", age: '3-5', emoji: '🌸' },
  { slug: 'bear-kitchen', title_zh: '小熊的魔法廚房', title_en: "Bear's Magic Kitchen", age: '3-5', emoji: '🧁' },
  { slug: 'dino-school', title_zh: '恐龍上學記', title_en: 'Dinosaur Goes to School', age: '4-6', emoji: '🎒' },
  { slug: 'ocean-friends', title_zh: '海底好朋友', title_en: 'Ocean Friends', age: '4-6', emoji: '🐠' },
  { slug: 'robot-dream', title_zh: '機器人的夢想', title_en: "Robot's Dream", age: '7-9', emoji: '🤖' },
  { slug: 'time-travel', title_zh: '時光旅行日記', title_en: 'Time Travel Diary', age: '7-9', emoji: '⏰' },
  { slug: 'star-musician', title_zh: '星球音樂家', title_en: 'Star Musician', age: '8-10', emoji: '🎵' },
  { slug: 'code-island', title_zh: '程式島冒險', title_en: 'Code Island Adventure', age: '10-12', emoji: '💻' },
  { slug: 'dragon-library', title_zh: '龍的圖書館', title_en: "Dragon's Library", age: '10-12', emoji: '🐉' },
];

const PAGES = {
  'lulu-garden': [
    ['露露在後院發現了一扇小門。', 'Lulu found a tiny door in the backyard.'],
    ['門後面是一座開滿花的花園。', 'Behind the door was a garden full of flowers.'],
    ['蝴蝶帶著她飛過花叢。', 'Butterflies guided her through the blossoms.'],
    ['她發現每朵花都會唱歌。', 'She discovered every flower could sing.'],
    ['露露決定每天都來照顧花園。', 'Lulu decided to visit and tend the garden every day.'],
  ],
  'bear-kitchen': [
    ['小熊今天想做一個蛋糕。', 'Little Bear wanted to bake a cake today.'],
    ['他把所有材料放在桌上。', 'He placed all the ingredients on the table.'],
    ['攪拌的時候，麵糊變成了彩虹色！', 'While mixing, the batter turned rainbow-colored!'],
    ['蛋糕烤好了，香味飄滿整間屋子。', 'The cake was done, filling the house with sweet aroma.'],
    ['朋友們都來了，大家一起享用。', 'All his friends came, and everyone enjoyed it together.'],
  ],
  'dino-school': [
    ['小恐龍第一天上學，有點緊張。', 'Little Dino was nervous on the first day of school.'],
    ['老師是一隻溫柔的長頸龍。', 'The teacher was a gentle Brachiosaurus.'],
    ['他們學習數數和唱歌。', 'They learned counting and singing.'],
    ['午餐時間，大家分享帶來的食物。', 'At lunch, everyone shared the food they brought.'],
    ['放學時，小恐龍已經交到了好朋友。', "By the end of the day, Little Dino had made good friends."],
  ],
  'ocean-friends': [
    ['小魚悠悠住在珊瑚礁裡。', 'Little fish Youyou lived in a coral reef.'],
    ['有一天，她遇見了一隻迷路的海龜。', 'One day, she met a lost sea turtle.'],
    ['他們一起穿過海藻森林。', 'Together they swam through a kelp forest.'],
    ['海豚加入了他們的冒險。', 'A dolphin joined their adventure.'],
    ['終於找到海龜的家，大家都好開心。', "They finally found the turtle's home, and everyone was happy."],
  ],
  'robot-dream': [
    ['小機器人每天在工廠裡工作。', 'Little Robot worked in the factory every day.'],
    ['他夢想有一天能看到星星。', 'He dreamed of seeing the stars someday.'],
    ['他開始自己組裝一對翅膀。', 'He started building a pair of wings on his own.'],
    ['終於，他飛上了夜空。', 'Finally, he flew into the night sky.'],
    ['星星比他想像的還要美麗。', 'The stars were even more beautiful than he had imagined.'],
  ],
  'time-travel': [
    ['小安打開了一本古老的日記本。', 'Xiao An opened an ancient diary.'],
    ['日記把他帶到了一百年前的台灣。', 'The diary transported him to Taiwan 100 years ago.'],
    ['他看到了蒸汽火車和傳統市場。', 'He saw steam trains and traditional markets.'],
    ['一位老奶奶教他做傳統點心。', 'An old grandmother taught him to make traditional snacks.'],
    ['回到現在，他更珍惜身邊的一切。', 'Back in the present, he treasured everything around him more.'],
  ],
  'star-musician': [
    ['在遙遠的星球上，住著一位小音樂家。', 'On a faraway planet lived a young musician.'],
    ['她的樂器是用星光做成的。', 'Her instrument was made of starlight.'],
    ['每個音符都會變成一顆流星。', 'Every note she played became a shooting star.'],
    ['其他星球的居民都來聽她演奏。', 'Residents from other planets came to hear her play.'],
    ['音樂讓整個銀河系充滿了和平。', 'Her music filled the entire galaxy with peace.'],
  ],
  'code-island': [
    ['程式島是一座由程式碼建造的島嶼。', 'Code Island was built entirely from code.'],
    ['小凱發現島上的橋壞了。', "Xiao Kai discovered the island's bridge was broken."],
    ['他用邏輯積木修復了第一個bug。', 'He used logic blocks to fix the first bug.'],
    ['接著他學會了迴圈，建造了新的道路。', 'Then he learned loops and built new roads.'],
    ['整座島恢復運作，居民們歡呼慶祝。', 'The whole island was restored, and residents cheered.'],
  ],
  'dragon-library': [
    ['龍族有一座藏書百萬冊的圖書館。', 'The dragons had a library with a million books.'],
    ['小龍是圖書館的守護者。', "Little Dragon was the library's guardian."],
    ['有一天，一本書的文字消失了。', 'One day, the words in a book vanished.'],
    ['小龍踏上旅程，尋找失落的故事。', 'Little Dragon set out on a journey to find the lost story.'],
    ['他發現故事一直藏在讀者的心裡。', "He discovered the story had always lived in the readers' hearts."],
  ],
};

async function run() {
  await c.connect();

  // Insert books
  for (const b of BOOKS) {
    await c.query(
      `INSERT INTO books (slug, title_zh, title_en, age_tier, page_count, cover_url, price_ntd, is_demo, status)
       VALUES ($1, $2, $3, $4, 5, '', 99, false, 'published')
       ON CONFLICT (slug) DO NOTHING`,
      [b.slug, b.title_zh, b.title_en, b.age]
    );
    console.log('Book:', b.slug);
  }

  // Insert pages
  for (const [slug, pages] of Object.entries(PAGES)) {
    const res = await c.query('SELECT id FROM books WHERE slug = $1', [slug]);
    if (!res.rows.length) { console.log('Skip pages for', slug); continue; }
    const bookId = res.rows[0].id;

    for (let i = 0; i < pages.length; i++) {
      await c.query(
        `INSERT INTO book_pages (book_id, page_num, text_zh, text_en, image_url)
         VALUES ($1, $2, $3, $4, '')
         ON CONFLICT (book_id, page_num) DO NOTHING`,
        [bookId, i + 1, pages[i][0], pages[i][1]]
      );
    }
    console.log('Pages:', slug);
  }

  // Verify
  const r = await c.query('SELECT slug, title_zh, age_tier, price_ntd, is_demo FROM books ORDER BY age_tier, slug');
  console.log('\nAll books:');
  r.rows.forEach(b => console.log(`  ${b.is_demo ? 'DEMO' : 'NT$' + b.price_ntd}  ${b.age_tier}  ${b.title_zh} (${b.slug})`));
  const p = await c.query('SELECT count(*) as total FROM book_pages');
  console.log('Total pages:', p.rows[0].total);

  await c.end();
}
run();
