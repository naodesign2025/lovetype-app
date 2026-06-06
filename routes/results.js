const express = require('express');
const authMiddleware = require('../middleware/auth');
const supabase = require('../lib/supabase');

const router = express.Router();

// 診断結果を保存
router.post('/', authMiddleware, async (req, res) => {
  const { resultType, resultName, scores } = req.body;

  if (!resultType || !resultName || !scores) {
    return res.status(400).json({ error: '診断結果データが不完全です' });
  }

  try {
    const { data, error } = await supabase
      .from('results')
      .insert({
        user_id: req.user.userId,
        result_type: resultType,
        result_name: resultName,
        scores
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ result: data });
  } catch (err) {
    console.error('Save result error:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザーの診断履歴を取得
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ results: data });
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
