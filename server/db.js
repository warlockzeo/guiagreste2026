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
  const existingBrands = db.exec("SELECT COUNT(*) as count FROM brands")[0]?.values[0][0] || 0;
  if (existingBrands > 0) {
    console.log(`Database already has ${existingBrands} brands, skipping seed`);
    return;
  }

  db.run('DELETE FROM posts');
  db.run('DELETE FROM follows');
  db.run('DELETE FROM conversations');
  db.run('DELETE FROM messages');
  db.run('DELETE FROM brands');
  db.run('DELETE FROM users');
  saveDB();

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
    'Maria Silva',
    'usuario@teste.com',
    bcrypt.hashSync('123456', 10)
  ]);

  const brands = [
    {
      name: 'Marands',
      email: 'contato@marands.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda masculina de qualidade. Casual e executivo.',
      category: 'Masculino',
      logo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop',
      instagram: '@marands',
      facebook: 'Marands',
      website: 'https://toritama-jeans.com/atacado/marands/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Waumitis Jeans',
      email: 'contato@waumitis.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@waumitis',
      facebook: 'Waumitis Jeans',
      website: 'https://toritama-jeans.com/atacado/waumitis-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Hamane',
      email: 'contato@hamane.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda denim de qualidade premium.',
      category: 'Jeans,Feminino,Masculino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@hamane',
      facebook: 'Hamane Denim',
      website: 'https://toritama-jeans.com/atacado/hamane/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Megaduran',
      email: 'contato@megaduran.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@megaduran',
      facebook: 'Megaduran',
      website: 'https://toritama-jeans.com/atacado/megaduran/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Radar',
      email: 'contato@radar.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda fitness e praia em atacado.',
      category: 'Fitness,Praia',
      logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
      instagram: '@radar',
      facebook: 'Radar',
      website: 'https://toritama-jeans.com/atacado/radar/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Faoro Jeans',
      email: 'contato@faorojeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Jeans de qualidade com caimento perfeito.',
      category: 'Jeans,Feminino,Masculino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@faorojeans',
      facebook: 'Faoro Jeans',
      website: 'https://toritama-jeans.com/atacado/faoro-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Flor de Renda',
      email: 'contato@florderenda.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina e infantil em atacado.',
      category: 'Feminino,Infantil',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@florderenda',
      facebook: 'Flor de Renda',
      website: 'https://toritama-jeans.com/atacado/flor-de-renda-kids/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Victhara Jeans',
      email: 'contato@victhara.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina e masculina em atacado.',
      category: 'Feminino,Masculino,Jeans',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@victhara',
      facebook: 'Victhara Jeans',
      website: 'https://toritama-jeans.com/atacado/victhara-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Valiant Jeans',
      email: 'contato@valiantjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans e feminina em atacado.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@valiantjeans',
      facebook: 'Valiant Jeans',
      website: 'https://toritama-jeans.com/atacado/valiant-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Marydy Jeans',
      email: 'contato@marydyjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@marydyjeans',
      facebook: 'Marydy Jeans',
      website: 'https://toritama-jeans.com/atacado/marydy-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Esther Sofia',
      email: 'contato@esthersofia.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda evangélica elegante e sofisticada.',
      category: 'Evangélica,Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@esthersofia',
      facebook: 'Esther Sofia',
      website: 'https://toritama-jeans.com/atacado/esther-sofia/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Swelus Jeans',
      email: 'contato@swelusjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina em atacado direto da fábrica.',
      category: 'Feminino,Jeans',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@swelusjeans',
      facebook: 'Swelus Jeans',
      website: 'https://toritama-jeans.com/atacado/swelus-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Phd Jeans',
      email: 'contato@phdjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans de qualidade em atacado.',
      category: 'Jeans,Feminino,Masculino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@phdjeans',
      facebook: 'Phd Jeans',
      website: 'https://toritama-jeans.com/atacado/phd-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Donaji Denim',
      email: 'contato@donajidenim.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@donajidenim',
      facebook: 'Donaji Denim',
      website: 'https://toritama-jeans.com/atacado/donaji-denim/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Mega Glamurosa',
      email: 'contato@megaglamurosa.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda plus size elegante e moderna.',
      category: 'Plus Size,Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@megaglamurosa',
      facebook: 'Mega Glamurosa',
      website: 'https://toritama-jeans.com/atacado/mega-glamurosa/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Dromedário',
      email: 'contato@dromedario.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda masculina de qualidade em atacado.',
      category: 'Masculino',
      logo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop',
      instagram: '@dromedario',
      facebook: 'Dromedário',
      website: 'https://toritama-jeans.com/atacado/dromedario/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Moça Morena',
      email: 'contato@mocamorena.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina elegante em atacado.',
      category: 'Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@mocamorena',
      facebook: 'Moça Morena',
      website: 'https://toritama-jeans.com/atacado/moca-morena/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Jett One',
      email: 'contato@jettone.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda masculina em atacado direto da fábrica.',
      category: 'Masculino',
      logo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop',
      instagram: '@jettone',
      facebook: 'Jett One',
      website: 'https://toritama-jeans.com/atacado/jett-one/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Blogueirinha',
      email: 'contato@blogueirinha.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina tendência em atacado.',
      category: 'Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@blogueirinha',
      facebook: 'Blogueirinha',
      website: 'https://toritama-jeans.com/atacado/blogueirinha/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: "D'Nirak",
      email: 'contato@dnirak.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@dnirak',
      facebook: "D'Nirak",
      website: 'https://toritama-jeans.com/atacado/dnirak/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Morena Mulata Jeans',
      email: 'contato@morena-mulata.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@morenamulatajeans',
      facebook: 'Morena Mulata Jeans',
      website: 'https://toritama-jeans.com/atacado/morena-mulata-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Contracenso Plus Size',
      email: 'contato@contracenso.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda plus size de qualidade em atacado.',
      category: 'Plus Size,Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@contracenso',
      facebook: 'Contracenso Plus Size',
      website: 'https://toritama-jeans.com/atacado/contracenso-plus-size/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Staccione',
      email: 'contato@staccione.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda masculina elegante em atacado.',
      category: 'Masculino',
      logo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop',
      instagram: '@staccione',
      facebook: 'Staccione',
      website: 'https://toritama-jeans.com/atacado/staccione/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Fio de Ló',
      email: 'contato@fiodelo.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina elegante em atacado.',
      category: 'Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@fiodelo',
      facebook: 'Fio de Ló',
      website: 'https://toritama-jeans.com/atacado/fio-de-lo/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Menbol Jeans',
      email: 'contato@menboljeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda masculina e feminina jeans em atacado.',
      category: 'Jeans,Masculino,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@menboljeans',
      facebook: 'Menbol Jeans',
      website: 'https://toritama-jeans.com/atacado/menbol-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Manhattan Jeans',
      email: 'contato@manhattanjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino,Masculino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@manhattanjeans',
      facebook: 'Manhattan Jeans',
      website: 'https://toritama-jeans.com/atacado/manhattan-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Bucarest Jeans',
      email: 'contato@bucarestjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@bucarestjeans',
      facebook: 'Bucarest Jeans',
      website: 'https://toritama-jeans.com/atacado/bucarest-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Pinkk Fitness',
      email: 'contato@pinkkfitness.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda fitness em atacado direto da fábrica.',
      category: 'Fitness,Feminino',
      logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
      instagram: '@pinkkfitness',
      facebook: 'Pinkk Fitness',
      website: 'https://toritama-jeans.com/atacado/pinkk-fitness/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Dellarth Jeans',
      email: 'contato@dellarthjeans.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda jeans em atacado direto da fábrica.',
      category: 'Jeans,Feminino',
      logo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
      instagram: '@dellarthjeans',
      facebook: 'Dellarth Jeans',
      website: 'https://toritama-jeans.com/atacado/dellarth-jeans/',
      cnpj: '',
      whatsapp: '',
      plan: 'free',
    },
    {
      name: 'Dona Valentine',
      email: 'contato@donavalentine.com.br',
      password: bcrypt.hashSync('123456', 10),
      phone: '',
      address: 'Polo de Confecções de Pernambuco',
      description: 'Moda feminina moderna em atacado.',
      category: 'Feminino',
      logo: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      instagram: '@donavalentine',
      facebook: 'Dona Valentine',
      website: 'https://toritama-jeans.com/atacado/dona-valentine/',
      cnpj: '',
      whatsapp: '',
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
  console.log(`Database seeded with ${brands.length} brands`);
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
