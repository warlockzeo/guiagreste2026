import { Router } from 'express';
import { run, get, all } from '../db.js';

const router = Router();

router.get('/:id/follows', (req, res) => {
  try {
    const { id } = req.params;

    const follows = all(`
      SELECT b.* FROM brands b
      JOIN follows f ON b.id = f.brandId
      WHERE f.userId = ?
    `, [id]);

    const brands = follows.map((brand) => ({
      ...brand,
      categories: brand.category ? brand.category.split(',') : [],
      followersCount: get('SELECT COUNT(*) as count FROM follows WHERE brandId = ?', [brand.id])?.count || 0,
    }));

    res.json({ brands });
  } catch (error) {
    console.error('Erro ao buscar follows:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/:id/follows', (req, res) => {
  try {
    const { id } = req.params;
    const { brandId } = req.body;

    if (!brandId) {
      return res.status(400).json({ error: 'brandId é obrigatório' });
    }

    const user = get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const brand = get('SELECT * FROM brands WHERE id = ?', [brandId]);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const existing = get('SELECT * FROM follows WHERE userId = ? AND brandId = ?', [id, brandId]);
    if (existing) {
      return res.status(400).json({ error: 'Você já segue esta marca' });
    }

    run('INSERT INTO follows (userId, brandId) VALUES (?, ?)', [id, brandId]);

    res.json({ message: 'Você agora segue esta marca' });
  } catch (error) {
    console.error('Erro ao seguir:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.delete('/:id/follows/:brandId', (req, res) => {
  try {
    const { id, brandId } = req.params;

    const existing = get('SELECT * FROM follows WHERE userId = ? AND brandId = ?', [id, brandId]);
    if (!existing) {
      return res.status(404).json({ error: 'Você não segue esta marca' });
    }

    run('DELETE FROM follows WHERE userId = ? AND brandId = ?', [id, brandId]);

    res.json({ message: 'Você deixou de seguir esta marca' });
  } catch (error) {
    console.error('Erro ao deixar de seguir:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
