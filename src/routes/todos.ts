import { Router } from 'express';
import { createAuthenticatedClient } from '../supabase'; // 👈 CHANGED import
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes in this file
router.use(authenticateUser);

// Get all todos for authenticated user
router.get('/', async (req, res) => {
  const userId = req.userId!;
  const userToken = req.userToken!; // 👈 ADD

  const supabase = createAuthenticatedClient(userToken); // 👈 ADD

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get todos for a specific list
router.get('/list/:listId', async (req, res) => {
  const { listId } = req.params;
  const userToken = req.userToken!; // 👈 ADD

  const supabase = createAuthenticatedClient(userToken); // 👈 ADD

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create a new todo
router.post('/', async (req, res) => {
  const userId = req.userId!;
  const userToken = req.userToken!; // 👈 ADD
  const { title, list_id } = req.body;

  const supabase = createAuthenticatedClient(userToken); // 👈 ADD

  const { data, error } = await supabase
    .from('todos')
    .insert({ title, list_id, user_id: userId })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// Update a todo
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userToken = req.userToken!; // 👈 ADD

  const supabase = createAuthenticatedClient(userToken); // 👈 ADD

  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userToken = req.userToken!; // 👈 ADD

  const supabase = createAuthenticatedClient(userToken); // 👈 ADD

  const { error } = await supabase.from('todos').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
