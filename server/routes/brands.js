import { Router } from 'express';
import { run, get, all } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { search, category, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sql = 'SELECT * FROM brands WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    sql += ' ORDER BY name';

    const totalResult = all(sql.replace('SELECT *', 'SELECT COUNT(*) as count'), params);
    const total = totalResult[0]?.count || 0;

    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const brands = all(sql, params).map((brand) => ({
      ...brand,
      categories: brand.category ? brand.category.split(',') : [],
      followersCount: get('SELECT COUNT(*) as count FROM follows WHERE brandId = ?', [brand.id])?.count || 0,
    }));

    res.json({ brands, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const brands = all('SELECT category FROM brands WHERE category IS NOT NULL');
    const categoriesSet = new Set();

    brands.forEach((brand) => {
      if (brand.category) {
        brand.category.split(',').forEach((cat) => {
          const trimmed = cat.trim();
          if (trimmed) categoriesSet.add(trimmed);
        });
      }
    });

    const categories = Array.from(categoriesSet).sort();
    res.json({ categories });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const followersCount = get('SELECT COUNT(*) as count FROM follows WHERE brandId = ?', [id])?.count || 0;

    res.json({
      ...brand,
      categories: brand.category ? brand.category.split(',') : [],
      followersCount,
    });
  } catch (error) {
    console.error('Erro ao buscar marca:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.categories && Array.isArray(updates.categories)) {
      updates.category = updates.categories.join(',');
      delete updates.categories;
    }

    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => updates[field]);

    run(`UPDATE brands SET ${setClause} WHERE id = ?`, [...values, id]);

    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);
    res.json({
      ...brand,
      categories: brand.category ? brand.category.split(',') : [],
    });
  } catch (error) {
    console.error('Erro ao atualizar marca:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/:id/posts', (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const totalResult = get('SELECT COUNT(*) as count FROM posts WHERE brandId = ?', [id]);
    const total = totalResult?.count || 0;

    const posts = all(
      'SELECT * FROM posts WHERE brandId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?',
      [id, Number(limit), offset]
    );

    const postsWithBrand = posts.map((post) => ({
      ...post,
      brandName: brand.name,
      brandLogo: brand.logo,
    }));

    res.json({ posts: postsWithBrand, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/:id/posts', (req, res) => {
  try {
    const { id } = req.params;
    const { image, caption } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'URL da imagem é obrigatória' });
    }

    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const result = run(
      'INSERT INTO posts (brandId, image, caption) VALUES (?, ?, ?)',
      [id, image, caption || '']
    );

    const post = get('SELECT * FROM posts WHERE id = ?', [result.lastInsertRowid]);

    res.json({ 
      posts: [{ ...post, brandName: brand.name, brandLogo: brand.logo }],
      message: 'Post criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.put('/:id/posts/:postId', (req, res) => {
  try {
    const { id, postId } = req.params;
    const { caption } = req.body;

    const post = get('SELECT * FROM posts WHERE id = ? AND brandId = ?', [postId, id]);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    run('UPDATE posts SET caption = ? WHERE id = ?', [caption || '', postId]);

    const updatedPost = get('SELECT * FROM posts WHERE id = ?', [postId]);
    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);

    res.json({ ...updatedPost, brandName: brand.name, brandLogo: brand.logo });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.delete('/:id/posts/:postId', (req, res) => {
  try {
    const { id, postId } = req.params;

    const post = get('SELECT * FROM posts WHERE id = ? AND brandId = ?', [postId, id]);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    run('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/:id/followers', (req, res) => {
  try {
    const { id } = req.params;

    const brand = get('SELECT * FROM brands WHERE id = ?', [id]);
    if (!brand) {
      return res.status(404).json({ error: 'Marca não encontrada' });
    }

    const followers = all(`
      SELECT u.id, u.name, u.email, GROUP_CONCAT(ui.category) as interests
      FROM follows f
      JOIN users u ON f.userId = u.id
      LEFT JOIN user_interests ui ON u.id = ui.userId
      WHERE f.brandId = ?
      GROUP BY u.id
      ORDER BY f.createdAt DESC
    `, [id]);

    const followersWithInterests = followers.map(f => ({
      ...f,
      interests: f.interests ? f.interests.split(',') : []
    }));

    res.json({ followers: followersWithInterests });
  } catch (error) {
    console.error('Erro ao buscar seguidores:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;
