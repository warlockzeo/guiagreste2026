import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;
let SQL;

const TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    description TEXT,
    category TEXT,
    logo TEXT,
    instagram TEXT,
    facebook TEXT,
    website TEXT,
    cnpj TEXT,
    whatsapp TEXT,
    plan TEXT DEFAULT 'free',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brandId INTEGER NOT NULL,
    image TEXT NOT NULL,
    caption TEXT,
    category TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brandId) REFERENCES brands(id)
  );

  CREATE TABLE IF NOT EXISTS follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    brandId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (brandId) REFERENCES brands(id),
    UNIQUE(userId, brandId)
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    brandId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (brandId) REFERENCES brands(id),
    UNIQUE(userId, brandId)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId INTEGER NOT NULL,
    senderId INTEGER NOT NULL,
    senderType TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversationId) REFERENCES conversations(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    brandId INTEGER NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (brandId) REFERENCES brands(id)
  );

  CREATE TABLE IF NOT EXISTS user_interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    category TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    UNIQUE(userId, category)
  );
`;

async function initDB() {
  const SQLModule = await initSqlJs();
  SQL = SQLModule;
  
  const dbPath = path.join(__dirname, 'guiagreste.db');
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQLModule.Database(buffer);
  } else {
    db = new SQLModule.Database();
  }

  db.run(TABLES_SQL);

  return db;
}

function saveDB() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.join(__dirname, 'guiagreste.db'), buffer);
  }
}

async function seed() {
  const result = db.exec('SELECT COUNT(*) as count FROM brands');
  if (result.length > 0 && result[0].values[0][0] > 0) {
    console.log('Database already seeded');
    
    const userResult = db.exec('SELECT COUNT(*) as count FROM users');
    if (userResult.length === 0 || userResult[0].values[0][0] === 0) {
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        'Maria Silva',
        'usuario@teste.com',
        bcrypt.hashSync('123456', 10)
      ]);
      saveDB();
      console.log('Test user added');
    }
    return;
  }

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
    'Maria Silva',
    'usuario@teste.com',
    bcrypt.hashSync('123456', 10)
  ]);

  const brands = [
    {
      name: 'Vanessa Modas',
      email: 'contato@vanessamodas.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-1234',
      address: 'Moda Center Santa Cruz, Box 142',
      description: 'Moda feminina elegante e moderna. Peças únicas para todas as ocasiões.',
      category: 'Feminino,Acessórios',
      logo: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop',
      instagram: '@vanessamodas',
      facebook: 'Vanessa Modas',
      website: '',
      cnpj: '12.345.678/0001-90',
      whatsapp: '(81) 99999-1234',
      plan: 'vip',
    },
    {
      name: 'Estilo Masculino',
      email: 'vendas@estilomasculino.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-2345',
      address: 'Moda Center Santa Cruz, Box 89',
      description: 'Roupas masculinas de qualidade. Casual e executivo.',
      category: 'Masculino,Esportivo',
      logo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop',
      instagram: '@estilomasculinobr',
      facebook: 'Estilo Masculino',
      website: 'www.estilomasculino.com.br',
      cnpj: '23.456.789/0001-01',
      whatsapp: '(81) 99999-2345',
      plan: 'free',
    },
    {
      name: 'Kids Fashion',
      email: 'contato@kidsfashion.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-3456',
      address: 'Moda Center Santa Cruz, Box 256',
      description: 'Moda infantil divertida e confortável. Do newborn ao teen.',
      category: 'Infantil',
      logo: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=200&h=200&fit=crop',
      instagram: '@kidsfashionbr',
      facebook: 'Kids Fashion Brasil',
      website: '',
      cnpj: '34.567.890/0001-12',
      whatsapp: '(81) 99999-3456',
      plan: 'free',
    },
    {
      name: 'Acessórios da Moda',
      email: 'vendas@acessoriosdamoda.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-4567',
      address: 'Moda Center Santa Cruz, Box 178',
      description: 'Bolsas, cintos, bijuterias e muito mais. Complete seu look.',
      category: 'Acessórios',
      logo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
      instagram: '@acessoriosdamodabr',
      facebook: 'Acessórios da Moda',
      website: '',
      cnpj: '45.678.901/0001-23',
      whatsapp: '(81) 99999-4567',
      plan: 'vip',
    },
    {
      name: 'Sapatilha & CIA',
      email: 'contato@sapatilha.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-5678',
      address: 'Moda Center Santa Cruz, Box 312',
      description: 'Calçados femininos para todas as horas. Conforto e estilo.',
      category: 'Calçados,Feminino',
      logo: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop',
      instagram: '@sapatilhaencia',
      facebook: 'Sapatilha & CIA',
      website: '',
      cnpj: '56.789.012/0001-34',
      whatsapp: '(81) 99999-5678',
      plan: 'free',
    },
    {
      name: 'Beach Style PE',
      email: 'vendas@beachstylepe.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-6789',
      address: 'Moda Center Santa Cruz, Box 445',
      description: 'Moda praia completa. Maiôs, biquínis, saídas e accessories.',
      category: 'Moda Praia,Acessórios',
      logo: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=200&h=200&fit=crop',
      instagram: '@beachstylepe',
      facebook: 'Beach Style PE',
      website: 'www.beachstylepe.com.br',
      cnpj: '67.890.123/0001-45',
      whatsapp: '(81) 99999-6789',
      plan: 'vip',
    },
    {
      name: 'Fitness Pro Wear',
      email: 'contato@fitnessprowear.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-7890',
      address: 'Moda Center Santa Cruz, Box 523',
      description: 'Roupas esportivas de alta performance. Para academia e esporte.',
      category: 'Esportivo,Masculino,Feminino',
      logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
      instagram: '@fitnessprowear',
      facebook: 'Fitness Pro Wear',
      website: '',
      cnpj: '78.901.234/0001-56',
      whatsapp: '(81) 99999-7890',
      plan: 'free',
    },
    {
      name: 'Jeans House',
      email: 'vendas@jeanshouse.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-8901',
      address: 'Moda Center Santa Cruz, Box 634',
      description: 'Jeans de qualidade com caimento perfeito. Do clássico ao moderno.',
      category: 'Jeans,Masculino,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@jeanshouseoficial',
      facebook: 'Jeans House',
      website: '',
      cnpj: '89.012.345/0001-67',
      whatsapp: '(81) 99999-8901',
      plan: 'vip',
    },
    {
      name: 'Lingerie Premium',
      email: 'contato@lingeriepremium.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-9012',
      address: 'Moda Center Santa Cruz, Box 712',
      description: 'Lingeries finas e delicadas. Conforto e elegância para o dia a dia.',
      category: 'Lingerie,Feminino',
      logo: 'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f4?w=200&h=200&fit=crop',
      instagram: '@lingeriepremiumbr',
      facebook: 'Lingerie Premium',
      website: 'www.lingeriepremium.com.br',
      cnpj: '90.123.456/0001-78',
      whatsapp: '(81) 99999-9012',
      plan: 'free',
    },
    {
      name: 'Casual & Co',
      email: 'vendas@casualeco.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '(81) 3731-0123',
      address: 'Moda Center Santa Cruz, Box 823',
      description: 'Moda casual contemporânea. Peças versáteis para o dia a dia.',
      category: 'Feminino,Masculino,Infantil',
      logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
      instagram: '@casualeco',
      facebook: 'Casual & Co',
      website: '',
      cnpj: '01.234.567/0001-89',
      whatsapp: '(81) 99999-0123',
      plan: 'free',
    },
  ];

  for (const brand of brands) {
    db.run(
      `INSERT INTO brands (name, email, password, phone, address, description, category, logo, instagram, facebook, website, cnpj, whatsapp, plan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [brand.name, brand.email, brand.password, brand.phone, brand.address, brand.description, brand.category, brand.logo, brand.instagram, brand.facebook, brand.website, brand.cnpj, brand.whatsapp, brand.plan]
    );
  }

  const clothingImages = [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1485968579169-23f8fce34e74?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1441986301817-9b2269e3970f?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
  ];

  const captions = [
    'Novo lote disponível!',
    'Peça do dia - Cor exclusiva',
    'Últimas unidades!',
    'Lançamento da coleção',
    'Promoção imperdível',
    'Vista-se bem todos os dias',
    'Qualidade que você merece',
    'Tendência da temporada',
    'Conforto e estilo juntos',
    'Moda que combina com você',
  ];

  for (let brandId = 1; brandId <= 10; brandId++) {
    for (let i = 0; i < 5; i++) {
      const image = clothingImages[Math.floor(Math.random() * clothingImages.length)];
      const caption = captions[Math.floor(Math.random() * captions.length)];
      db.run('INSERT INTO posts (brandId, image, caption) VALUES (?, ?, ?)', [brandId, image, caption]);
    }
  }

  saveDB();
  console.log('Database seeded with 10 brands and 50 posts');
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDB();
  return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0][0] };
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export { initDB, seed, run, get, all, saveDB, db };
