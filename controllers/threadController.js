const Thread = require('../models/Thread');

exports.createThread = async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ message: 'Missing fields' });
  const thread = await Thread.create({ title, body, author: req.user._id });
  res.status(201).json(thread);
};

exports.listThreads = async (req, res) => {
  const threads = await Thread.find().populate('author', 'name email').select('-comments');
  res.json(threads);
};

function buildTree(comments) {
  const map = {};
  comments.forEach(c => { map[c._id] = { ...c.toObject(), replies: [] }; });
  const roots = [];
  comments.forEach(c => {
    if (c.parent) {
      const p = map[c.parent];
      if (p) p.replies.push(map[c._id]);
      else roots.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });
  return roots;
}

exports.getThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id).populate('author', 'name email').populate('comments.author', 'name email');
  if (!thread) return res.status(404).json({ message: 'Not found' });
  const nested = buildTree(thread.comments);
  const out = thread.toObject();
  out.comments = nested;
  res.json(out);
};

exports.deleteThread = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const thread = await Thread.findByIdAndDelete(req.params.id);
  if (!thread) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

exports.addComment = async (req, res) => {
  const thread = await Thread.findById(req.params.id);
  if (!thread) return res.status(404).json({ message: 'Not found' });
  const { body, parent } = req.body;
  if (!body) return res.status(400).json({ message: 'Missing body' });
  const comment = { author: req.user._id, body, parent: parent || null };
  thread.comments.push(comment);
  await thread.save();
  res.status(201).json(thread.comments[thread.comments.length - 1]);
};

exports.replyComment = async (req, res) => {
  const thread = await Thread.findOne({ 'comments._id': req.params.id });
  if (!thread) return res.status(404).json({ message: 'Not found' });
  const parentId = req.params.id;
  const { body } = req.body;
  if (!body) return res.status(400).json({ message: 'Missing body' });
  const comment = { author: req.user._id, body, parent: parentId };
  thread.comments.push(comment);
  await thread.save();
  res.status(201).json(thread.comments[thread.comments.length - 1]);
};
