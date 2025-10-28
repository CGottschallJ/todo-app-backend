import { Router } from 'express';
import { createAuthenticatedClient } from '../supabase';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes in this file
router.use(authenticateUser);

// Get all lists for authenticated user
router.get('/', async (req, res) => {
  const userId = req.userId!;
  const userToken = req.userToken!;

  const supabase = createAuthenticatedClient(userToken);

  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new list
router.post('/', async (req, res) => {
  const userId = req.userId!;
  const userToken = req.userToken!;
  const { name } = req.body;

  const supabase = createAuthenticatedClient(userToken);

  const { data, error } = await supabase
    .from('lists')
    .insert({ name, user_id: userId })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Delete a list
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userToken = req.userToken!;

  const supabase = createAuthenticatedClient(userToken);

  const { error } = await supabase.from('lists').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Update a list
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userToken = req.userToken!;

  const supabase = createAuthenticatedClient(userToken);

  const { data, error } = await supabase
    .from('lists')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
