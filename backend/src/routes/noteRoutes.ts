import express, { Request, Response } from 'express';
import Note, { INote } from '../models/Note';
import { body, validationResult, query } from 'express-validator';

const router = express.Router();

// GET /api/notes - Retrieve all notes (with optional filters)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('userId').optional().isString(),
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Invalid query parameters', details: errors.array() });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;

    const filters: any = { isDeleted: { $ne: true } };
    if (userId) {
      filters.userId = userId;
    }

    const notes = await Note.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Note.countDocuments(filters);

    res.json({
      success: true,
      data: {
        notes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalNotes: total
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

// SEARCH /api/notes/search - Search notes by title or content
// Must be defined BEFORE the /:id route to avoid route collision
router.get('/search/:query', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req: Request, res: Response) => {
  try {
    const query = req.params.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const searchResults = await Note.find({
      $text: { $search: query },
      isDeleted: { $ne: true }
    })
    .sort({ score: { $meta: 'textScore' } }) // Sort by text search score
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Note.countDocuments({
      $text: { $search: query },
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      data: {
        notes: searchResults,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

// GET /:id - Retrieve a specific note by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      isDeleted: { $ne: true }
    });

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

// POST /api/notes - Create a new note
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be between 1-200 characters'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('userId').optional().isString()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const { title, content, userId } = req.body;

    const newNote = new Note({
      title,
      content,
      userId: userId || undefined
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      success: true,
      data: savedNote,
      message: 'Note created successfully'
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1-200 characters if provided'),
  body('content').optional().trim().isLength({ min: 1 }).withMessage('Content must have at least 1 character if provided')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    }

    const noteId = req.params.id;
    const updateData = req.body;

    // Only allow updating specific fields
    const allowedUpdates = ['title', 'content', 'userId'];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, error: 'Invalid updates!' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, isDeleted: { $ne: true } },
      { ...updateData, updatedAt: new Date() }, // Explicitly set updatedAt
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

// DELETE /api/notes/:id - Soft delete a note (mark as deleted)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, isDeleted: { $ne: true } },
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({
      success: true,
      data: note,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
  return; // Add explicit return
});

export default router;