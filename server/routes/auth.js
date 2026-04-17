import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, get } from '../db.js';

const router = Router();
const JWT_SECRET = 'guiagreste-secret-key-2024';

router.post('/user/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const existing = get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const user = {
      id: result.lastInsertRowid,
      name,
      email,
      type: 'user',
    };

    const token = jwt.sign({ id: user.id, type: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/brand/register', (req, res) => {
  try {
    const { name, email, password, phone, address, description, categories, cnpj } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const existing = get('SELECT id FROM brands WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = run(
      `INSERT INTO brands (name, email, password, phone, address, description, category, cnpj)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone || '', address || '', description || '', categories || '', cnpj || '']
    );

    const brand = {
      id: result.lastInsertRowid,
      name,
      email,
      phone: phone || '',
      address: address || '',
      description: description || '',
      categories: categories ? categories.split(',') : [],
      type: 'brand',
    };

    const token = jwt.sign({ id: brand.id, type: 'brand' }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: brand, token });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    let user = get('SELECT * FROM users WHERE email = ?', [email]);
    let type = 'user';

    if (!user) {
      user = get('SELECT * FROM brands WHERE email = ?', [email]);
      type = 'brand';
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const userData = type === 'brand'
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          description: user.description,
          categories: user.category ? user.category.split(',') : [],
          logo: user.logo,
          instagram: user.instagram,
          facebook: user.facebook,
          website: user.website,
          cnpj: user.cnpj,
          whatsapp: user.whatsapp,
          type: 'brand',
        }
      : {
          id: user.id,
          name: user.name,
          email: user.email,
          type: 'user',
        };

    const token = jwt.sign({ id: user.id, type }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: userData, token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
