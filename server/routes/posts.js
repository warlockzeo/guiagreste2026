import { Router } from 'express';
import { all, get } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sql = `
      SELECT p.*, b.name as brandName, b.logo as brandLogo, b.category as brandCategory
      FROM posts p
      JOIN brands b ON p.brandId = b.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND b.category LIKE ?';
      params.push(`%${category}%`);
    }

    sql += ' ORDER BY p.createdAt DESC';

    const totalResult = get(
      `SELECT COUNT(*) as count FROM posts p JOIN brands b ON p.brandId = b.id ${category ? 'WHERE b.category LIKE ?' : ''}`,
      category ? [`%${category}%`] : []
    );
    const total = totalResult?.count || 0;

    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const posts = all(sql, params);

    res.json({ posts, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
