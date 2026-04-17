import { Router } from 'express';
import { run, get, all } from '../db.js';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { userId, brandId } = req.body;

    if (!userId || !brandId) {
      return res.status(400).json({ error: 'userId e brandId são obrigatórios' });
    }

    let existing = get('SELECT * FROM conversations WHERE userId = ? AND brandId = ?', [userId, brandId]);

    if (!existing) {
      run('INSERT INTO conversations (userId, brandId) VALUES (?, ?)', [userId, brandId]);
      existing = get('SELECT * FROM conversations WHERE userId = ? AND brandId = ?', [userId, brandId]);
    }

    const brand = get('SELECT * FROM brands WHERE id = ?', [brandId]);

    res.json({
      ...existing,
      brandName: brand?.name || '',
      brandLogo: brand?.logo || '',
    });
  } catch (error) {
    console.error('Erro ao criar/buscar conversa:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/user/:id', (req, res) => {
  try {
    const { id } = req.params;

    const conversations = all(`
      SELECT c.*, b.name as brandName, b.logo as brandLogo,
        (SELECT content FROM messages WHERE conversationId = c.id ORDER BY createdAt DESC LIMIT 1) as lastMessage
      FROM conversations c
      JOIN brands b ON c.brandId = b.id
      WHERE c.userId = ?
      ORDER BY c.createdAt DESC
    `, [id]);

    res.json({ conversations });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/brand/:id', (req, res) => {
  try {
    const { id } = req.params;

    const conversations = all(`
      SELECT c.*, b.name as brandName, b.logo as brandLogo,
        (SELECT content FROM messages WHERE conversationId = c.id ORDER BY createdAt DESC LIMIT 1) as lastMessage
      FROM conversations c
      JOIN brands b ON c.brandId = b.id
      WHERE c.brandId = ?
      ORDER BY c.createdAt DESC
    `, [id]);

    res.json({ conversations });
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/:id/messages', (req, res) => {
  try {
    const { id } = req.params;

    const messages = all(
      'SELECT * FROM messages WHERE conversationId = ? ORDER BY createdAt ASC',
      [id]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/:id/messages', (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderType, content } = req.body;

    if (!senderId || !senderType || !content) {
      return res.status(400).json({ error: 'senderId, senderType e content são obrigatórios' });
    }

    run(
      'INSERT INTO messages (conversationId, senderId, senderType, content) VALUES (?, ?, ?, ?)',
      [id, senderId, senderType, content]
    );

    const message = get('SELECT * FROM messages ORDER BY id DESC LIMIT 1');

    res.json(message);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
