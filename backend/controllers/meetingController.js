const Meeting = require('../models/Meeting');
const Task = require('../models/Task');

const getMeetings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // Get meetings where the user is either the host or a participant
    const meetings = await Meeting.find({
      $or: [
        { hostId: userId },
        { participants: userId }
      ]
    })
      .populate('hostId', 'name email avatar')
      .populate('participants', 'name email avatar')
      .sort({ scheduledAt: -1 });

    return res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

const createMeeting = async (req, res, next) => {
  try {
    const { title, participants, scheduledAt, status } = req.body;
    const hostId = req.user.userId;

    const newMeeting = new Meeting({
      title,
      hostId,
      participants: participants || [],
      scheduledAt,
      status: status || 'scheduled',
    });

    await newMeeting.save();
    return res.status(201).json(newMeeting);
  } catch (error) {
    next(error);
  }
};

const getMeetingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id)
      .populate('hostId', 'name email avatar')
      .populate('participants', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Authorization check: User must be host or participant
    const userId = req.user.userId;
    const isHost = meeting.hostId._id.toString() === userId;
    const isParticipant = meeting.participants.some(p => p._id.toString() === userId);

    if (!isHost && !isParticipant) {
      return res.status(403).json({ error: 'Access denied. You are not a participant of this meeting.' });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

const updateMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Only host can update meeting settings
    if (meeting.hostId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. Only the host can modify this meeting.' });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedMeeting);
  } catch (error) {
    next(error);
  }
};

const saveSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { summary, actionItems, transcript } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Authorize host or participants to save summary
    const userId = req.user.userId;
    const isHost = meeting.hostId.toString() === userId;
    const isParticipant = meeting.participants.includes(userId);

    if (!isHost && !isParticipant) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Update meeting summary, actionItems, transcript
    meeting.summary = summary || meeting.summary;
    meeting.transcript = transcript || meeting.transcript;
    if (actionItems) {
      meeting.actionItems = actionItems;
    }
    meeting.status = 'completed';

    await meeting.save();

    // If new action items are submitted, we can auto-create corresponding tasks
    // mapping the action item assignees to users if matching names/emails are found
    // Here we will keep it simple and return the completed meeting details.
    return res.status(200).json({
      message: 'Meeting summary and action items updated successfully.',
      meeting
    });
  } catch (error) {
    next(error);
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Only host can delete meeting
    if (meeting.hostId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. Only the host can delete this meeting.' });
    }

    await Meeting.findByIdAndDelete(id);

    // Cascading delete tasks associated with this meeting
    await Task.deleteMany({ meetingId: id });

    return res.status(200).json({ message: 'Meeting and associated tasks deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeetings,
  createMeeting,
  getMeetingById,
  updateMeeting,
  saveSummary,
  deleteMeeting,
};
